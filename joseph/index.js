//jshint esversion:6
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

const MongoClient = require('mongodb').MongoClient;
const uri = "this had to be removed"

async function run() {
  try {
    await client.connect();

    const database = client.db("test");
    const collection = database.collection("login_details");

  } finally {
    //await client.close();
  }
}
run().catch(console.dir);

async function add_detail(FirstName,LastName,Phone,Addy) {
  try {
    await client.connect();

    const database = client.db("test");
    const collection = database.collection("login_details");
    // create a document to be inserted
    const doc = { fname: FirstName, lname: LastName, contact: Phone, Address: Addy };
    const result = await collection.insertOne(doc);

    console.log(
      `${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`,
    );
  } finally {
    await client.close();
  }
}

async function print_detail() {
  try {
    await client.connect();

    const database = client.db("test");
    const collection = database.collection("login_details");
    // create a document to be inserted
    //const doc = { fname: FirstName, lname: LastName, contact: Phone, Address: Addy };
    const details = await collection.find({});

    //console.log(
    //  `${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`,
    //);
    //await details.forEach(console.dir);
    return details.forEach(console.dir);
  } finally {
    await client.close();
  }
}

async function single(usern) {
  try {
    await client.connect();

    const database = client.db("test");
    const collection = database.collection("login_details");
    // create a document to be inserted
    //const doc = { fname: FirstName, lname: LastName, contact: Phone, Address: Addy };
    const details = await collection.findOne({fname:usern });

    //console.log(
    //  `${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`,
    //);
    //await details.forEach(console.dir);
    return details.forEach(console.dir);
  } finally {
    await client.close();
  }
}
app.listen(3000, function(){
  console.log("Server is running");
});

app.get('/registration',function(req,res){
  res.sendFile(__dirname +"/reg.html");
});

app.get('/login',function(req,res){
  res.sendFile(__dirname +"/login.html");
});

app.post('/log',function(req,res){
username = req.body.uname;
passwod = req.body.pw;


  if (username=="joseph" && passwod=="1345"){
    var details = print_detail();
    res.send(details);
  }else{
    console.log("incorrect details");
  }

});

app.post('/reg', function(req,res){
  fname = req.body.fname;
  lname = req.body.lname;
  contact = req.body.contact;
  address = req.body.address;
  add_detail(fname,lname,contact,address).catch(console.dir);
  res.send('Registered');
});
