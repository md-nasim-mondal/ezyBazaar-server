import express from "express";
import {
  getAllBrands,
  getAllCategories,
  getProducts,
  insertProducts,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/products", getProducts);
router.post("/products", insertProducts);
router.get("/products/categories", getAllCategories);
router.get("/products/brands", getAllBrands);

export default router;
