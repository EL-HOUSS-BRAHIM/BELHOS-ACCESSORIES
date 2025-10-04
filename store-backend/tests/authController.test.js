const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const controllerPath = path.resolve(__dirname, '../src/controllers/authController.js');
const userModelPath = path.resolve(__dirname, '../src/models/User.js');

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

function loadRegisterWithUserStub(userOverrides = {}) {
  delete require.cache[controllerPath];
  delete require.cache[userModelPath];

  const userStub = {
    findByEmailCalls: 0,
    createCalls: 0,
    async findByEmail(email) {
      this.findByEmailCalls += 1;
      this.findByEmailArgs = email;
      return null;
    },
    async create(data) {
      this.createCalls += 1;
      this.createArgs = data;
      return { id: 'user-1', ...data };
    },
    ...userOverrides
  };

  require.cache[userModelPath] = {
    id: userModelPath,
    filename: userModelPath,
    loaded: true,
    exports: userStub
  };

  const controller = require(controllerPath);

  return { register: controller.register, userStub };
}

function cleanupModuleCache() {
  delete require.cache[controllerPath];
  delete require.cache[userModelPath];
}

test('register creates a new user with forced USER role', async (t) => {
  const { register, userStub } = loadRegisterWithUserStub();
  t.after(cleanupModuleCache);

  const req = {
    body: {
      name: 'Alice',
      email: 'alice@example.com',
      password: 'password123'
    }
  };
  const res = createResponseRecorder();

  await register(req, res);

  assert.equal(res.statusCode, 201);
  assert.equal(userStub.findByEmailCalls, 1);
  assert.equal(userStub.createCalls, 1);
  assert.equal(userStub.createArgs.role, 'USER');
  assert.equal(res.body.user.role, 'USER');
});

test('register rejects attempts to set elevated roles', async (t) => {
  const { register, userStub } = loadRegisterWithUserStub();
  t.after(cleanupModuleCache);

  const req = {
    body: {
      name: 'Mallory',
      email: 'mallory@example.com',
      password: 'password123',
      role: 'ADMIN'
    }
  };
  const res = createResponseRecorder();

  await register(req, res);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, {
    error: 'Role cannot be set during public registration'
  });
  assert.equal(userStub.findByEmailCalls, 0);
  assert.equal(userStub.createCalls, 0);
});
