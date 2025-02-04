const jwt = require("jsonwebtoken");

const apiAuthentication = async(req, res, next) => {
    //let token = req.cookie.auth_token;
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    try {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Token is missing or invalid" });
        }
            
        token = authHeader.split(" ")[1];
        jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
            if(err){
                return res.status(401).json({ message: "User is not authorized" });
            }
            req.user = decoded;
            next();
        });
    
    } catch (error) {
        res.status(401).json({ message: "Server Error" });
    }
   
};

module.exports = apiAuthentication;
