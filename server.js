require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const apiRoute = require("./routes/apiRoutes");
const adminRoute = require("./routes/adminRoutes");
const productRoute = require("./routes/productRoutes");
const categoryRoute = require("./routes/categoryRoutes");


const connectDb = require('./config/dbConnection');

const app = express();
app.use(express.static("public"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));  
app.use(express.json());  


//Connect to Database
connectDb();

 
app.use(session({ secret: process.env.SECRET_KEY,  resave: false,  saveUninitialized: true,}));
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;  
    next();
});

//API Routes
app.use("/api", apiRoute); 

//admin routes
app.use("/", adminRoute);

//Products Routes
app.use("/products",productRoute);

//Categories routes
app.use("/categories",categoryRoute);

const port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`server running on port : ${port}`);
})