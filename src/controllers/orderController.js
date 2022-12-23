const orderModel = require("../models/orderModel")





const createOrder = async (req, res)=>{

    let data = req.body
    let userId = req.params.userId
    data.userId = userId
    
}



const updateOrder = async (req, res)=>{

}



module.exports = {createOrder, updateOrder}