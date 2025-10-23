import mongoose from "mongoose";

const {Schema} = mongoose;

const productSchema = new Schema({
  name: {
      type: String,
      required: [true, "Please enter product name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please enter product description"],
    },
    price: {
      type: Number,
      required: [true, "Please enter product price"],
      min: 0,
    },
    category: {
      type: String,
      required: [true, "Please enter product category"],
    },
    brand: {
      type: String,
      default: "Generic",
    },
   stock: {
      type: Number,
      required: true,
      default: 0,
    },
  image: String,
},
  {
    timestamps: true,
  }
)

const Product = mongoose.model("Product", productSchema)

export default Product;