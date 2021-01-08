const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    resetPasswordLink:{
        data: String,
        default: ''
    },
    created_at:{
        type: Date,
        default: Date.now()
    },
})

module.exports = mongoose.model('users', userSchema) 