const userRouter = require("./user")
const productRouter = require("./product")
const productRouterCategory = require("./producCategory")
const productRouterBlogCategory = require("./BlogProductCategory")
const brandRouter = require("./brand")
const CouponRouter = require("./coupon")
const blogRouter = require("./blog")
const billRouter = require("./bill")
const { errHandler, notFound } = require("../middleware/errHandler")


// domain of router
const initRoutes = (app) => {
    app.use("/api/user", userRouter)
    app.use("/api/product", productRouter)
    app.use("/api/productcategory", productRouterCategory )
    app.use("/api/brand", brandRouter )
    app.use("/api/blogcategory", productRouterBlogCategory )
    app.use("/api/blog", blogRouter )
    app.use("/api/coupon", CouponRouter )
    app.use("/api/bill", billRouter )

    app.use(notFound)
    app.use(errHandler)
}

module.exports = initRoutes