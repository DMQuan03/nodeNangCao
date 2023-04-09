const brand = require("../models/brand")
const slugify = require("slugify")

const createBrand = async(req , res) => {
    try {
        if (!req.body || req.body.title === undefined || req.body.title === "" || req.body.title === null) return res.status(404)
        const response = await brand.create(req.body)
        return res.status(200).json({
            success : response ? true : false,
            createCategory : response ? response : "fail"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message : "fail"
        })
    }
}

const getBrand = async (req , res) => {
    try {
        const response = await brand.find()
        return res.status(200).json({
            message : true,
            response
        })
    } catch (error) {
        return res.status(500).json({
            message : "fail",
            success : false
        })
    }
}

const updateBrand = async(req , res) => {
    try {
        const {_id} = req.params
        const response = await brand.findByIdAndUpdate(_id , req.body , {new : true})
        console.log(response)
        return res.status(200).json({
            success : true,
            response
        })
    } catch (error) {
        return res.status(500).json({
            success : false,
            code : 500,
            message : "error from server"
        })
    }
}

const deleteBrand = async(req , res) => {
    try {
        const {_id} = req.params
            const response = await brand.findByIdAndDelete(_id)
            return res.status(200).json({
                success : true,
                response
            })
    } catch (error) {
        return res.status(500).json({
            success : false,
            code : 500,
            message : "error from server"
        })
    }
}

module.exports = {
    createBrand,
    getBrand,
    deleteBrand,
    updateBrand
}