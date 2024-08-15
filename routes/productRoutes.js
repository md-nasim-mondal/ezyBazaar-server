import express from 'express';
import { getProducts, insertProducts } from '../controllers/productController.js';

const router = express.Router();

router.get('/products', getProducts);
router.post('/products', insertProducts);

export default router;
