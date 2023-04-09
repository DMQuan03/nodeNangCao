const productCategory = require("../models/productCategory")
const asyncHandler = require("express-async-handler")
const slugify = require("slugify")

const createProductCategory = async(req , res) => {
    try {
        if (!req.body || req.body.title === undefined || req.body.title === "" || req.body.title === null) return res.status(404)
        const response = await productCategory.create(req.body)
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

const getCategories = async (req , res) => {
    try {
        const response = await productCategory.find().select("title _id")
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

const updateCategory = async(req , res) => {
    try {
        const {_id} = req.params
        const response = await productCategory.findByIdAndUpdate(_id , req.body , {new : true})
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

const deleteCategory = async(req , res) => {
    try {
        const {_id} = req.params
            const response = await productCategory.findByIdAndDelete(_id)
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
    createProductCategory,
    getCategories,
    deleteCategory,
    updateCategory
}