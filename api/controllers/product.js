const product = require("../models/product")
const asyncHandler = require("express-async-handler")
const slugify = require("slugify")

const createProduct = asyncHandler(async(req , res) => {
    if (Object.keys(req.body).length === 0 ) throw new Error("missing inputs")
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const newProduct = await product.create(req.body)
    return res.status(200).json({
        success : newProduct ? true : false,
        createdProduct : newProduct ? newProduct : "fail"
    })
})

const getProductOnly = asyncHandler(async(req , res) => {
    const {id} = req.params
    if (!id) return res.status(404).json({ message : "missing inputs" })
    const prd = await product.findOne({_id : id})
    return res.status(200).json({
        success : prd ? true : false,
        result : prd
    })
})

const getAllproducts =async(req , res) => {
    try {
        const queries = {...req.query}
    // tách cac fields khoi query
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach(el => delete queries[el])

    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchEl => `$${matchEl}`)
    const formattedQueries = JSON.parse(queryString)
    // chi can 1 chu dung se return ve
    if (queries?.title) formattedQueries.title = {$regex : queries.title, $options : "i"} 
    var querycommand = await product.find(formattedQueries)
    if (req.query.sort && !req.query.fields) {
        const sortBy = req.query.sort.split(",").join(" ")
        querycommand = await product.find(formattedQueries).sort(sortBy)
        console.log(1);
    }else if (req.query.sort && req.query.fields) {
        const sortBy = req.query.sort.split(",").join(" ")
        const fields = req.query.fields.split(",").join(" ")
        querycommand = await product.find(formattedQueries).sort(sortBy).select(fields)
        console.log(2);
    }
    // fields limiting
    else if (req.query.fields && !req.query.sort) {
        const fields = req.query.fields.split(",").join(" ")
        querycommand = await product.find(formattedQueries).select(fields)
        console.log(3);
    }else {}

    // phan trang
    // limit : số document
    const page = +req.query.page || 1
    const limit = +req.query.limit || process.env.LIMIT_PRODUCT
    const skip = (page - 1) * limit
    querycommand = await product.find(formattedQueries).skip(skip).limit(limit)
    const counts = await product.find(formattedQueries).countDocuments()

    return res.status(200).json({
        querycommand,
        counts
    })
    } catch (error) {
        console.log(error);
        return 1
    }
}

const updateProduct = asyncHandler(async(req , res) => {
    const {id} = req.params
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const updateProduct = await product.findByIdAndUpdate(id , req.body, {new : true})
    return res.status(200).json({
        success : updateProduct ? true : false,
        message : updateProduct ? updateProduct : "fail"
    })
})

const deleteProduct = asyncHandler(async(req , res) => {
    const {id} = req.params
    const deleteProduct = await product.findByIdAndDelete(id)
    return res.status(200).json({
        success : deleteProduct ? true : false,
        result : deleteProduct ? deleteProduct : "fail"
    })
})

const ratings = async(req , res) => {
    try {
        const {_id} = req.user
        const { star , comment , pid } = req.body
        if (!pid || !star) return res.status(404).json("missing input")
        const ratingProduct = await product.findOne({_id : pid})
        const alreadyRating = await ratingProduct?.ratings?.find(el => el.postedBy.toString() === _id)
        // nếu đã đánh giá sẽ sửa đánh giá
        if (alreadyRating) {
            // rating : đánh giá của user
            //alreadyRating tu biến alreadyRating trả về giá trị tìm thấy
            const response = await product.updateOne({
                // update fields vưa tìm được
                ratings : { $elemMatch : alreadyRating }
            }, {
                // update lại sao và bình luận
                $set : {
                    "ratings.$.star" : star, "ratings.$.comment" : comment
                }
                // trả về giá trị mới nhất
            }, {new :true})

            const onlyProduct = await product.findOne({_id : pid})
            const lengths = onlyProduct.ratings.length
            const sum = onlyProduct.ratings.reduce((a , b) => {
                return a + b.star
            }, 0)

            onlyProduct.totalRatings = Math.round(sum *10/lengths) / 10


            return res.status(200).json({
                status : 200,
                onlyProduct
            })
        }else {
            // nếu chưa đánh giá sẽ đánh giá
            const response = await product.findByIdAndUpdate( pid , {
                $push : {ratings : { star , comment, postedBy : _id }}
            }, {new : true})
            return res.status(200).json(
                response
            )
        }

    } catch (error) {
        return res.status(500).json({
            success : false,
            code : 500,
            message : error.message
        })
    }
}

// fail
const uploadImageProduct = async(req , res) => {
    try {
        console.log(req.file)
        return res.status(200).json({
            message : "fail1"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : "false",
            message : "failed"
        })
    }
}

module.exports = {
    createProduct,
    getProductOnly,
    getAllproducts,
    updateProduct,
    deleteProduct,
    ratings,
    uploadImageProduct
}