const express = require("express");
const { loginPage, login,  logout } = require("../controllers/admin/AuthController");
const adminAuthentication = require("../middleware/adminAuthentication");

const router = express.Router();
router.get("/", loginPage);
router.post("/login", login);

router.get("/logout", adminAuthentication, logout);



module.exports = router;
