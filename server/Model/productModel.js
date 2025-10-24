import mongoose from "mongoose";

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters long"],
      maxlength: [100, "Product name can't exceed 100 characters"],
    },
   
    description: {
      type: String,
      required: [true, "Please enter product description"],
      trim: true,
      minlength: [10, "Description should be at least 10 characters long"],
    },

    price: {
      type: Number,
      required: [true, "Please enter product price"],
      min: [0, "Price cannot be negative"],
      index: true,
    },

    category: {
      type: String,
      required: [true, "Please enter product category"],
      trim: true,
      index: true,
    },

    brand: {
      type: String,
      default: "Generic",
      trim: true,
      index: true,
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },

    image: {
      type: String,
      default: "", // Avoid undefined fields
    },

    // isActive: {
    //   type: Boolean,
    //   default: true, // Soft delete or hide products easily
    //   index: true,
    // },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

productSchema.index({ name: "text", description: "text", category: "text", brand: "text" });
productSchema.index({ createdAt: -1 });
productSchema.path("stock").get(Math.round);
productSchema.path("price").get((v) => Number(v.toFixed(2)));

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
