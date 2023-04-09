const BlogCategory = require("../models/blogCategory")
const asyncHandler = require("express-async-handler")
const slugify = require("slugify")

const createBlogCategory = async(req , res) => {
    try {
        if (!req.body || req.body.title === undefined || req.body.title === "" || req.body.title === null) return res.status(404)
        const response = await BlogCategory.create(req.body)
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

const getBlogCategories = async (req , res) => {
    try {
        const response = await BlogCategory.find().select("title _id")
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

const updateBlogCategory = async(req , res) => {
    try {
        const {_id} = req.params
        const response = await BlogCategory.findByIdAndUpdate(_id , req.body , {new : true})
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

const deleteBlogCategory = async(req , res) => {
    try {
        const {_id} = req.params
            const response = await BlogCategory.findByIdAndDelete(_id)
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
    createBlogCategory,
    getBlogCategories,
    deleteBlogCategory,
    updateBlogCategory
}