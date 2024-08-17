import { getDB } from "../config/db.js";

// Get Products with filtering, sorting, and pagination
export const getProducts = async (req, res) => {
  const db = getDB();
  const {
    page = 1,
    size = 12,
    search,
    category,
    brand,
    minPrice,
    maxPrice,
    sort,
  } = req.query;

  const query = {};

  // Search by product name
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  // Filter by category
  if (category) {
    query.category = category;
  }

  // Filter by brand
  if (brand) {
    const brandNames = brand.split(",");
    query.brand = { $in: brandNames };
  }

  // Filter by price range
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }

  // Sorting criteria
  const sortCriteria = {};
  switch (sort) {
    case "price_asc":
      sortCriteria.price = 1;
      break;
    case "price_desc":
      sortCriteria.price = -1;
      break;
    case "date_asc":
      sortCriteria.creation_time = 1;
      break;
    case "date_desc":
      sortCriteria.creation_time = -1;
      break;
    default:
      break;
  }

  const options = {
    skip: (page - 1) * size,
    limit: parseInt(size),
    sort: sortCriteria,
  };

  try {
    const products = await db
      .collection("products")
      .find(query, options)
      .toArray();
    const productCount = await db.collection("products").countDocuments(query);
    const totalPages = Math.ceil(productCount / size);

    res.json({
      productCount,
      totalPages,
      products,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Insert Products (for development/testing purposes)
export const insertProducts = async (req, res) => {
  const db = getDB();
  const products = Array.from({ length: 40 }).map((_, i) =>
    createProduct({
      name: `Product ${i + 1}`,
      image: `https://via.placeholder.com/150`,
      description: `Description for Product ${i + 1}`,
      price: Math.floor(Math.random() * 100) + 1,
      category: i % 2 === 0 ? "Electronics" : "Clothing",
      brand: i % 2 === 0 ? "Brand A" : "Brand B",
      ratings: Math.floor(Math.random() * 5) + 1,
    })
  );

  try {
    await db.collection("products").insertMany(products);
    res.json({ message: "Products inserted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all unique categories
export const getAllCategories = async (req, res) => {
  const db = getDB();

  try {
    const categories = await db.collection("products").distinct("category");
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// Get all unique brands
export const getAllBrands = async (req, res) => {
  const db = getDB();

  try {
    const brands = await db.collection("products").distinct("brand");
    res.status(200).json({ brands });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch brands" });
  }
};
