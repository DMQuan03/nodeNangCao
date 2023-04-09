const Blog = require("../models/blog")

const BlogController = {
    createNewBlog : async(req , res) => {
        try {
            const { title , description , category } = req.body
            if (!title || !description || !category) throw new Error("missing input")
            const response = await Blog.create(req.body)
            return res.status(200).json({
                success : true,
                response
            })
        } catch (error) {
            return res.status(500).json({
                success : false,
                message : "fail"
            })
        }
    },

    updateBlog : async(req , res) => {
        try {
            const { id } = req.params
            if (Object.keys(req.body).length === 0) throw new Error("missing input")
            const response = await Blog.findByIdAndUpdate(id , req.body , {new : true})
            return res.status(200).json({
                success : true,
                code : 200,
                message : "successfully",
                response
            })
        } catch (error) {
            return res.status(500).json({
                success : false,
                code : 500,
                message : "fail"
            })
        }
    },

    getBlog : async(req , res) => {
        try {
            const response = await Blog.find()
            const countsBlog = await Blog.find().countDocuments()
            return res.status(200).json({
                message : "successfully",
                code : 200,
                response,
                countsBlog
            })
        } catch (error) {
            return res.status(500).json({
                message : "fail",
                code : 500,
                success : false
            })
        }

    },

    likeBlog : async(req , res) => {
        try {
            const {id} = req.params
            if (!id) throw new Error("missing input")
            if(!req.user._id) {
                return res.status(404).json({
                    message : "you must login",
                    code : 404,
                    success : false
                })
            }
            const response = await Blog.findOne({_id : id})
            if (!response.likes.includes(req.user._id) && !response.Dislikes.includes(req.user._id)) {
                await Blog.updateMany({_id : id}, { $inc : { Like : 1 } })
                await Blog.updateOne({_id : id}, {$addToSet : { likes : req.user._id }})
                return res.status(200).json({
                    message : "successfully",
                    code : 200,
                    success : true
                })
            }else if (!response.Dislikes.includes(req.user._id) && response.likes.includes(req.user._id)) {
                await Blog.updateMany({_id : id}, { $inc : { Like : -1 } })
                await Blog.updateOne({_id : id}, {$pull : { likes : req.user._id }})
                return res.status(200).json({
                    message : "successfully",
                    code : 200,
                    success : true
                })
            }else if (response.Dislikes.includes(req.user._id) && !response.likes.includes(req.user._id)) {
                await Blog.updateMany({_id : id}, { $inc : { Like : 1 } })
                await Blog.updateMany({_id : id}, { $inc : { Dislike : -1 } })
                await Blog.updateOne({_id : id}, {$pull : { Dislikes : req.user._id }})
                await Blog.updateOne({_id : id}, {$addToSet : { likes : req.user._id }})
                return res.status(200).json({
                    message : "successfully",
                    code : 200,
                    success : true
                })
            }else {}
            return res.status(200).json({
                success : true
            })
        } catch (error) {
            return res.status(500).json({
                message : "fail",
                code : 500,
                success : false
            })
        }
    },

    DislikeBlog : async(req , res) => {
        try {
            const {id} = req.params
            if (!id) throw new Error("missing input")
            if(!req.user._id) {
                return res.status(404).json({
                    message : "you must login",
                    code : 404,
                    success : false
                })
            }
            const response = await Blog.findOne({_id : id})
            if (!response.likes.includes(req.user._id) && !response.Dislikes.includes(req.user._id)) {
                await Blog.updateMany({_id : id}, { $inc : { Dislike : 1 } })
                await Blog.updateOne({_id : id}, {$addToSet : { Dislikes : req.user._id }})
                return res.status(200).json({
                    message : "successfully",
                    code : 200,
                    success : true
                })
            }else if (response.Dislikes.includes(req.user._id) && !response.likes.includes(req.user._id)) {
                await Blog.updateMany({_id : id}, { $inc : { Dislike : -1 } })
                await Blog.updateOne({_id : id}, {$pull : { Dislikes : req.user._id }})
                return res.status(200).json({
                    message : "successfully",
                    code : 200,
                    success : true
                })
            }else if (!response.Dislikes.includes(req.user._id) && response.likes.includes(req.user._id)) {
                await Blog.updateMany({_id : id}, { $inc : { Dislike : 1 } })
                await Blog.updateMany({_id : id}, { $inc : { Like : -1 } })
                await Blog.updateOne({_id : id}, {$pull : { likes : req.user._id }})
                await Blog.updateOne({_id : id}, {$addToSet : { Dislikes : req.user._id }})
                return res.status(200).json({
                    message : "successfully",
                    code : 200,
                    success : true
                })
            }else {}
            return res.status(200).json({
                success : true
            })
        } catch (error) {
            return res.status(500).json({
                message : "fail",
                code : 500,
                success : false
            })
        }
    },

    getBlogOnly : async(req , res) => {
        try {
            const {id} = req.params
            // populate ==> lay thong tin chi tiet cua nguoi like ben bang collection user by id.object khai bao trong model schema
            const response = await Blog.findByIdAndUpdate(id, {$inc : { numberViews : 1 }}, {new : true})
            .populate("likes", "firstName lastName")
            .populate("Dislikes", "firstName lastName")
            return res.status(200).json({
                success : true,
                code : 200,
                message : "successfully",
                response
            })

        } catch (error) {
            return res.status(500).json({
                message : "fail",
                success : false,
                code : 500
            })
        }
    },

    deleteBlog : async(req , res) => {
        try {
            const {id } = req.params
            const response = await Blog.findByIdAndDelete(id)
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

module.exports = BlogController