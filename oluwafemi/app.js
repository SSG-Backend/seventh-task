const path = require("path")
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const mongoose = require("mongoose")
const flash = require("connect-flash")
const session = require("express-session")
const passport = require("passport")

const app = express()

//Passport Config
require("./config/passport")(passport)

//DB Config
const db = require("./config/keys").MongoURI

//Connect Mongo
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB conected"))
  .catch((err) => console.log(err))

// ejs
app.use(expressLayouts)
app.set("view engine", "ejs")

//body parser
app.use(express.urlencoded({ extended: false }))

//express session
app.use(
  session({
    secret: "keyboard",
    resave: true,
    saveUninitialized: true
  })
)

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//connect flash
app.use(flash)

//Global Var
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg")
  res.locals.error_msg = req.flash("error_msg")
  res.locals.error = req.flash("error")
  next()
})

//routes
app.use("/", require("./routes/index"))
app.use("/users", require("./routes/users"))

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server started on ${PORT}`))
