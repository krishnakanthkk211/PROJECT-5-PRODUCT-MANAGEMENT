const userModel = require("../models/userModel")
const { uploadFile } = require("../aws/aws")
const { isValidMobile, isValidname, validPassword, validateEmail } = require("../validations/validation")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { isValidObjectId } = require("mongoose")






const createUser = async (req, res) => {
    try {
        const data = req.body
        let files = req.files;
        if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, msg: "Please enter your details" }) }
        if (files.length == 0) { return res.status(400).send({ status: false, msg: "Please upload profileImage" }) }

        let { fname, lname, email, phone, password } = data

        if (!fname) { return res.status(400).send({ status: false, msg: "Please enter fname" }) }
        if (!isValidname(fname)) { return res.status(400).send({ status: false, msg: "Please enter valid fname" }) }

        if (!lname) { return res.status(400).send({ status: false, msg: "Please enter lname" }) }
        if (!isValidname(lname)) { return res.status(400).send({ status: false, msg: "Please enter valid lname" }) }

        if (!email) { return res.status(400).send({ status: false, msg: "Please enter email" }) }
        if (!validateEmail(email)) { return res.status(400).send({ status: false, msg: "Please enter valid email" }) }
        let dataByEmail = await userModel.findOne({ email: email })
        if (dataByEmail) { return res.send({ status: false, msg: "Account already created, Please login" }) }

        let profileImage = await uploadFile(files[0])
        data.profileImage = profileImage

        if (!phone) { return res.status(400).send({ status: false, msg: "Please enter phone" }) }
        if (!isValidMobile(phone)) { return res.status(400).send({ status: false, msg: "Please enter valid phone" }) }
        let dataByPhone = await userModel.findOne({ phone: phone })
        if (dataByPhone) { return res.send({ status: false, msg: "Account already created, Please login" }) }

        if (!password) { return res.status(400).send({ status: false, msg: "Please enter password" }) }
        if (!validPassword(password)) { return res.status(400).send({ status: false, msg: "Please enter valid password" }) }

        const passwordHash = await bcrypt.hash(password, 5)
        data.password = passwordHash

        if (!data.address) { return res.status(400).send({ status: false, msg: "Please enter address" }) }
        data.address = JSON.parse(data.address)

        if (data.address) {

            let { shipping, billing } = data.address

            if (!shipping) { return res.status(400).send({ status: false, msg: "Please enter shipping address" }) }
            if (!billing) { return res.status(400).send({ status: false, msg: "Please enter billing address" }) }

            if (shipping) {
                let { street, city, pincode } = shipping

                if (!street) { return res.status(400).send({ status: false, msg: "Please enter fname" }) }
                if (!city) { return res.status(400).send({ status: false, msg: "Please enter fname" }) }
                if (!pincode || typeof (pincode) != "number" || !/^[0-9]{6}$/.test(pincode)) { return res.status(400).send({ status: false, msg: "Please enter pincode & should be valid !" }) }
            }

            if (billing) {
                let { street, city, pincode } = billing

                if (!street) { return res.status(400).send({ status: false, msg: "Please enter fname" }) }
                if (!city) { return res.status(400).send({ status: false, msg: "Please enter fname" }) }
                if (!pincode || typeof (pincode) != "number" || !/^[0-9]{6}$/.test(pincode)) { return res.status(400).send({ status: false, msg: "Please enter pincode & should be valid !" }) }
            }
        }

        const result = await userModel.create(data)

        res.status(201).send({ status: true, data: result })

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}





const loginUser = async (req, res) => {

    try {
        let data = req.body
        if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, message: "Please enter Email Address and Password to Login yourself" }) }

        let { email, phone, password } = data;

        if (!(email || phone)) { return res.status(400).send({ status: false, message: "Please enter your Email address or Mobile number" }) }

        if (!password) { return res.status(400).send({ status: false, message: "Please Enter Password" }) }

        if (email) {
            if (!validateEmail(email)) { return res.status(400).send({ status: false, message: "Provided Email Address is not in valid" }) }
        }

        if (phone) {
            if (!isValidMobile(phone)) { return res.status(400).send({ status: false, message: "Please Enter Valid Phone Number" }) }
        }

        if (!validPassword(password)) { return res.status(400).send({ status: false, message: "Please enter valid password" }) }

        let userExist = await userModel.findOne({ $or: [{ email: email }, { phone: phone }] })

        if (!userExist) { return res.status(404).send({ status: false, message: "User doesn't exists !" }) }

        let checkPass = await bcrypt.compare(password, userExist.password)
        if (!checkPass) { return res.status(400).send({ status: false, message: "Please enter correct password" }) }

        let token = jwt.sign({ UserId: userExist._id, email: userExist.email, phone: userExist.phone }, "shopping", { expiresIn: "24h" })

        return res.status(200).send({ status: true, message: "User login successfull", data: { userId: userExist._id, token: token } })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}





const getUser = async (req, res) => {
    try {
        let userId = req.params.userId
        if (!isValidObjectId(userId)) { return res.status(400).send({ status: false, message: "userId is not valid" }) }

        const user = await userModel.findOne({ _id: userId })
        if (!user) { return res.status(404).send({ status: false, message: "user not found" }) }
        return res.status(200).send({ status: true, data: user })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }

}




