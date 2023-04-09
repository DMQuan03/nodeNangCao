const express = require("express")
const cors = require("cors")
const app = express()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const dbConnect = require('./config/dbconnect')
const asyncHandler = require("express-async-handler")
const initRoutes = require('./api/routes/index')
const cookieParser = require("cookie-parser")
require("dotenv").config()


const PORT = process.env.PORT || 5678


// app use
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cookieParser())

//connect to db
dbConnect()
initRoutes(app)


app.listen(PORT , () => {
    console.log("sever is running at PORT" + " " + PORT)
})