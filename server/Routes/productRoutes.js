import express from "express";
import * as ProductController from "../Controller/productController.js";
import { Protected, restrictTo } from "../Middleware/Protected.js";

//This Way is destructured, we can also do it.
// const {getAllTours,getToursById,createTours,updateTours,deleteTours} = require('../controllers/toursController');
const router = express.Router(); //MiddleWare router

router
  .route("/")
  .get(ProductController.getAllProduct)
  .post(Protected,restrictTo("admin"),ProductController.createProduct);
router
  .route("/:id")
  .get(Protected,ProductController.getProductById)
  .put(Protected,restrictTo("admin"),ProductController.updateProduct)
  .patch(Protected,restrictTo("admin"),ProductController.updateProduct)
  .delete(Protected,restrictTo("admin"),ProductController.deleteProduct);

export default router;
