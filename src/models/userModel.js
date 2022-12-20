const mongoose = require("mongoose")

const UserSchema = mongoose.Schema({
    fname: {type:String , require:true},
    lname: {type:String , require:true},
    email: {type:String , require:true},
    profileImage: {type:String , require:true}, 
    phone: {type:String , require:true },
    password: {type:String , require:true},
    address:{    
        shipping:{
            street:{type:String  , trim:true},
            city:{type:String ,trim:true},
            pincode:{type:Number ,  require:true, trim:true}
        },
        billing:{ 
            street:{type:String ,trim:true},
            city:{type:String,trim:true},
            pincode:{type:Number ,  require:true, trim:true}
        } 
    },
    billing:{type:Object}
},{timestamps:true})


module.exports = mongoose.model("User" ,UserSchema )
