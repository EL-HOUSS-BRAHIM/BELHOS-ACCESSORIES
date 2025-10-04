const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const controllerPath = path.resolve(__dirname, '../src/controllers/reservationController.js');
const productModulePath = path.resolve(__dirname, '../src/models/Product.js');
const reservationModulePath = path.resolve(__dirname, '../src/models/Reservation.js');

function createResponseRecorder() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };
}

function loadControllerWithStubs({ productOverrides = {}, reservationOverrides = {} } = {}) {
  delete require.cache[controllerPath];
  delete require.cache[productModulePath];
  delete require.cache[reservationModulePath];

  const productStub = {
    findByIdCalls: 0,
    updateStockCalls: 0,
    async findById(id) {
      this.findByIdCalls += 1;
      return { id, stock: 10 };
    },
    async updateStock(id, delta) {
      this.updateStockCalls += 1;
      this.updateStockArgs = { id, delta };
      return { id, stock: 10 + delta };
    },
    ...productOverrides
  };

  const reservationStub = {
    createCalls: 0,
    findByIdCalls: 0,
    async create(data) {
      this.createCalls += 1;
      this.createArgs = data;
      return { id: 'reservation-1', ...data };
    },
    async findById(id) {
      this.findByIdCalls += 1;
      return { id };
    },
    ...reservationOverrides
  };

  require.cache[productModulePath] = {
    id: productModulePath,
    filename: productModulePath,
    loaded: true,
    exports: productStub
  };

  require.cache[reservationModulePath] = {
    id: reservationModulePath,
    filename: reservationModulePath,
    loaded: true,
    exports: reservationStub
  };

  const controller = require(controllerPath);

  return { controller, productStub, reservationStub };
}

function cleanupModuleCache() {
  delete require.cache[controllerPath];
  delete require.cache[productModulePath];
  delete require.cache[reservationModulePath];
}

test('createReservation rejects non-positive or non-numeric quantities', async (t) => {
  const { controller, productStub, reservationStub } = loadControllerWithStubs();
  t.after(cleanupModuleCache);

  const invalidQuantities = [0, -1, 'abc', null, undefined];

  for (const quantity of invalidQuantities) {
    const req = {
      body: { productId: 'product-1', quantity },
      user: { id: 'user-1' }
    };
    const res = createResponseRecorder();

    await controller.createReservation(req, res);

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, { error: 'Invalid quantity' });
  }

  assert.equal(productStub.findByIdCalls, 0);
  assert.equal(productStub.updateStockCalls, 0);
  assert.equal(reservationStub.createCalls, 0);
});

test('createReservation uses validated quantity for reservation and stock update', async (t) => {
  const { controller, productStub, reservationStub } = loadControllerWithStubs({
    async findById(id) {
      this.findByIdCalls += 1;
      return { id, stock: 5 };
    }
  }, {
    async findById(id) {
      this.findByIdCalls += 1;
      return { id, product: { id: 'product-1' } };
    }
  });
  t.after(cleanupModuleCache);

  const req = {
    body: { productId: 'product-1', quantity: '2' },
    user: { id: 'user-1' }
  };
  const res = createResponseRecorder();

  await controller.createReservation(req, res);

  assert.equal(res.statusCode, 201);
  assert.equal(productStub.findByIdCalls, 1);
  assert.equal(reservationStub.createCalls, 1);
  assert.equal(productStub.updateStockCalls, 1);
  assert.equal(reservationStub.findByIdCalls, 1);
  assert.equal(reservationStub.createArgs.quantity, 2);
  assert.deepEqual(productStub.updateStockArgs, { id: 'product-1', delta: -2 });
});
