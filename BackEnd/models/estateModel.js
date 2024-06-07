const mongoose = require('mongoose') // Erase if already required
const typeEstate = require('../utils/typeEstate')

// Declare the Schema of the Mongo model
var estateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, tirm: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    regularPrice: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 },
    baths: { type: Number, required: true },
    beds: { type: Number, required: true },
    furnished: { type: Boolean, default: false },
    parking: { type: Boolean, default: false },
    offer: { type: Boolean, default: false },
    images: { type: Array, required: true },
    owner: { type: String, required: true },
    type: {
      type: String,
      enum: [typeEstate?.SALE, typeEstate?.RENT],
      required: true
    }
  },
  { timestamps: true }
)

//Export the model
module.exports = mongoose.model('Estate', estateSchema)
