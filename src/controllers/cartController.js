const { isValidObjectId } = require("mongoose")
const cartModel = require("../models/cartModel")
const productModel = require("../models/productModel")
const userModel = require("../models/userModel")



const createCart = async (req, res) => {
    try {
        let data = req.body
        let userId = req.params.userId

        let { productId, cardId } = data

        let user = await userModel.findOne({ _id: userId })
        let product = await productModel.findOne({ _id: productId })

        let userCart = await cartModel.findOne({ userId: userId })
        if (!userCart) {
            data.userId = userId

            let arr = [{
                productId: productId,
                quantity: 1
            }]
            data.items = arr
            data.totalPrice = product.price
            data.totalItems = 1
            let result = await cartModel.create(data)
            return res.send(result)

        } else {
            data.userId = userId
            let check = false;
            let itemsArr = userCart.items
            itemsArr.forEach(x => {
                if (x.productId == productId) {
                    x.quantity += 1
                    check = true
                }
            })
           
            if (!check) {
                itemsArr.push({
                    productId: productId,
                    quantity: 1
                })
            }
            data.items = itemsArr
            data.totalPrice = userCart.totalPrice + product.price
            data.totalItems = userCart.totalItems +1

            let result = await cartModel.findOneAndUpdate({_id:userCart._id}, data, {new:true})
            return res.send(result)
         }

    }
    catch (err) {
        res.status(500).send({ status: false, data: err.message })
    }
}

const getCart = async (req, res) => {
    try {
       let user = req.userByUserId
       
       let userCart = await cartModel.findOne({ userId: user._id})
       if (!userCart){ return res.status(404).send({ status: false, message: "Cart not found !" }) }

        return res.status(200).send({ status: true, message: "Success", data: userCart })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


const updateCart = async (req, res) => {
    try {

        let user = req.userByUserId

        let { productId, cartId, removeProduct } = req.body;

        let data = {}
        data.userId = user._id

        if (!productId) return res.status(400).send({ status: false, message: " Please provide productId" });
        if (!isValidObjectId(productId)) { return res.status(400).send({ status: false, message: " Enter a valid productId" }); }
        let product = await productModel.findOne({ _id: productId, isDeleted: false });
        if (!product) return res.status(404).send({ status: false, msg: "Product does not exist" });

        if (!cartId) return res.status(400).send({ status: false, message: " Please provide cartId" });
        if (!isValidObjectId(cartId)) { return res.status(400).send({ status: false, message: " Enter a valid cartId" }); }
        let cart = await cartModel.findOne({ userId: user._id });
        if (!cart) return res.status(404).send({ status: false, msg: "cart does not exist" });

        if (!removeProduct) return res.status(400).send({ status: false, message: " Please enter removeProduct details", });
        
        if(removeProduct==0){
           
            let check = false;
            let deleteProduct ;
            let itemArr = cart.items
            itemArr.forEach(x=>{
                if(x.productId == productId){
                    check = true
                    deleteProduct = x
                    let i = itemArr.indexOf(x)
                    arr.splice(i, i+1)
                }
            })
            if(!check){return res.status(400).send({status:false, message:"No such product exits in cart"})}
            let price = product.price
            let quantity = deleteProduct.quantity
            let sum = price * quantity

            data.items = itemArr
            data.totalPrice = cart.totalPrice - sum
            data.totalItems = cart.totalItems - quantity

            let result = await cartModel.findOneAndUpdate({ userId: user._Id }, data, {new:true})

            return res.status(200).send({status:true, data:result})

        }else if(removeProduct==1){
        
            let check = false;
            let deleteProduct ;
            let itemArr = cart.items
            itemArr.forEach(x=>{
                if(x.productId == productId){
                    check = true
                    deleteProduct = x
                    if(x.quantity>1){
                        x.quantity -= 1
                    }else{
                        
                    }
                   
                }
            })
            if(!check){return res.status(400).send({status:false, message:"No such product exits in cart"})}

            data.items = itemArr
            data.totalPrice = cart.totalPrice - product.price
            data.totalItems = cart.totalItems - 1

            let result = await cartModel.findOneAndUpdate({ userId: user._id }, data, {new:true})

            return res.status(200).send({status:true, data:result})
        }else{
            return res.status(400).send({status:false, message:"please enter valid removeProduct value (0/1) "})
        }
       
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message });
    }
};


const deleteCart = async (req, res) => {
    try {
        let cartId = req.params.userId
        if (!isValidObjectId(cartId)) { return res.status(400).send({ status: false, msg: " Please Enter a valid cartId ! " }) }

        let dataUpdate = {
            totalPrice: 0,
            totalItems: 0,
           
        }
        let cartData = await cartModel.findOne({ userId: cartId })
        if (!cartData) { return res.status(400).send({ status: false, msg: " Cart is not found!" }) }

        await cartModel.findOneAndUpdate({ userId: cartId }, { $set: dataUpdate })
        res.status(200).send({ status: true, msg: " Cart is deleted ! " })

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}





module.exports = { createCart, getCart, updateCart, deleteCart }