require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const axios = require('axios');
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
	secret: "Our little secret.",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/booksDB", {useNewUrlParser: true, useUnifiedTopology: true}, ()=> {
	console.log('Connected to Database')
});
mongoose.set("useCreateIndex", true);

const bookSchema = new mongoose.Schema({
	title: String,
	author: String
});

const usersSchema = new mongoose.Schema({
	email: String,
	password: String
});
usersSchema.plugin(passportLocalMongoose);

const Book = new mongoose.model("Book", bookSchema);
const User = new mongoose.model("User", usersSchema); 
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

let port = 3000;

app.get("/", (req, res)=> {
	res.render("home")
});

app.get("/app", (req, res)=> {
	if (req.isAuthenticated()) {
		axios.get('http://localhost:3000/api/books')
			.then((response)=>{
				res.render('app', {
					bookData: response.data
				});
			})
			.catch((error)=>{
				console.log(error);
			})
	} else {
		res.redirect('login');
	}
});

app.route("/register")
	.get((req, res)=> {
		res.render("register")
	})
	.post((req,res)=>{
		User.register({username: req.body.username}, req.body.password, (err, user)=>{
			if (err) {
				res.redirect('/register');
			} else {
				passport.authenticate('local')(req, res, ()=>{
					res.redirect('/app');
				})
			}
		} )
	});

app.get("/logout", function (req, res) {
	req.logout();
	res.redirect("/");
});

app.route("/login")
	.get((req, res)=> {
		res.render("login")
	})
	.post((req, res)=>{
		const user = new User({
			username: req.body.password,
			password: req.body.password
		});

		req.login(user,(err)=>{
			if (err) {
				console.log(err)
			} else {
				passport.authenticate("local")(req, res, ()=>{
					res.redirect('/app');
				})
			}
		})
	})

app.route("/api/books")
	.get((req, res)=> {
		Book.find({}, (err, allBooks)=> {
			if (!err) {
				res.send(allBooks);
			} else {
				res.send(err);
			}
		})
	})
	.post((req, res)=> {
		const newBook = new Book ({
			title: req.body.title,
			author: req.body.author
		});

		newBook.save((err)=>{
			if (!err) {
				console.log(req.body)
				res.send(`Successfully added a new book ${req.body.title}`);
			} else {
				res.send(err);
			}
		})
	})
	.delete((req, res)=> {
		Book.deleteMany({}, (err)=>{
			if (!err) {
				res.send('Successfully deleted all books')
			} else {
				res.send(err);
			}
		})
	});

app.route('/api/books/:id')
	.get((req, res)=>{
		Book.findOne({_id: req.params.id}, (err, foundBook)=>{
			if (!err) {
				if (foundBook) {
					res.send(foundBook);
				} else {
					res.status(404).send("Book does not exist");
				}
			} else {
				res.status(404).send(err);
			}
		})
	})
	.put((req, res)=>{
		console.log(req.params.id)
		Book.update(
			{_id: req.params.id},
			{
				title: req.body.title,
				author: req.body.author
			},
			{overwrite: true},
			(err)=>{
				if (!err) {
					res.send(`Successfully updated book ${req.params.id}`)
				} else {
					res.send(err);
				}
			}
		)
	})
	.patch((req, res)=>{
		Book.update(
			{_id: req.params.id},
			{$set: req.body},
			(err)=>{
				if (!err) {
					res.send(`Successfully updated book ${req.params.id}`)
				} else {
					res.send(err)
				}
			}
		)
	})
	.delete((req, res)=>{
		Book.deleteOne(
			{_id: req.params.id},
			(err)=>{
				if (!err) {
					res.send(`Successfully deleted book ${req.params.id}`)
				} else {
					// statement
				}
			})
	})

app.listen(port, ()=> {
	console.log(`Server running on Port ${port}`);
})