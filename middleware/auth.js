const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    try {

        const token = req.header('x-auth-token')
        if (!token) {
            return res.status(401).json({ message: 'Please login' })
        }

        const JWT_SECRET = process.env.SECRET
        const verifiedUser = jwt.verify(token, JWT_SECRET)

        if (!verifiedUser) {
            return res.status(401).json({ message: 'Verification Failed, Access Denied' })
        }

        req.user = verifiedUser.user
        next()

    } catch(err) {
        res.status(500).json({ message: "You're Not Logged In" })
    }
}

module.exports = auth