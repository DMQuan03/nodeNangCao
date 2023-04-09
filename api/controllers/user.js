const User = require("../models/user")
const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const crypto = require("crypto")
const sendMail = require("../utils/sendmail")
const { generateAccessToken, generateRefreshToken } = require("../middleware/jwt")
const registerUser = asyncHandler(async(req , res) => {
    const {email , password , firstName , lastName } = req.body
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
            message : "missing inputs"
        })
    }
    if (email && email !== "" && email !== null && email !== undefined) {
        const isEmail = User.findOne({email})
        if (!isEmail) throw new Error ("email already exists")
        const response = await User.create(req.body) 
        return res.status(200).json({
            success : response ? "true" : "false",
            message : response ? "register is successfully" : "register fail"
        })
    }

})

const login = asyncHandler(async(req , res) => {
    const {email , password} = req.body

    if (!email || !password) throw new Error("missing inputs")

    if (typeof email === "number") throw new Error("wrong email")

    const user = await User.findOne({email})
    if (!user) throw new Error("wrong email")

    const isPassword = await bcrypt.compare(
        password,
        user.password
    )
    if(!isPassword) throw new Error("wrong password")

    if (user && isPassword) {
        const accessToken = generateAccessToken(user)
        const newRefreshToken = generateRefreshToken(user)
        // save refresh token to db
        await User.findByIdAndUpdate(user._id, {refreshToken : newRefreshToken}, {new : true})
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly : true,
            maxAge : 7*24*60*60*1000
        })
        const {password, refreshToken, cart , role, ...other} = user._doc
        return res.status(200).json({...other , accessToken})
    }
})

const getOnlyUser = asyncHandler(async(req , res) => {
    const user = await User.findById({_id : req.user._id}).select("-refreshToken -password -role")
    return res.status(200).json(user)
})

const refreshAccessToken = asyncHandler(async(req , res) => {
    // get token from cookie
    const cookie = await req.cookies
    if (!cookie && !cookie.refreshToken) throw new Error("no refresh token in cookie")
    jwt.verify(cookie.refreshToken , process.env.JWT_REFRESH_TOKEN , async(err , user) => {
        if (err) {
            return res.status(403).json({
                message : "refreshToken fail"
            })
        }

        const response = await User.findOne({_id : user._id, refreshToken: cookie.refreshToken})
        
        return res.status(200).json({
            success : response ? true : false,
            newAccessToken : response ? generateAccessToken(response._id , response.role) : "refreshToken not matched"
        })
    })
})

const logout = asyncHandler(async(req , res) => {
    const cookie = req.cookies

    if (!cookie || !cookie.refreshToken ) throw new Error("don't have cookie")

    //delete refresh token of db
    await User.findOneAndUpdate({ refreshToken: cookie.refreshToken } , {refreshToken : ""} , {new : true})
    // delete refresh token in cookie
    res.clearCookie("refreshToken", {
        httpOnly : true,
        secure : true
    })

    return res.status(200).json({
        message : "logout success"
    })
})

// check mail
// server check mail hop le khong ==> gui mail + link (password change token)
// client check mail click link in mail
// client gui api kem token
// server check token co giong token server gui khong ? cho change : khong cho

const forgotPassword = asyncHandler(async(req , res) => {
    const {email} = req.query

    if (!email) throw new Error("missing email")
    const user = await User.findOne({email})

    if (!user) throw new Error("invalid email")
    const resetToken = await user.createPasswordChangedToken()
    await user.save()

    // gmail
    const html = `vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.link hết hạn sau 15 phút. <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken} >Click here</a>`

    
    const data = {
        email,
        html 
    }
    const rs = await sendMail(data)
    return res.status(200).json({
        success : true,
        rs
    })
})

