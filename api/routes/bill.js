const Router2 = require("express").Router()
const ctrls = require("../controllers/bill")
const { verifyToken, isAdmin } = require("../middleware/jwt")

Router2.post("/", verifyToken , ctrls.useCoupon)
Router2.get("/", verifyToken , ctrls.getUserOder)
Router2.get("/admin", verifyToken, isAdmin , ctrls.getAllBill)
Router2.put("/status/:oid", verifyToken, isAdmin , ctrls.updateStatus)


module.exports = Router2

// CRUD : ==> create / read / update / delete