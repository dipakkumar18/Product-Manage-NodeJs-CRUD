const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

const registerUser =  async(req,res)=>{
    const { name, email, phone, password } = req.body;
    
    if(!name || !email || !phone || !password){
        return res.status(400).json({message:"All Fields are required"});
    } 

    const userAvailble = await User.findOne({email});
    if(userAvailble){
        return res.status(400).json({message:"Existing User. Pleas try to Login"});
    }

    //create Hash password
    const hashPassword = await bcrypt.hash(password,10);
    const user = await User.create({
        name, email, phone, password: hashPassword
    })

    res.status(201).json({message:"User Registered","user":user});
};


const loginUser =  async(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({message:"All Fields are required"});
    } 

    const user = await User.findOne({email});
    //compare password with hash paswword
    if(user &&  (await bcrypt.compare(password,user.password))){
        const token = jwt.sign(
            { user:{userId: user._id} },
            process.env.SECRET_KEY,
            {expiresIn: "1h"}
        );

        //store token cooie
        // res.cookie("auth_token",token,{httpOnly:true});
        res.status(200).json({token});
    }
    else{
        return res.status(401).json({message:"Email and Password is not valid"});
    }
};


const viewProfile = async (req,res)=>{
    try {
        const user = await User.findById(req.user.userId, { password: 0,role:0 });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
    
        res.json(user);

      } catch (err) {
              return res.status(500).json({ message: "Server Error" });
      }
}

const updateProfile = async (req,res)=>{
    try {
        const { name, email, phone, password } = req.body;
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();

        res.json({ message: "Profile updated successfully"});
    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
        
    }
}

module.exports = {registerUser, loginUser, viewProfile, updateProfile};
