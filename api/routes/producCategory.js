const Router2 = require("express").Router()
const ctrls = require("../controllers/productCategory")
const { verifyToken, isAdmin } = require("../middleware/jwt")

Router2.post("/", verifyToken, isAdmin , ctrls.createProductCategory)
Router2.get("/", ctrls.getCategories)
Router2.put("/:_id", verifyToken, isAdmin , ctrls.updateCategory)
Router2.delete("/:_id", verifyToken, isAdmin , ctrls.deleteCategory)

module.exports = Router2

// CRUD : ==> create / read / update / delete