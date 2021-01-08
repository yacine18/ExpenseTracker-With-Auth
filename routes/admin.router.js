const express = require('express')
const router = express.Router()
const User = require('../models/User.model')
const Transaction = require('../models/Transaction.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const isAdmin = require('../middleware/isAdmin')
const auth = require('../middleware/auth')


//get admin prfile
router.get('/', isAdmin, async (req, res) => {
    try {
        // let userId = req.user._id
        const user = await User.findOne({email: req.body.email })
        res.json(user)
        console.log(user)
    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message })
    }
})

//admin login
router.post('/login', async (req, res) => {

    try {

        const { email, password } = req.body
        const user = await User.findOne({ email })

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
                _id: user._id,
                email: user.email
            }

            let jwtSecret = process.env.SECRET || "yassine"
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
            return res.status(201).json({ message: "Wrong Password" })
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
})

//get all transactions
router.get('/transactions',  async(req, res) => {
    try {
       await Transaction.find((err, transactions) => {
            if (err) { 
                return res.status(401).json({ success: false, message: err.message })
            } else {
                return res.status(200).json({ success: true, transactions })
            }
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
})

//update transaction
router.put('/transaction/:id', (req, res) => {
    const id = { _id: req.params.id }
    const { label, amount } = req.body;
    
    if(!label || !amount) {
        return res.status(401).json({
            sucess: false,
            message: 'All Fields are Required!'
        })
    }

    const updateTransaction = ({
        label,
        amount,
        created_at: Date.now()
    })

    Transaction.updateOne(id, updateTransaction, (err) => {
        if (!err) {
            return res.status(201).json({
                sucess: true,
                message: 'Transaction Updated Successfully',
            })
        } else {
            res.status(500).json({
                sucess: false,
                message: 'Server Error'
            })
        }
    })


})

//delete a transaction
router.delete('/transaction/:id', (req, res) => {
    const id = { _id: req.params.id }

    Transaction.deleteOne(id, (err) => {
        if (!err) {
            return res.status(201).json({
                sucess: true,
                message: 'Transaction Was Deleted Successfully'
            })
        } else {
            res.status(500).json({
                sucess: false,
                message: 'Server Error'
            })
        }
    })
})

//get all users
router.get('/users', async(req, res) => {
   try {
   await User.find((err, users) => {
        if (err) { 
            return res.status(401).json({ success: false, message: err.message })
        } else {
            return res.status(200).json({ success: true, users })
        }
    })
   } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
   }
})

//update user
router.put('/user/:id', async (req, res) => {
    try {
        let { name, email, password, isAdmin } = req.body
        let id = { _id: req.params._id }

        if (!name || !email || !password || !isAdmin) {
            return res.status(401).json({
                success: false,
                message: 'All Fields are Required'
            })
        }

        const salt = await bcrypt.genSalt(10)
        password = await bcrypt.hash(password, salt)

        const updateUser = ({
            name,
            email,
            password,
            isAdmin,
            created_at: Date.now()
        })

        await User.updateOne(id, updateUser, (err) => {
            if(err){
                return res.status(401).json({ success: false, message: err.message })
            } else {
                return res.status(201).json({ success: true, message: "User Updated Successfully!" })
            }
        })


    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }

})


//delete user
router.delete('/user/:id', isAdmin, async(req, res) => {
    try {
        const id = { _id: req.params.id }

       await User.deleteOne(id, (err) => {
            if (!err) {
                return res.status(201).json({
                    sucess: true,
                    message: 'User Was Deleted Successfully'
                })
            } else {
                res.status(500).json({
                    sucess: false,
                    message: 'Server Error'
                })
            }
        })
    } catch (error) {
       return res.status(500).json({ success: false, message: err.message })
    }
})



module.exports = router