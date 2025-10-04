const Product = require('../models/Product');
const { isValidCategoryValue } = require('../constants/productCategories');

const normalizeCategoryInput = (value) => {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim().toLowerCase();
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, orderBy, order, limit } = req.query;
    
    const options = {};
    if (category) options.category = category;
    if (orderBy) {
      options.orderBy = orderBy;
      options.order = order || 'asc';
    }
    if (limit) options.limit = parseInt(limit);

    let products = await Product.findAll(options);
    
    // Apply price filtering after fetching (since Firebase doesn't support complex queries)
    if (minPrice || maxPrice) {
      products = products.filter(product => {
        if (minPrice && product.price < parseFloat(minPrice)) return false;
        if (maxPrice && product.price > parseFloat(maxPrice)) return false;
        return true;
      });
    }

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching products' });
  }
};

// Get single product
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching product' });
  }
};

// Create product (Admin only)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, imageUrl, category, stock } = req.body;

    const normalizedCategory = normalizeCategoryInput(category);

    if (normalizedCategory && !isValidCategoryValue(normalizedCategory)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const product = await Product.create({
      name,
      description,
      price: price !== undefined ? Number.parseFloat(price) : undefined,
      imageUrl,
      category: normalizedCategory || undefined,
      stock: stock !== undefined ? Number.parseInt(stock, 10) : 0
    });

    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error creating product' });
  }
};

// Update product (Admin only)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Parse numeric fields
    if (updateData.price !== undefined) {
      updateData.price = Number.parseFloat(updateData.price);
    }
    if (updateData.stock !== undefined) {
      updateData.stock = Number.parseInt(updateData.stock, 10);
    }

    if (Object.prototype.hasOwnProperty.call(updateData, 'category')) {
      const normalizedCategory = normalizeCategoryInput(updateData.category);

      if (normalizedCategory && !isValidCategoryValue(normalizedCategory)) {
        return res.status(400).json({ error: 'Invalid category' });
      }

      updateData.category = normalizedCategory;
    }

    const product = await Product.update(id, updateData);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product updated', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating product' });
  }
};

// Delete product (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const success = await Product.delete(id);

    if (!success) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error deleting product' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
