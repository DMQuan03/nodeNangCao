const Router2 = require("express").Router()
const ctrls = require("../controllers/coupon")
const { verifyToken, isAdmin } = require("../middleware/jwt")

Router2.get("/",  ctrls.getCoupon)
Router2.post("/", verifyToken, isAdmin , ctrls.createCoupon)
Router2.put("/:id", verifyToken, isAdmin , ctrls.updateCoupon)
Router2.delete("/:id", verifyToken, isAdmin , ctrls.deleteBlog)


module.exports = Router2

// CRUD : ==> create / read / update / delete