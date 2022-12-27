const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const productController = require("../controllers/productController")
const orderController = require("../controllers/orderController")
const cartController = require("../controllers/cartController")
const auth = require("../middleware/auth")



//------------------------- User Controller APIs ------------------------//

router.post("/register", userController.createUser) //korvi 

router.post("/login", userController.loginUser)      //Shivam

router.get("/user/:userId/profile", auth.authentication, auth.authorisation, userController.getUser)   //Aman

router.put("/user/:userId/profile", auth.authentication, auth.authorisation, userController.updateUser)  //Vishal


//------------------------- Product Controller APIs ------------------------//

router.post("/products", productController.createproduct)    //Korvi

router.get("/products", productController.getProduct)          //Aman

router.get("/products/:productId", productController.getProductById)      //vishal

router.put("/products/:productId", productController.updateProduct)    //Shivam

router.delete("/products/:productId", productController.deleteProduct)    //Aman


//-------------------------Cart Controller APIs------------------------//


router.post("/users/:userId/cart", auth.authentication, auth.authorisation, cartController.createCart)  //vishal

router.get("/users/:userId/cart", auth.authentication, auth.authorisation, cartController.getCart)      //korvi

router.put("/users/:userId/cart", auth.authentication, auth.authorisation, cartController.updateCart)   //aman

router.delete("/users/:userId/cart", auth.authentication, auth.authorisation, cartController.deleteCart)   //shivam



//-------------------------Order Controller APIs------------------------//


router.post("/users/:userId/orders", auth.authentication, auth.authorisation, orderController.createOrder) //Vishal


router.put("/users/:userId/orders", auth.authentication, auth.authorisation, orderController.updateOrder)  //Korvi


//--------------------------------------------------------------------------//

router.all("/**", (req, res)=>{
    res.status(400).send({status:false, message:"Route is wrong"})
})
module.exports = router