const Router1 = require("express").Router()
const ctrls = require("../controllers/user")
const { verifyToken, isAdmin } = require("../middleware/jwt")

Router1.post("/register", ctrls.registerUser)
Router1.post("/login", ctrls.login)
Router1.get("/current", verifyToken ,ctrls.getOnlyUser)
Router1.post("/refreshtoken", ctrls.refreshAccessToken)
Router1.get("/logout",ctrls.logout)
Router1.get("/forgotpassword",ctrls.forgotPassword)
Router1.put("/resetpassword",ctrls.resetPassword)
Router1.put("/current", verifyToken,ctrls.updateUser)
Router1.put("/addcart", verifyToken,ctrls.addToCart)
Router1.put("/updateaddress",verifyToken ,ctrls.updateUserAddress)
Router1.put("/deleteaddress",verifyToken ,ctrls.deleteUserAddress)
Router1.put("/:id", verifyToken, isAdmin,ctrls.updateUserByAdmin)
Router1.get("/", verifyToken , isAdmin ,ctrls.getUsers)
Router1.delete("/:_id", verifyToken , isAdmin ,ctrls.deleteUser)

module.exports = Router1

// CRUD : ==> create / read / update / delete