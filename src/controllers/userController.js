const userModel = require("../models/userModel")
const { uploadFile } = require("../aws/aws")

const createUser = async (req, res) => {
    const data = req.body
    let files = req.files;
    if(Object.keys(data).length==0){return res.status(400).send({status:false, msg: "Please enter your details"})}
    if(files.length==0){return res.status(400).send({status:false, msg: "Please upload profileImage"})}
    
    let {fname, lname, email, phone, password, address} = data

    if(!fname){ return res.status(400).send({status:false, msg:"Please enter fname"})}
    //if(!isValidName(fname)){ return res.status(400).send({status:false, msg:"Please enter valid fname"})}
    
    if(!lname){ return res.status(400).send({status:false, msg:"Please enter lname"})}
    //if(!isValidName(lname)){ return res.status(400).send({status:false, msg:"Please enter valid lname"})}
   
    if(!email){ return res.status(400).send({status:false, msg:"Please enter email"})}
   // if(!isValidEmail(email)){ return res.status(400).send({status:false, msg:"Please enter valid email"})}
    // let dataByEmail = await userModel.findOne({email:email})
    // if(dataByEmail){return res.send({status:false, msg:"Account already created, Please login"})}

    let profileImage = await uploadFile(files[0])
    data.profileImage = profileImage

    if(!phone){ return res.status(400).send({status:false, msg:"Please enter phone"})}
    // if(!isValidPhone(phone)){ return res.status(400).send({status:false, msg:"Please enter valid phone"})}
    // let dataByPhone = await userModel.findOne({phone:phone})
    // if(dataByPhone){return res.send({status:false, msg:"Account already created, Please login"})}

    if(!password){ return res.status(400).send({status:false, msg:"Please enter password"})}
    //if(!isValidPass(password)){ return res.status(400).send({status:false, msg:"Please enter valid password"})}
    
    if(!address){ return res.status(400).send({status:false, msg:"Please enter address"})}
   
    if(address){
        
    }
    const result = await userModel.create(data)

    res.status(201).send({status:true, data:result})
}

const loginUser = async (req, res) => {

}

const getUser = async (req, res) => {

}


const updateUser = async (req, res) => {

}

module.exports = { createUser, loginUser, getUser, updateUser }