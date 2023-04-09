const BlogController = require("../controllers/blog")
const { verifyToken, isAdmin } = require("../middleware/jwt")

const Router = require("express").Router()

Router.get("/", BlogController.getBlog)
Router.post("/", verifyToken, isAdmin ,BlogController.createNewBlog)
Router.delete("/delete/:id", verifyToken, isAdmin ,BlogController.deleteBlog)
Router.get("/getonlyblog/:id", BlogController.getBlogOnly)
Router.put("/like/:id", verifyToken ,BlogController.likeBlog)
Router.put("/dislike/:id", verifyToken ,BlogController.DislikeBlog)
Router.put("/:id", verifyToken, isAdmin ,BlogController.updateBlog)

module.exports = Router