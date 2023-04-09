const bill = require("../models/bill")
const User = require("../models/user")
const Coupon = require("../models/conpon")

const BillController ={
    useCoupon : async(req , res) => {
        try {
            const {coupon} = req.body
            const user = await User.findOne({_id : req.user._id}).select("cart").populate("cart.product" ,"title price")
            const products = user?.cart?.map(el => ({
                product: el.product._id,
                count : el.quantity,
                color : el.color
            }))            
            let total = user?.cart?.reduce((sum , el) => el.product.price * el.quantity + sum , 0)
            const createData = {products, total,orderBy: req.user._id}
            if (coupon) {
                const selectedCoupon = await Coupon.findById(coupon)
                console.log(selectedCoupon.discount)
                total = Math.round(total * (1 - +selectedCoupon?.discount/100)/1000) *1000
                createData.total = total
                createData.coupon = coupon
            }
            const rs = await bill.create({ products, total , orderBy: req.user._id})
            return res.status(200).json({
                success : true,
                rs
            })

        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message : "fail",
                success : false
            })
        }
    },

    updateStatus : async(req , res) => {
        try {
            const { oid } = req.params
            const {status} = req.body

            if (!status) return res.status(404).json({ message : "missing input"})
            const response = await bill.findByIdAndUpdate(oid , { status }, {new : true})
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

    getUserOder : async(req , res) => {
        try {
            const response = await bill.find({ orderBy : req.user._id }) 
            return res.status(200).json({
                message : "successfully",
                success : true,
                response
            })
        } catch (error) {
            return res.status(500).json({
                message : "fail",
                code :500,
                success : false
            })
        }
    },
    getAllBill : async(req , res) => {
        try {
            const response = await bill.find()
            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({
                message : "fail",
                code : 500
            })
        }
    }
}

module.exports = BillController