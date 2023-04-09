// handler err middleware
const notFound = (req , res,next) => {
    const error = new Error(`Router ${req.originalUrl} is Not Found`)
    res.status(404)
    next(error)
}

const errHandler = (error , req , res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    return res.status(statusCode).json({
        success : "fail",
        message : error?.message
    })
}

module.exports = {
    notFound,
    errHandler
}