const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const asyncHandler = require("express-async-handler")

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique : true
    },
    mobile:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    role : {
        type : String,
        default : "user"
    },
    cart : [
        {
            product : {
                type : mongoose.Types.ObjectId, ref : "product"
            },
            quantity: Number,
            color : String
        }
    ],
    address : {
        type : Array,
        default : []
    },
    wishList : [{type : mongoose.Types.ObjectId, ref : "product"}],
    isBlocked : {
        type : Boolean,
        default : false
    },
    refreshToken : {
        type : String , 
    },
    passwordChangeAt : {
        type : String
    },
    passwordResetToken : {
        type : String
    },
    passwordResetExpires : {
        type : String
    }
},
    {timestamps : true}
);

// trước khi lưu 1 doc chạy qua đây hash passwod
// pre --> HOOK
userSchema.pre("save", async function(next) {
    // neu thay doi password ? --> isModified === true : false
    if (!this.isModified("password")) {
        // nhu return
        next()
    }
    // if password don't change will hash password
    const salt = bcrypt.genSaltSync(10)
    this.password= await bcrypt.hash(this.password , salt)
})

userSchema.methods = {
    createPasswordChangedToken :  function () {
        const resetToken = crypto.randomBytes(32).toString("hex")
        this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")
        this.passwordResetExpires = Date.now() + 15 * 60 * 1000
        return resetToken
    }
}



//Export the model
module.exports = mongoose.model('User', userSchema);