// controllers/productController.js

import Product from "../Model/productModel.js";
import ApiFeature from "../Utils/ApiFeature.js";

export const getAllProduct = async (req, res) => {
  try {
    // Step 1: Build query with features
    const features = new ApiFeature(Product.find(), req.query)
      .search()
      .filter()
      .sort()
      .paginate();

    // Step 2: Execute query
    const products = await features.exec();

    // Step 3: Count total products with proper filter respect
    // Build the same filter/search query for counting
    const countFeatures = new ApiFeature(Product.find(), req.query)
      .search()
      .filter();

    const totalProducts = await Product.countDocuments(
      countFeatures.findQuery.getFilter()
    );
    const totalPages = Math.ceil(totalProducts / features.limit);

    // Step 4: Return success even if empty (frontend handles display)
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
    const id = req.params.id;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid product ID format",
      });
    }

    const product = await Product.findById(id).lean();

    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Product found",
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
    const { name, description, price, category, brand, stock, image } =
      req.body || {};

    // Basic validation
    if (
      !name ||
      !description ||
      price === undefined ||
      !category ||
      !brand ||
      stock === undefined ||
      !image
    ) {
      return res.status(400).json({
        status: "fail",
        message:
          "Please provide all required fields: name, description, price, category, brand, stock, image",
      });
    }

    // Validate numeric fields
    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock, 10);

    if (Number.isNaN(priceNum) || priceNum < 0) {
      return res.status(400).json({
        status: "fail",
        message: "Price must be a valid positive number",
      });
    }

    if (Number.isNaN(stockNum) || stockNum < 0) {
      return res.status(400).json({
        status: "fail",
        message: "Stock must be a valid positive number",
      });
    }

    // Prevent duplicate product by name (case-insensitive)
    const existingProduct = await Product.findOne({
      name: { $regex: `^${name.trim()}$`, $options: "i" },
    });

    if (existingProduct) {
      return res.status(400).json({
        status: "fail",
        message: "Product with this name already exists",
      });
    }

    const newProduct = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: priceNum,
      category: category.trim(),
      brand: brand.trim(),
      stock: stockNum,
      image: image.trim(),
    });

    return res.status(201).json({
      status: "success",
      message: "Product created successfully",
      data: newProduct,
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
    const id = req.params.id;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid product ID format",
      });
    }

    // Whitelist allowed fields
    const allowedFields = [
      "name",
      "description",
      "price",
      "category",
      "brand",
      "stock",
      "image",
    ];
    const updateData = {};

    Object.keys(req.body || {}).forEach((key) => {
      if (allowedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    // Validate and convert numeric fields
    if (updateData.price !== undefined) {
      const priceNum = parseFloat(updateData.price);
      if (Number.isNaN(priceNum) || priceNum < 0) {
        return res.status(400).json({
          status: "fail",
          message: "Price must be a valid positive number",
        });
      }
      updateData.price = priceNum;
    }

    if (updateData.stock !== undefined) {
      const stockNum = parseInt(updateData.stock, 10);
      if (Number.isNaN(stockNum) || stockNum < 0) {
        return res.status(400).json({
          status: "fail",
          message: "Stock must be a valid positive number",
        });
      }
      updateData.stock = stockNum;
    }

    // Trim string fields
    ["name", "description", "category", "brand", "image"].forEach((field) => {
      if (updateData[field]) {
        updateData[field] = updateData[field].trim();
      }
    });

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "No valid fields to update",
      });
    }

    const updated = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

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
    const id = req.params.id;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid product ID format",
      });
    }

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
      data: deleted,
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
