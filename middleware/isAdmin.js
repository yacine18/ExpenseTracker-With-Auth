const jwt = require('jsonwebtoken')
const User = require('../models/User.model')


const isAdmin = async(req, res, next) => {
 try {
   await User.findOne({email:req.body.email}, (err, user) => {
        if(err) {
            return res.status(401).json({ success: false, message: err.message })
        }

        console.log(user)

        if(!user) {
            return res.status(401).json({ success: false, message: "User Not Found!" })
        }

        if(user.isAdmin === false){
            return res.status(401).json({ success: false, message: "User Not Authorized. Contact Your Admin" })
        }

        req.profile = user
        next()

    })  
 } catch (error) {
    res.status(500).json({ success: false, message: error.message })
 }

}

module.exports = isAdmin