const resetPassword = asyncHandler(async(req , res) => {
    const {password, token} = req.body
    if (!password || !token) {
     throw new Error("missing inputs")
    }
    const passwordResetToken = await crypto.createHash("sha256").update(token).digest("hex")
    const user = await User.findOne({passwordResetToken , passwordResetExpires : { $gt : Date.now() }})

    if (!user) throw new Error ("reset token invalid")

    user.password = password
    user.passwordResetToken = undefined
    user.passwordChangeAt= Date.now()
    user.passwordResetExpires = undefined
    await user.save()
    return res.status(200).json({
        success : user ? true : false,
        message : user ? "successfully" : "fail"
    })
})

const getUsers = asyncHandler(async (req , res) => {
        // select loai 3 loai [ refreshToken , password , role ] truoc khi tra ve
        const response = await User.find().select("-refreshToken -password -role")
        return res.status(200).json({
            message : true,
            user : response
        })
})

const deleteUser = asyncHandler(async(req , res) => {
    const id = req.params._id
    if (!id) throw new Error("missing inputs")
    const rs = await User.findByIdAndDelete({_id : id})
    return res.status(200).json({
        success : rs ? true : false,
        deleteUser : rs ? `User with email ${rs.email} deleted` : `cant delete User`
    })
})

const updateUser = asyncHandler(async(req , res) => {
    const {_id } = req.user
    if(!_id || Object.keys(req.body).length === 0) throw new Error("missing input")
    const rs = await User.findByIdAndUpdate(_id , req.body , {new : true}).select("-password -role")
    return res.status(200).json({
        success : rs ? true : false,
        message : rs ? rs : "fail"
    })
})

const updateUserByAdmin = asyncHandler(async(req , res) => {
    const { id } = req.params
    if(Object.keys(req.body).length === 0) throw new Error("missing input")
    const rs = await User.findByIdAndUpdate(id , req.body , {new : true}).select("-password -role")
    return res.status(200).json({
        success : rs ? true : false,
        message : rs ? rs : "fail"
    })
})

const updateUserAddress = asyncHandler(async(req , res) => {

    const rs = await User.findByIdAndUpdate(req.user._id , {$push : {address : req.body.address}} , {new : true}).select("-password -role")
    return res.status(200).json({
        success : rs ? true : false,
        message : rs ? rs : "fail"
    })
})

const deleteUserAddress = asyncHandler(async(req , res) => {

    const rs = await User.findByIdAndUpdate(req.user._id , {$pull : {address : req.body.address}} , {new : true}).select("-password -role")
    return res.status(200).json({
        success : rs ? true : false,
        message : rs ? rs : "fail"
    })
})

const addToCart = async(req , res) => {
    try {
        const { pid , quantity , color } = req.body
        if (!pid || !quantity || !color) {
            return res.status(404).json({
                message : "missing input"
            })
        }
        const user = await User.findOne({_id : req.user._id}).select("cart")
        const arr = user.cart
        const alreadyProduct = await arr.find(el => el.product.toString() === pid)
        if (alreadyProduct) {
            if (alreadyProduct.color === color) {
                const response = await User.updateOne({cart : { $elemMatch : alreadyProduct } }, {
                    $set : { "cart.$.quantity" : quantity }
                }, {new : true})
                return res.status(200).json({
                    message : true,
                    response,
                    arr
                })
            }else {
                const response = await User.findByIdAndUpdate(req.user._id , { $push : { cart : { product : pid , quantity , color } } }, {new : true})
                return res.status(200).json({
                    success : true,
                    message : "successfully",
                    response
                })
            }
        }else {
            const response = await User.findByIdAndUpdate(req.user._id , { $push : { cart : { product : pid , quantity , color } } }, {new : true})
            return res.status(200).json({
                success : true,
                message : "successfully",
                response
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message : "fail",
            code : 500,
            success : false
        })
    }
}


module.exports = {
    registerUser,
    login,
    getOnlyUser,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
    getUsers,
    deleteUser,
    updateUser,
    updateUserByAdmin,
    updateUserAddress,
    deleteUserAddress,
    addToCart
}

