const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const Book = require("./models/bookModel");

// Connect to a hosted cloud database with mongoose
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!"));

// Import the json file synchronously
const books = JSON.parse(fs.readFileSync(`${__dirname}/data.json`, "utf-8"));

// Import data into DATABASE
const importData = async () => {
  try {
    await Book.create(books);
    console.log("Data Successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// Delete data from the database
const deleteData = async () => {
  try {
    await Book.deleteMany();
    console.log("Data Successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
