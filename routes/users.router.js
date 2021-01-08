const express = require('express')
const router = express.Router()
const User = require('../models/User.model')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
// const isAdmin = require('../middleware/isAdmin')
const bcrypt = require('bcrypt')


//get user from db
router.get('/profile', auth,  async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id }).select("-password")
        res.json(user)

    } catch (err) {
        return res.status(500).json({ success: false, msg: err.message })
    }
})

router.post('/register', async (req, res) => {
    try {
        let { name, email, password } = req.body
        let user = await User.findOne({ email })

        if (!name || !email || !password) {
            return res.status(401).json({
                success: false,
                message: 'All Fields are Required'
            })
        }

        if (user) {
            return res.status(401).json({
                success: false,
                message: 'An Account With This Email Already Exists!'
            })
        }

        const salt = await bcrypt.genSalt(10)
        password = await bcrypt.hash(password, salt)

        user = new User({
            name,
            email,
            password,
            created_at: Date.now()
        })

        await user.save()

        const payload = {

            user: {
                _id: user._id,
                email: user.email
            }

        }

        let jwtSecret = process.env.JWT_SECRET || "yassine"
        jwt.sign(
            payload,
            jwtSecret,
            { expiresIn: "1h" },
            (err, token) => {
                if (err) {
                    return res.status(401).json({ success: false, message: err.message })
                } else {
                    return res.status(201).json({ token })
                }
            }
        )


    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }

})

//login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        let user = await User.findOne({ email })

        // check login input
        if (!email || !password) {
            return res.status(401).json({
                success: false,
                message: 'All Fields are Required'
            })
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'No Account With This Credentials'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const payload = {
                user: {
                    id: user.id,
                    email: user.email
                }
            }

            let jwtSecret = process.env.JWT_SECRET || "yassine"
            jwt.sign(
                payload,
                jwtSecret,
                { expiresIn: "1h" },
                (err, token) => {
                    if (err) {
                        return res.status(401).json({ success: false, message: err.message })
                    } else {
                        return res.status(201).json({ token })
                    }
                }
            )
        } else {
            return res.status(401).json({ success: false, message: "Wrong Password" })
        }

    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
})

//forgot password
// router.put('/forgot-password', (req,res) => {

// })
    



module.exports = router