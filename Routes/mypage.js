const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();

//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

//views
//my page
app.get("/mypage", (req, res) => {
    res.render("mypage");
})

module.exports = app;