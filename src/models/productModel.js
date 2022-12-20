const mongoose = require("mongoose")



const ProduactSChema = mongoose.Model({
    title: { type: String, require: true, unique: true },
    description: { type: String, require: true },
    currencyId: { type: String, require: true },
    currencyFormat: { type: String, require: true }, 
    isFreeShipping: { type: Boolean, default: false },
    productImage: { type: String, require: true },
    style: { type: String },
    availableSizes: { enum: ["S", "XS", "M", "X", "L", "XXL", "XL"] },
    installments: { Number },
    deletedAt: { type: Date }

}, { timestamps: true })

module.exports = mongoose.model("Products", ProduactSChema)