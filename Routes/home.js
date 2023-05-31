const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();

//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

//views
//home page
app.get("/", (req, res) => {
    res.render("home");
})

module.exports = app;