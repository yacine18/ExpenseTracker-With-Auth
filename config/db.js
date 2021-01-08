const mongoose = require('mongoose')

const URI = process.env.URI
mongoose.connect(URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err)=>{
    if(err){
        console.log(err.message)
    }

    console.log('DB connected successfully')
})