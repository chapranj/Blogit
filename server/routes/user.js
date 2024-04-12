const express = require('express');
const router = express.Router();
const {loginUser, signUpUser,getAllUsers} = require('../controllers/userController');

//login route

router.post('/login', loginUser)
router.post('/signup', signUpUser)
router.get('/allUsers',getAllUsers)
module.exports = router