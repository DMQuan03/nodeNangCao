const Router2 = require("express").Router()
const ctrls = require("../controllers/brand")
const { verifyToken, isAdmin } = require("../middleware/jwt")

Router2.post("/", verifyToken, isAdmin , ctrls.createBrand)
Router2.get("/", ctrls.getBrand)
Router2.put("/:_id", verifyToken, isAdmin , ctrls.updateBrand)
Router2.delete("/:_id", verifyToken, isAdmin , ctrls.deleteBrand)

module.exports = Router2

// CRUD : ==> create / read / update / delete