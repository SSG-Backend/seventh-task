const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const port = 3000;

mongoose.connect("mongodb://localhost:27017/formDB", { useNewUrlParser: true, useUnifiedTopology: true });

const formSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    address: String,
    zip: Number
});
const Form = mongoose.model("Form", formSchema);

const form = new Form({
    firstName: "Hassan",
    lastName: "Ademuyiwa",
    address: "Dopemu, Agege, Lagos",
    zip:2341
});
const app = express();

form.save();

app.set('view engine', 'ejs');

app.get("/", function(req, res){
    
res.render("index", {
    
});

});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  });