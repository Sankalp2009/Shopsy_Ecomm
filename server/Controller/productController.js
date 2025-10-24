import Product from "../Model/productModel.js";
import ApiFeature from "../Utils/ApiFeature.js";
import mongoose from "mongoose";

import {
  isValidObjectId,
  sanitizeProductData,
} from "../Utils/IsValidObject.js";

export const getAllProduct = async (req, res) => {
  try {
    // 1️⃣ Build query features
    const features = new ApiFeature(Product.find().lean(), req.query)
      .search()
      .filter()
      .sort()
      .paginate();

    // 2️⃣ Run product query + total count in parallel
    const [products, totalProducts] = await Promise.all([
      features.findQuery.exec(),
      Product.countDocuments(features.findQuery.getFilter()),
    ]);

    // 3️⃣ Pagination calculation
    const totalPages = Math.ceil(totalProducts / features.limit);

    // 4️⃣ Return success (frontend can handle empty state)
    return res.status(200).json({
      status: "success",
      result: products.length,
      message:
        products.length > 0 ? "List of all products" : "No products found",
      data: products,
      pagination: {
        currentPage: features.page,
        totalPages,
        totalProducts,
        hasNext: features.page < totalPages,
        hasPrev: features.page > 1,
      },
    });
  } catch (err) {
    console.error("getAllProduct error:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid product ID format",
      });
    }

    // Use lean() for better performance (returns plain JS object)
    const product = await Product.findById(id).lean().exec();

    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (error) {
    console.error("getProductById error:", error);
    return res.status(500).json({
      status: "error",
      message: "Server Error",
      error: error.message,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    let products = req.body;

    // Handle case when a single product object is sent
    if (!Array.isArray(products)) {
      products = [products];
    }

    // Validate all products
    const invalidProducts = products.filter(
      (p) =>
        !p.name ||
        !p.description ||
        p.price === undefined ||
        !p.category ||
        !p.brand ||
        p.stock === undefined ||
        !p.image
    );

    if (invalidProducts.length > 0) {
      return res.status(400).json({
        status: "fail",
        message:
          "Some products are missing required fields (name, description, price, category, brand, stock, image)",
      });
    }

    // Check for duplicates (by name)
    const existingNames = await Product.find({
      name: { $in: products.map((p) => new RegExp(`^${p.name}$`, "i")) },
    });

    if (existingNames.length > 0) {
      return res.status(400).json({
        status: "fail",
        message: `Duplicate product(s) found: ${existingNames
          .map((p) => p.name)
          .join(", ")}`,
      });
    }

    // Clean and parse data
    const preparedProducts = products.map((p) => ({
      name: p.name.trim(),
      description: p.description.trim(),
      price: parseFloat(p.price),
      category: p.category.trim(),
      brand: p.brand.trim(),
      stock: parseInt(p.stock, 10),
      image: p.image.trim(),
    }));

    // Bulk insert
    const newProducts = await Product.insertMany(preparedProducts);

    return res.status(201).json({
      status: "success",
      message: `${newProducts.length} product(s) created successfully`,
      data: newProducts,
    });
  } catch (error) {
    console.error("createProduct error:", error);
    return res.status(500).json({
      status: "error",
      message: "Server Error",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid product ID format",
      });
    }

    let updateData;
    try {
      updateData = sanitizeProductData(req.body);
    } catch (validationError) {
      return res.status(400).json({
        status: "fail",
        message: validationError.message,
      });
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "No valid fields to update",
      });
    }

    // Use findByIdAndUpdate with runValidators for schema-level validation
    const updated = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      lean: true, // for faster response
    }).exec();

    if (!updated) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Product updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("updateProduct error:", error);
    return res.status(500).json({
      status: "error",
      message: "Server Error",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid product ID format",
      });
    }

    const deleted = await Product.findByIdAndDelete(id).lean().exec();

    if (!deleted) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
      data: { _id: deleted._id, name: deleted.name },
    });
  } catch (error) {
    console.error("deleteProduct error:", error);
    return res.status(500).json({
      status: "error",
      message: "Server Error",
      error: error.message,
    });
  }
};
