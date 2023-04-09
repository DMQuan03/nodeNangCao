const Router2 = require("express").Router()
const ctrls = require("../controllers/blogCategory")
const { verifyToken, isAdmin } = require("../middleware/jwt")

Router2.post("/", verifyToken, isAdmin , ctrls.createBlogCategory)
Router2.get("/", ctrls.getBlogCategories)
Router2.put("/:_id", verifyToken, isAdmin , ctrls.updateBlogCategory)
Router2.delete("/:_id", verifyToken, isAdmin , ctrls.deleteBlogCategory)

module.exports = Router2

// CRUD : ==> create / read / update / delete