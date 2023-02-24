const express = require("express");
const { handlebars } = require("hbs");
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");
const app = express();
const PORT = process.env.PORT || 3000
const auth = require("./src/middleware/auth")
require("./src/db/conn");
const userregister = require("./src/models/userregister");

const static_path = path.join(__dirname,"../public" );
const views_path = path.join(__dirname,"../templates/views" );
const partials_path = path.join(__dirname,"../templates/partials" );
app.use(express.static(static_path));
app.use(express.json()); 
app.use(cookieparser());      
app.use(express.urlencoded({extended: true}));

app.set("view engine", "hbs");
app.set("views",views_path);
hbs.registerPartials(partials_path);

app.get("/",(req,res) => {
    res.render("index")
})
app.get("/index",(req,res) => {
    res.render("index")
})
app.get("/register",(req,res) => {
    res.render("register")
})
app.get("/home", auth, (req,res) => {   
     
    res.render("home")
})
app.get("/logout", auth, async(req, res)=>{

    try {

        req.user.tokens = req.user.tokens.filter((database)=>{
            return database.token != req.token


        })

        res.clearCookie("jwttoken")
        //res.send("Logout Successfully Please Login Again to access this page")
        console.log("Logout Successfully");
        console.log(req.user);
        await req.user.save();
        res.render("index");
        
    } catch (error) {
        res.status(500).send(error)
        
    }

})

//User Register
app.post("/register", async(req,res)=>{

try {    
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;

    if (password === confirmpassword) {

        const registeruser = new userregister({

            firstname: req.body.firstname,
            lastname:  req.body.lastname,
            username:  req.body.username,
            password:  password,            
            mobile: req.body.mobile,
            email: req.body.email,
            userrole:  req.body.userrole,
            

        });

        

        const token = await registeruser.generateAuthToken();
        console.log(token);
        
        const registered = await registeruser.save();
        res.status(201).render("index");

    }else {
        res.send("Password and Confirm Password Not Matching")
    }

    
} catch (error) {
    res.status(400).send(error)
    
}

})

//Login Check
app.post("/", async(req, res) =>{

    try {
        const username = req.body.username;
        const password = req.body.password;
        
        const userusername = await userregister.findOne({username:username});
        
        const isMatch = await bcrypt.compare(password,userusername.password)

        //JWT TOKEN
        const token = await userusername.generateAuthToken();

        //SAVE TOKEN AS COOKIE IN BROWSER
        res.cookie("jwttoken", token, {
            httpOnly:true
        });


        if(isMatch){

           res.status(201).render("home.hbs");
            

        }else {

            res.send("Invalid Login Creditionals!")

        }

    
} catch (error) {
    res.status(400).send("Invalid Username or Password")
    
}

});



app.listen(PORT, () => {
    console.log('Server is Started at Port 3000');
})