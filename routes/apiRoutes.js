const express = require("express");
const { registerUser, loginUser, viewProfile, updateProfile } = require("../controllers/api/authController");
const apiAuthentication = require("../middleware/apiAuthentication");

const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile",apiAuthentication,viewProfile);
router.put("/profile",apiAuthentication,updateProfile);

module.exports = router;
