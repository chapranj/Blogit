
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}

//login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const userId = user._id;
        console.log(userId)
        const role = user.role;
        const token = createToken(user._id);
        res.status(200).json({ email, token, role, userId })
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
}
//signup user

const signUpUser = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        console.log(role)
        const user = await User.signup(email, password, role)

        //create token 
        const token = createToken(user._id);

        res.status(200).json({ email, token, role })

    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getAllUsers = async(req, res)=>{
    try{
        const users = await User.find().select('email');
        res.status(200).json({users})
        
    }
    catch(error){
        res.status(400).json({error: error.message})
    }
}

module.exports = {
    loginUser, signUpUser, getAllUsers
}




