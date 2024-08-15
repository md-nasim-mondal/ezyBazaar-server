import { getDB } from '../config/db.js';
import { createProduct } from '../models/product.js';

export const getProducts = async (req, res) => {
  const db = getDB();
  const { page = 1, limit = 10, search, category, brand, priceSort, dateSort } = req.query;
  const query = {};

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  if (category) {
    query.category = category;
  }

  if (brand) {
    const brandNames = brand.split(',');
    query.brandName = { $in: brandNames };
  }

  const sort = {};
  if (priceSort) {
    sort.price = priceSort === 'asc' ? 1 : -1;
  }

  if (dateSort) {
    sort.createdAt = dateSort === 'asc' ? 1 : -1;
  }

  const options = {
    skip: (page - 1) * limit,
    limit: parseInt(limit),
    sort,
  };

  try {
    const products = await db.collection('products').find(query, options).toArray();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const insertProducts = async (req, res) => {
  const db = getDB();
  const products = Array.from({ length: 40 }).map((_, i) => createProduct({
    name: `Product ${i + 1}`,
    image: `https://via.placeholder.com/150`,
    description: `Description for Product ${i + 1}`,
    price: Math.floor(Math.random() * 100) + 1,
    category: i % 2 === 0 ? 'Electronics' : 'Clothing',
    brandName: i % 2 === 0 ? 'Brand A' : 'Brand B',
    ratings: Math.floor(Math.random() * 5) + 1,
  }));

  try {
    await db.collection('products').insertMany(products);
    res.json({ message: 'Products inserted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
