const mongoose = require("mongoose");
const bcrypt = require ("bcryptjs");
const jwt = require ("jsonwebtoken");

const UsersSchema = new mongoose.Schema({

firstname:{
    type:String,
    required:true,
},
lastname:{
    type:String,
    required:true,
},
username:{
    type:String,
    required:true,
    unique:true,
},
password:{
    type:String,
    required:true,
},
mobile:{
    type:Number,
    required:true,
    unique:true,
},
email:{
    type:String,
    required:true,
    unique:true,
},
userrole:{
    type:String,
    required:true,
    
},
tokens:[{

    token:{
        type:String,
        required:true,        
    }

}]





})

//JWT TOKEN GENERATION WHILE REGISTERING USER

UsersSchema.methods.generateAuthToken = async function(){

    try {

        const token = jwt.sign({_id:this._id.toString()}, "thisisjsonwebtokengeneration");
        this.tokens = this.tokens.concat({token:token});
        await this.save();        
        return token; 
        
    } catch (error) {

        res.send(error);
        console.log(error);
        
    }

}


//Hashing Password Before Saving Into Database
UsersSchema.pre("save", async function(next) {

    if(this.isModified("password")){

        this.password = await bcrypt.hash(this.password,10);
        

    }
    
    next();
    
    
})

const Register = new mongoose.model("data", UsersSchema);
module.exports = Register;