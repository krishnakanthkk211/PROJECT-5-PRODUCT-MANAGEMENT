const mongoose = require("mongoose")

const UserSchema = mongoose.Schema({
    fname: {type:String , require:true},
    lname: {type:String , require:true},
    email: {type:String , require:true, unique :true},
    profileImage: {type:String , require:true}, 
    phone: {type:String , require:true, unique :true },
    password: {type:String , require:true},
    address:{type:Object},
    billing:{type:Object}
    
},{timestamps:true})

module.exports = mongoose.model("userCollection" ,UserSchema )
