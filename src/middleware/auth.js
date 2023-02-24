const jwt = require("jsonwebtoken");
const register = require("../models/userregister");

const auth = async (req, res, next) => {

try {

    const token = req.cookies.jwttoken;
    const verifyuser = jwt.verify(token, "thisisjsonwebtokengeneration");
    //Get User Data From JWT Token
    const user = await register.findOne({_id:verifyuser._id})
    console.log(user.firstname);

    //Getting token and user Data For Logout Functionality
    req.token = token;
    req.user = user;
    next();
    
} catch (error) {

    res.status(401).send(error);
    
}

}

module.exports = auth;