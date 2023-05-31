const express = require("express");
const app = express();
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const homeRoute = require("./Routes/home");
const userRoute = require("./Routes/users");
const authRoute = require("./Routes/auth");
const postRoute = require("./Routes/posts");
const mypageRoute = require("./Routes/mypage");
const categoryRoute = require("./Routes/categories");
const session = require("express-session");

dotenv.config();

//Connect to MongoDB
mongoose.connect(
    process.env.DATABASE_URL,
    {useNewUrlParser: true, useUnifiedTopology: true},);
    const db = mongoose.connection;
    db.on("error", (error) => console.log(error));
    db.once("open", () => console.error("connected to database"));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

//express session
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}));

//Routes
app.use("/", homeRoute);
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/posts", categoryRoute);
app.use("/api/auth", mypageRoute);

//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

app.listen(3000, console.log("server is running"))