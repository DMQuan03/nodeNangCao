const Coupon = require("../models/conpon")

const CouponController = {
    createCoupon : async(req , res) => {
        try {
            const { name , discount , expire } = req.body
            console.log(1)
            if (!name || !discount || !expire) throw new Error("missing inputs")
            const response = await Coupon.create({
                ...req.body,
                expire : Date.now() + +expire*24*60*60*1000
            })
            return res.status(200).json({
                message : "successfully",
                success : true,
                response
            })
        } catch (error) {
            return res.status(500).json({
                message : "fail",
                code : 500,
                success : false
            })
        }
    },
    getCoupon : async(req , res) => {
        try {
            const response = await Coupon.find().select("-createdAt -updatedAt")
            const count = await Coupon.find().countDocuments()
            return res.status(200).json({
                success : true,
                response,
                count
            })
        } catch (error) {
            return res.status(500).json({
                success : false,
                message : "ERROR"
            })
        }
    },

    updateCoupon : async(req , res) => {
        try {
            const {id} = req.params
            if (Object.keys(req.body).length === 0) throw new Error("missing inputs")
            if (req.body.expire) req.body.expire = Date.now() + +req.body.expire*24*60*60*1000
            const response = await Coupon.findOneAndUpdate(id, req.body , {new : true})
            return res.status(200).json({
                success : true,
                response
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message : "fail",
                success : false
            })
        }
    },
    deleteBlog : async(req , res) => {
        try {
            const {id } = req.params
            const response = await Coupon.findByIdAndDelete(id)
            return res.status(200).json({
                message : "successfully",
                code : 200,
                success : true,
                response
            })
        } catch (error) {
            return res.status(500).json({
                message : "fail",
                code : 500,
                success : false
            })
        }
    }
}

module.exports = CouponController