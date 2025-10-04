const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const configPath = path.resolve(__dirname, '../src/config/firebase.js');
const productPath = path.resolve(__dirname, '../src/models/Product.js');

function loadProductWithDb({ initialStock = 5 } = {}) {
  delete require.cache[configPath];
  delete require.cache[productPath];

  const fakeProductRef = {
    initialStock,
    updates: [],
    async get() {
      return {
        exists: true,
        data: () => ({ stock: this.initialStock })
      };
    },
    async update(data) {
      this.updates.push(data);
      this.initialStock = data.stock;
    }
  };

  const fakeDb = {
    collection(name) {
      assert.equal(name, 'products');
      return {
        doc(id) {
          fakeProductRef.id = id;
          return fakeProductRef;
        }
      };
    }
  };

  require.cache[configPath] = {
    id: configPath,
    filename: configPath,
    loaded: true,
    exports: { db: fakeDb, auth: {}, admin: {} }
  };

  const Product = require(productPath);

  Product.findById = async id => ({ id, stock: fakeProductRef.initialStock });

  return { Product, fakeProductRef };
}

function cleanupProductModules() {
  delete require.cache[configPath];
  delete require.cache[productPath];
}

test('updateStock rejects non-finite or non-integer stock changes', async (t) => {
  const { Product } = loadProductWithDb();
  t.after(cleanupProductModules);

  await assert.rejects(Product.updateStock('p1', NaN), /Invalid stock change value/);
  await assert.rejects(Product.updateStock('p1', Infinity), /Invalid stock change value/);
  await assert.rejects(Product.updateStock('p1', 1.5), /Invalid stock change value/);
});

test('updateStock rejects non-integer stored stock levels', async (t) => {
  const { Product } = loadProductWithDb({ initialStock: 5.5 });
  t.after(cleanupProductModules);

  await assert.rejects(Product.updateStock('p1', 1), /Invalid product stock value/);
});

test('updateStock applies integer deltas and preserves integer stock', async (t) => {
  const { Product, fakeProductRef } = loadProductWithDb({ initialStock: 3 });
  t.after(cleanupProductModules);

  const result = await Product.updateStock('p1', 2);

  assert.equal(fakeProductRef.updates.length, 1);
  assert.equal(fakeProductRef.updates[0].stock, 5);
  assert.equal(fakeProductRef.updates[0].stock % 1, 0);
  assert.deepEqual(result, { id: 'p1', stock: 5 });
});
