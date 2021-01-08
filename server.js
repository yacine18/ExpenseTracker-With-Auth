const { json } = require('express')
require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
require('./config/db')


app.use(express.json())
app.use(cors())

//set up cors
app.use( (req,res,next)=> {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, Accept, Authorization')

    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET')
        return res.status(200).json({})
    }
    next()
})

//transactions endpoint
const transactionsRouter = require('./routes/transactions.router')
app.use('/api/transactions', transactionsRouter)

// users endpoint
const userRouter = require('./routes/users.router')
app.use('/api/user', userRouter)

//admin endpoint
const adminRouter = require('./routes/admin.router')
app.use('/api/admin', adminRouter)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server up and running on port ${PORT}`))