const updateUser = async (req, res) => {
    try {
      let userId = req.params.userId;
      let data = req.body;
      let files = req.files;
      
      //getting the AWS-S3 link after uploading the user's profileImage
      if(files && files.length>0){
        let profileImgUrl = await uploadFile(files[0]);
        data.profileImage = profileImgUrl;
      }
  
      //validating the request body 
      //if (validate.isValidBody(data)) return res.status(400).send({ status: false, message: "Enter details to update your account" });
  
      //getting the user document
      if(!isValidObjectId(userId)){ return res.status(400).send({ status: false, message: "userId is not valid" }) }
      let userProfile = await User.findById(userId);
      
      if(data?.fname || typeof data.fname == 'string') {
        //checking for fname
        if (validate.isValid(data.fname)) return res.status(400).send({ status: false, message: "First name is required and should not be an empty string" });
  
        //validating fname
        if (validate.isValidString(data.fname)) return res.status(400).send({ status: false, message: "Enter a valid first name and should not contain numbers" });
      }
  
      if(data?.lname || typeof data.lname == 'string') {
        //checking for lname
        if (validate.isValid(data.lname)) return res.status(400).send({ status: false, message: "Last name is required and should not be an empty string" });
  
        //validating lname
        if (validate.isValidString(data.lname)) return res.status(400).send({ status: false, message: "Enter a valid last name and should not contain numbers" });
      }
  
      //validating user email-id
      if (data?.email && (!validate.isValidEmail(data.email))) return res.status(400).send({ status: false, message: "Enter a valid email-id" });
  
      //validating user phone number
      if (data?.phone && (!validate.isValidPhone(data.phone))) return res.status(400).send({ status: false, message: "Enter a valid phone number" });
  
      if(data?.password || typeof data.password == 'string') {
      //validating user password
        if (!validate.isValidPwd(data.password)) return res.status(400).send({ status: false, message: "Password should be 8-15 characters long and must contain one of 0-9,A-Z,a-z and special characters" });
  
        //hashing the password with bcrypt
        data.password = await bcrypt.hash(data.password, 10);
      }
  
      //checking if email already exist or not
      let checkEmail = await User.findOne({ email: data.email });
      if (checkEmail) return res.status(400).send({ status: false, message: "Email already exist" });
  
      //checking if phone number already exist or not
      let checkPhone = await User.findOne({ phone: data.phone });
      if (checkPhone) return res.status(400).send({ status: false, message: "Phone number already exist" });
  
      if(data?.address) {
        //validating the address
        if (validate.isValid(data.address)) return res.status(400).send({ status: false, message: "Address should be in object and must contain shipping and billing addresses" });
  
        //converting string to JSON
        data.address = JSON.parse(data.address)
        
        let tempAddress = JSON.parse(JSON.stringify(userProfile.address))
  
        if(data.address?.shipping) {
          //validating the shipping address
          if (validate.isValid(data.address.shipping)) return res.status(400).send({ status: false, message: "Shipping address should be in object and must contain street, city and pincode" });
  
          if(data.address.shipping?.street){
            if (validate.isValid(data.address.shipping.street)) return res.status(400).send({ status: false, message: "Street of shipping address should be valid and not an empty string" });
  
            tempAddress.shipping.street = data.address.shipping.street 
          }
  
          //checking for city shipping address
          if (data.address.shipping?.city) {
            if (validate.isValid(data.address.shipping.city)) return res.status(400).send({ status: false, message: "City of shipping address should be valid and not an empty string" });
  
            tempAddress.shipping.city = data.address.shipping.city
          }
  
          //checking for pincode shipping address
          if (data.address.shipping?.pincode) {
            if (validate.isValid(data.address.shipping.pincode)) return res.status(400).send({ status: false, message: "Pincode of shipping address and should not be an empty string" });
  
            if (!validate.isValidString(data.address.shipping.pincode)) return res.status(400).send({ status: false, message: "Pincode should be in numbers" });
  
            if (!validate.isValidPincode(data.address.shipping.pincode)) return res.status(400).send({ status: false, message: "Enter a valid pincode" });
  
            tempAddress.shipping.pincode = data.address.shipping.pincode;
          }
        }
  
        if(data.address?.billing) {
          //validating the shipping address
          if (validate.isValid(data.address.billing)) return res.status(400).send({ status: false, message: "Shipping address should be in object and must contain street, city and pincode" });
  
          if(data.address.billing?.street){
            if (validate.isValid(data.address.billing.street)) return res.status(400).send({ status: false, message: "Street of billing address should be valid and not an empty string" });
  
            tempAddress.billing.street = data.address.billing.street 
          }
  
          //checking for city billing address
          if (data.address.billing?.city) {
            if (validate.isValid(data.address.billing.city)) return res.status(400).send({ status: false, message: "City of billing address should be valid and not an empty string" });
  
            tempAddress.billing.city = data.address.billing.city
          }
  
          //checking for pincode billing address
          if (data.address.billing?.pincode) {
            if (validate.isValid(data.address.billing.pincode)) return res.status(400).send({ status: false, message: "Pincode of billing address and should not be an empty string" });
  
            if (!validate.isValidString(data.address.billing.pincode)) return res.status(400).send({ status: false, message: "Pincode should be in numbers" });
  
            if (!validate.isValidPincode(data.address.billing.pincode)) return res.status(400).send({ status: false, message: "Enter a valid pincode" });
  
            tempAddress.billing.pincode = data.address.billing.pincode;
          }
        }
  
        data.address = tempAddress;
      }
  
      let updateUser = await User.findOneAndUpdate(
        {_id: userId},
        data,
        {new: true}
      )
      res.status(200).send({ status: true, message: "User profile updated", data: updateUser });
    } catch (err) {
      res.status(500).send({ status: false, error: err.message })
    }
  }


module.exports = { createUser, loginUser, getUser, updateUser }