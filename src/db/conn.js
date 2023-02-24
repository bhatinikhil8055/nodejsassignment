const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://bhati8055:Bh%40ti8055@cluster0.ppsgck7.mongodb.net/test", {
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(() =>{
    console.log('Database Connected Successfully')
}).catch((e) =>{
    console.log('Database Connect Error')
})