const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const firebaseConfigPath = path.resolve(__dirname, '../src/config/firebase.js');
const productModelPath = path.resolve(__dirname, '../src/models/Product.js');
const controllerPath = path.resolve(__dirname, '../src/controllers/productController.js');

const clearModule = modulePath => {
  delete require.cache[modulePath];
};

const loadProductForCreate = () => {
  clearModule(firebaseConfigPath);
  clearModule(productModelPath);

  const storedRecords = [];

  const fakeCollection = {
    async add(data) {
      storedRecords.push({ ...data });
      return {
        id: 'new-product',
        async get() {
          const latest = storedRecords[storedRecords.length - 1] || {};
          return {
            id: 'new-product',
            data: () => ({ ...latest })
          };
        }
      };
    }
  };

  const fakeDb = {
    collection(name) {
      assert.equal(name, 'products');
      return fakeCollection;
    }
  };

  require.cache[firebaseConfigPath] = {
    id: firebaseConfigPath,
    filename: firebaseConfigPath,
    loaded: true,
    exports: { db: fakeDb, auth: {}, admin: {} }
  };

  const Product = require(productModelPath);

  return { Product, storedRecords };
};

const restoreProductModules = () => {
  clearModule(firebaseConfigPath);
  clearModule(productModelPath);
};

test('Product.create persists hero metadata and normalizes the response', async t => {
  const { Product, storedRecords } = loadProductForCreate();
  t.after(restoreProductModules);

  const product = await Product.create({
    name: 'Hero Product',
    description: 'Limited release',
    price: 120,
    imageUrl: 'https://example.com/hero.jpg',
    category: 'bags',
    stock: 7,
    isHot: true,
    highlighted: true,
    isNew: false,
    badge: '  Exclusive  ',
    badges: [' Atelier ', { label: ' Numérotée ' }, '', null],
    salePrice: 99,
    originalPrice: 140
  });

  assert.equal(storedRecords.length, 1);
  const stored = storedRecords[0];

  assert.equal(stored.isHot, true);
  assert.equal(stored.highlighted, true);
  assert.equal(stored.isNew, false);
  assert.equal(stored.badge, 'Exclusive');
  assert.deepEqual(stored.badges, ['Atelier', 'Numérotée']);
  assert.equal(stored.salePrice, 99);
  assert.equal(stored.originalPrice, 140);
  assert.equal(stored.stock, 7);
  assert.ok(stored.createdAt instanceof Date);
  assert.ok(stored.updatedAt instanceof Date);

  assert.equal(product.isHot, true);
  assert.equal(product.highlighted, true);
  assert.equal(product.isNew, false);
  assert.equal(product.badge, 'Exclusive');
  assert.deepEqual(product.badges, ['Atelier', 'Numérotée']);
  assert.equal(product.salePrice, 99);
  assert.equal(product.originalPrice, 140);
});

const restoreControllerModules = () => {
  clearModule(productModelPath);
  clearModule(controllerPath);
};

test('createProduct controller forwards hero metadata to the model', async t => {
  restoreControllerModules();

  const received = {};
  const fakeProductModule = {
    async create(payload) {
      Object.assign(received, payload);
      return { id: 'created-product', ...payload };
    }
  };

  require.cache[productModelPath] = {
    id: productModelPath,
    filename: productModelPath,
    loaded: true,
    exports: fakeProductModule
  };

  const { createProduct } = require(controllerPath);
  t.after(restoreControllerModules);

  const req = {
    body: {
      name: 'Controller Product',
      description: 'Front display',
      price: '150',
      imageUrl: 'https://example.com/controller.jpg',
      category: 'BAG',
      stock: '3',
      isHot: 'yes',
      highlighted: 'false',
      isNew: 'true',
      badge: '  Coup de coeur ',
      badges: '["Hero", " Hiver "]',
      salePrice: '129.99',
      originalPrice: '180'
    }
  };

  const responsePayload = {};
  const res = {
    statusCode: 0,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      Object.assign(responsePayload, payload);
    }
  };

  await createProduct(req, res);

  assert.equal(res.statusCode, 201);
  assert.equal(responsePayload.message, 'Product created');
  assert.equal(received.name, 'Controller Product');
  assert.equal(received.description, 'Front display');
  assert.equal(received.price, 150);
  assert.equal(received.imageUrl, 'https://example.com/controller.jpg');
  assert.equal(received.category, 'bag');
  assert.equal(received.stock, 3);
  assert.equal(received.isHot, true);
  assert.equal(received.highlighted, false);
  assert.equal(received.isNew, true);
  assert.equal(received.badge, 'Coup de coeur');
  assert.deepEqual(received.badges, ['Hero', 'Hiver']);
  assert.equal(received.salePrice, 129.99);
  assert.equal(received.originalPrice, 180);
});
