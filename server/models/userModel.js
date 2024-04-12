const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt');
const validator = require('validator')

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String, 
        enum: ['user', 'admin'],
        default: 'user'
    }
})

//static signup method
userSchema.statics.signup = async function (email, password, role) {
    //validation
    if (!email || !password) {
        throw Error('All Fields must be filled!');
    }

    if (!validator.isEmail(email)) {
        throw Error('Email is not valid!')
    }
    if (!validator.isStrongPassword(password)) {
        throw Error('Weak Password!')
    }

    const exists = await this.findOne({ email })

    if (exists) {
        throw Error('Email already in use!')
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    console.log("in static signup: "+role)
    const user = await this.create({ email, password: hash, role})

    return user;

}

userSchema.statics.login = async function (email, password) {

    if (!email || !password) {
        throw Error('All Fields must be filled!');
    }

    const user = await this.findOne({ email })

    if (!user) {
        throw Error('Incorrect Email!')
    }

    const match = await bcrypt.compare(password, user.password);

    if(!match){
        throw Error('Incorrect Password');
    }

    console.log(user)

    return user;
}

const User = mongoose.model('User', userSchema);


module.exports = User;