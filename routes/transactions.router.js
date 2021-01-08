const express = require('express')
const router = express.Router()
const Transaction = require('../models/Transaction.model')
const auth = require('../middleware/auth')


//get transactions
router.get('/', auth, (req, res) => {
   

        let user = req.user.id
         Transaction.find({ user }, (err, transactions) => {
            if (!err) {
                return res.status(201).json({
                    sucess: true,
                    transactions
                })
            }
    
            return res.status(500).json({
                sucess: false,
                message: err.message
            })
    
        })
 
})

//post new transaction
router.post('/', auth, (req, res) => {
    const { label, amount } = req.body;

    if (!label || !amount) {
        return res.status(401).json({
            sucess: false,
            message: 'All Fields are Required!'
        })
    }

    const newTransaction = new Transaction({
        label,
        amount,
        user: req.user.id,
        created_at: Date.now()
    })

    newTransaction.save((err, transaction) => {
        if (!err) {
            return res.status(201).json({
                sucess: true,
                transaction: transaction
            })
        } else {
            res.status(500).json({
                sucess: false,
                message: err.message
            })
        }
    })
})

//update a transaction
router.put('/:id', auth, (req, res) => {
    const id = { _id: req.params.id }
    const { label, amount } = req.body;

    const updateTransaction = ({
        label,
        amount,
        created_at: Date.now()
    })

    Transaction.updateOne(id, updateTransaction, (err, transaction) => {
        if (!err) {
            return res.status(201).json({
                sucess: true,
                message: 'Transaction Updated Successfully'
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
router.delete('/:id', auth, (req, res) => {
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

//search transaction by ID
router.get('/search', (req, res) => {
    const regex = new RegExp(req.body.query)
    Transaction.find({ _id: { $regex: regex } }, (err, transaction) => {
        if (!err) {
            return res.status(201).json({ success: true, transaction })
        } else {
            return res.status(401).json({ success: false, message: err.message })
        }
    })
})





module.exports = router