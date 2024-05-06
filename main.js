// imports
require("dotenv").config();
const express = require('express');
const mongoose = require("mongoose");
const session = require("express-session");
const app = express();
const PORT = process.env.PORT || 4000;
const cloudinary = require('cloudinary').v2; // Import Cloudinary
const config = require('./config'); // Import Cloudinary configuration

//Database Connection
mongoose.connect(process.env.DB_URI, {useNewUrlParser : true, useUnifiedTopology: true,});
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to DB"));

//MiddleWares
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(session({
    secret: "CRUD_SECRECT_KEY",
    saveUninitialized: true,
    resave: false,
}));

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret
});

//Setting Template Engine
app.set("view engine" , "ejs");

//Routes Prefix
app.use("", require("./routes/industryRoutes"));

app.get("/",(req,res) => {
    res.send("Hello World");
});

app.listen(PORT, () =>{
    console.log(`Server started at http://localhost:${PORT}`); 
});
