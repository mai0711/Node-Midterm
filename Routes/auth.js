const router = require("express").Router();
const { request } = require("express");
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

//middleware
router.use(bodyParser.urlencoded({extended: true}))

//Register page(view)
router.get("/register", (req, res) => {
    res.render("register");
})

//Register handle
router.post("/register", async (req,res) => {
    try{
        const { username, email, password } = await req.body
        //generate hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        //create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        //save user and respond
        const user = await newUser.save();//save data in Database
    } catch(err) {
        res.status(500).json(err);
    }
    res.redirect("/api/auth/login");
});

//login page(view)
router.get("/login", (req, res) => {
    res.render("login");
})

//login handle
router.post("/login", async(req, res) => {
    try{
        const { email, password } = await req.body
        //check email
        const user = await User.findOne({email: email});
        !user && res.status(404).json("user not found")// wrong email
        //check password
        const validPassword = await bcrypt.compare(password, user.password)
        !validPassword && res.status(400).json("wrong password")// wrong password
        //res.status(200).json(user)//email and password are correct
    }catch(err){
        res.status(500).json(err);
    }
    
    res.redirect("/api/auth/mypage")
})

module.exports = router