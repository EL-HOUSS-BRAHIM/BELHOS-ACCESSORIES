const Product = require('../models/Product');

const parseBoolean = value => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();

    if (['true', '1', 'yes', 'on'].includes(normalized)) {
      return true;
    }

    if (['false', '0', 'no', 'off'].includes(normalized)) {
      return false;
    }

    if (normalized.length === 0) {
      return undefined;
    }
  }

  if (value === null || value === undefined) {
    return undefined;
  }

  throw new TypeError('Invalid boolean value');
};

const parseNullableString = value => {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  throw new TypeError('Invalid string value');
};

const parseNullableNumber = value => {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();

    if (trimmed.length === 0) {
      return null;
    }

    const parsed = Number.parseFloat(trimmed);
    if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
      return parsed;
    }
  }

  throw new TypeError('Invalid numeric value');
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
    const { name, description, price, imageUrl, category, stock, isHot, badge, salePrice } = req.body;

    const parsedPrice = price !== undefined ? Number.parseFloat(price) : undefined;
    if (parsedPrice !== undefined && Number.isNaN(parsedPrice)) {
      return res.status(400).json({ error: 'Invalid price value' });
    }

    const parsedStock = stock !== undefined ? Number.parseInt(stock, 10) : 0;
    if (Number.isNaN(parsedStock)) {
      return res.status(400).json({ error: 'Invalid stock value' });
    }

    let parsedIsHot;
    let parsedBadge;
    let parsedSalePrice;

    try {
      parsedIsHot = parseBoolean(isHot);
      parsedBadge = parseNullableString(badge);
      parsedSalePrice = parseNullableNumber(salePrice);
    } catch (parseError) {
      if (parseError instanceof TypeError) {
        return res.status(400).json({ error: parseError.message });
      }
      throw parseError;
    }

    const product = await Product.create({
      name,
      description,
      price: parsedPrice,
      imageUrl,
      category,
      stock: parsedStock,
      isHot: parsedIsHot ?? false,
      badge: parsedBadge ?? null,
      salePrice: parsedSalePrice ?? null
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
      const parsedPrice = Number.parseFloat(updateData.price);
      if (Number.isNaN(parsedPrice)) {
        return res.status(400).json({ error: 'Invalid price value' });
      }
      updateData.price = parsedPrice;
    }
    if (updateData.stock !== undefined) {
      const parsedStock = Number.parseInt(updateData.stock, 10);
      if (Number.isNaN(parsedStock)) {
        return res.status(400).json({ error: 'Invalid stock value' });
      }
      updateData.stock = parsedStock;
    }

    if (Object.prototype.hasOwnProperty.call(updateData, 'isHot')) {
      try {
        const parsedIsHot = parseBoolean(updateData.isHot);
        if (parsedIsHot === undefined) {
          return res.status(400).json({ error: 'Invalid boolean value' });
        }
        updateData.isHot = parsedIsHot;
      } catch (parseError) {
        if (parseError instanceof TypeError) {
          return res.status(400).json({ error: parseError.message });
        }
        throw parseError;
      }
    }

    if (Object.prototype.hasOwnProperty.call(updateData, 'badge')) {
      try {
        updateData.badge = parseNullableString(updateData.badge);
      } catch (parseError) {
        if (parseError instanceof TypeError) {
          return res.status(400).json({ error: parseError.message });
        }
        throw parseError;
      }
    }

    if (Object.prototype.hasOwnProperty.call(updateData, 'salePrice')) {
      try {
        updateData.salePrice = parseNullableNumber(updateData.salePrice);
      } catch (parseError) {
        if (parseError instanceof TypeError) {
          return res.status(400).json({ error: parseError.message });
        }
        throw parseError;
      }
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
