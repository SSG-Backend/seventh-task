const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const passport = require("passport")

//User model
const Users = require("../model/User")

//Login Page
router.get("/login", (req, res) => res.render("login"))

//Register Page
router.get("/register", (req, res) => res.render("register"))

//Register Handle
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body
  let errors = []

  //check field
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "please fill out all fields" })
  }
  //checkthat password match
  if (password !== password2) {
    errors.push({ msg: "Incorrect password" })
  }

  //check password length
  if (password.length < 5) {
    errors.push({ msg: "Password should be at least 5 characters" })
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    })
  } else {
    // Validation Passed
    Users.findOne({ email: email }).then((user) => {
      if (user) {
        //user exist
        errors.push({ msg: "Email is already registered" })
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2
        })
      } else {
        const newUser = new User({
          name,
          email,
          password
        })
        //hash password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err
            //set passworsd to hashed
            newUser.password = hash

            //save User
            newUser
              .save()
              .then((user) => {
                req.flash("sucess_msg", "you are now registered")
                res.redirect("/users/login")
              })
              .catch((err) => console.log(err))
          })
        )
      }
    })
  }
})

//Login Handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next)
})
//logout habdle
router.get("/logout", (req, res) => {
  req.logout()
  req.flash("success_msg", "You are logged out")
  res.redirect("/users/login")
})
module.exports = router
