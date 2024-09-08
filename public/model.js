const mongoose=require("mongoose");

const userSchema= new mongoose.Schema({

    Full_Name :{
        type : String,
        required : true,
    },
    Email :{
        type : String,
        required : true,
        
    },
    Mob_no :{
        type : String,
        required : true,
    },
    Message :{
        type : String,
        required : true,
    },
})

const usercollection= mongoose.model("userdetail",userSchema);

module.exports=usercollection;