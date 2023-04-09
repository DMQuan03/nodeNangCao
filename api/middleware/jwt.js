const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")

const generateAccessToken = (user) => {
    return jwt.sign({
        _id : user._id,
        role : user.role
    },
        process.env.JWT_SECRET,
        {expiresIn : "1d"}
    )
}

const generateRefreshToken = (user) => {
    return jwt.sign({
        _id : user._id,
    },
        process.env.JWT_REFRESH_TOKEN,
        {expiresIn : "3d"}
    )
}

const verifyToken = (req , res , next) => {
    if(!req?.headers?.authorization?.startsWith("Bearer"))  {
        throw new Error("token deformation")
    }
    const authorizationHeader = req.headers["authorization"]
    
    const token = authorizationHeader.split(" ")[1]

    if (!token) throw new Error("Token is'nt valid")

    jwt.verify(token , process.env.JWT_SECRET, (err , user) => {
        if (err) return res.status(401).json({
            success : false,
            message : "Invalid accessToken"
        })
        req.user = user
        next()
    })
}

const isAdmin = asyncHandler(async(req , res, next) => {
    const {role} = req.user
    if (role !== "admin") return res.status(401).json({
        success : false,
        message : "required must admin"
    })
    next()
})


module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
    isAdmin
}