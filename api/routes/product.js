const Router2 = require("express").Router()
const ctrls = require("../controllers/product")
const { verifyToken, isAdmin } = require("../middleware/jwt")
const uploadImg = require("../../config/cloudinary.config")


Router2.post("/",verifyToken, isAdmin,  ctrls.createProduct)
Router2.get("/search",  ctrls.getAllproducts)
Router2.put("/ratings", verifyToken , ctrls.ratings)

Router2.put("/upload/:id", verifyToken ,isAdmin, uploadImg.single("images") ,ctrls.uploadImageProduct)
Router2.put("/:id", verifyToken ,isAdmin ,ctrls.updateProduct)
Router2.delete("/:id", verifyToken ,isAdmin ,ctrls.deleteProduct)
Router2.get("/:id",  ctrls.getProductOnly)


module.exports = Router2

// CRUD : ==> create / read / update / delete