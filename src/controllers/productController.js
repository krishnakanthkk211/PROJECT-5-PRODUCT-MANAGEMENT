const productModel = require('../models/productModel')
const { uploadFile } = require("../aws/aws")

const createproduct = async (req, res) => {
    try {
        const data = req.body
        let files = req.files;
        let arrOfKeys = Object.keys(data)
        if (arrOfKeys.length == 0) { return res.status(400).send({ status: false, msg: "Please enter your details" }) }

        for (let i = 0; i < arrOfKeys.length; i++) {
            data[arrOfKeys[i]] = data[arrOfKeys[i]].trim()
        }
        data.availableSizes = JSON.parse(data.availableSizes)

        let { title, description, price, currencyId, currencyFormat, style, availableSizes, installments } = data

        if (!title) { return res.status(400).send({ status: false, message: "Enter Title!" }) }

        let unoqeTitle = await productModel.find({ title: title })
        if (unoqeTitle.length != 0) { return res.status(400).send({ status: false, message: "Enter Unique Title!" }) }

        if (!description) { return res.status(400).send({ status: false, message: "Enter description!" }) }

        if (!price) { return res.status(400).send({ status: false, message: "Enter price!" }) }
        if (!/^\d{0,8}[.]?\d{1,4}$/.test(price)) { return res.status(400).send({ status: false, message: "Enter Valid Price" }) }

        if (!currencyId) { return res.status(400).send({ status: false, message: "Enter Currency id " }) }
        if (currencyId != "INR") { return res.status(400).send({ status: false, message: "Currency Should be INR" }) }

        if (!currencyFormat) { return res.status(400).send({ status: false, message: "Enter Currency Format!" }) }
        if (currencyFormat != "₹") { return res.status(400).send({ status: false, message: "Invalid currency Format" }) }

        if (files.length == 0) { return res.status(400).send({ status: false, msg: "Please upload productImage" }) }

        let productImage = await uploadFile(files[0])
        data.productImage = productImage

        if (!style) { return res.status(400).send({ status: false, message: "Enter style" }) }
        if (!availableSizes) { return res.status(400).send({ status: false, message: "enter required size" }) }

        const enums = productModel.schema.obj.availableSizes.enum
        for (let i = 0; i < availableSizes.length; i++) {
            let yesNo = (enums.includes(availableSizes[i])) ? true : false
            if (!yesNo) {
                return res.status(400).send({ status: false, message: "Please enter valid size" })
            }
        }


        // -------------------------------------------------------------------
        // if(availableSizes){
        //     const enums = productModel.schema.obj.availableSizes.enum   
        //     data.availableSizes = JSON.parse(availableSizes)
        //     if(data.availableSizes.length == 0){return res.status(400).send({status:false,message:"availableSizes should be array "})}
        //     let emp = []
        //     const EnumValid = enums.forEach((x,i)=>{
        //         let a = data.availableSizes.includes(x)
        //         if(a === true){emp.push(a)}
        //     })
        //     console.log(emp.length ,data.availableSizes.length)
        //     if(emp.length !== data.availableSizes.length){
        //           return  res.status(400).send({status:false,message:"Enter Valid size "})
        //     }

        // }
        //--------------------------------------------------------------------------------------------------

        if (!/^\d{0,8}[.]?\d{1,4}$/.test(installments)) { return res.status(400).send({ status: false, message: "Installement Should be number" }) }
        const result = await productModel.create(data)
        res.status(201).send({ status: true, data: result })

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}




const getProduct = async (req, res) => {
    try {
        let data = req.query;

        let options = { isDeleted: false }

        if (data.size) { options.availableSizes = data.size }
        if (data.name) { options.title = { $regex: data.name, $options: "i" } }

        if (data.priceGretherThen || data.priceLessThan) {
            if (data.priceGretherThen && data.priceLessThan) { options.price = { $gt: data.priceGretherThen, $lt: data.priceLessThan } }
            else if (data.priceGretherThen) { options.price = { $gt: data.priceGretherThen } }
            else { options.price = { $lt: data.priceLessThan } }
        }

        let sortObj = {}
        if (data.priceSort) {
            if (data.priceSort == 1 || data.priceSort == -1) { sortObj.price = data.priceSort }
            else { return res.status(400).send({ status: false, message: "Please enter priceSort value 1 or -1 only" }) }
        }

        let result = await productModel.find(options).sort(sortObj)
        if (result.length == 0) { return res.status(404).send({ status: false, message: "No product found !" }) }

        return res.status(200).send({ status: true, message: "Success", count: result.length, data: result })

    } catch (err) {
        return res.status(500).send(err.message)
    }
}





const getProductById = async (req, res) => {
    try {
        let productId = req.params.productId

        if (!isValidObjectId(productId))
            return res.status(400).send({ status: false, message: 'Invalid ProductId!' })

        let product = await productModel.findById({ _id: productId, isDleted: false })

        if (!product)
            return res.status(404).send({ status: false, message: "Product not found!" })

        res.status(200).send({ status: true, data: product })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

const updateProduct = async (req, res) => {
          
}


const deleteProduct = async (req, res) => {
    try {
        let productId = req.params.productId

        if (isValidObjectId(productId))
            return res.status(400).send({ status: false, message: " Invalid ProductId" })

        let deletedProduct = await productModel.findOneAndUpdate({ _id: productId, isDeleted: false }, { isDeleted: true, deletedAt: Date.now() }, { new: true })

        if (!deletedProduct)
            return res.status(404).send({ status: false, message: "Product not found or Already deleted." })

        res.status(200).send({ status: true, message: "Product deleted successfully." })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = { createproduct, getProduct, getProductById, updateProduct, deleteProduct }