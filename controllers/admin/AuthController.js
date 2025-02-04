const User = require("../../models/User");
const bcrypt = require('bcryptjs');


const loginPage = (req, res) => res.render("users/login");

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email, role: "admin" });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    
    if(user &&  (await bcrypt.compare(password,user.password))){
        req.session.admin = true;
        req.session.user = user;
        return res.status(200).json({ message: "Login Succeesfull." });
    }
    else{
      return res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
    
  }

};

const logout = async(req, res) => {
  req.session.destroy((err) => {
      if (err) {
          return res.status(500).json({ message: 'Failed to log out' });
      }
      res.redirect('/'); 
  });
};

module.exports = {loginPage,login,logout};