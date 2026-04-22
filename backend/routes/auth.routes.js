const express = require('express');
const router = express.Router();
const { signup, signin, logout, checkAuth, getAllUsers } = require('../controllers/auth.controller.js');
const { verifyToken } = require('../middleware/verifyToken.js');

router.post("/signup", signup); 
router.post("/signin", signin);

router.get("/users", getAllUsers);
router.post("/logout", logout);

router.get("/check-auth", verifyToken, checkAuth);

module.exports = router; 