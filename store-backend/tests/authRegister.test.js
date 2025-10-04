const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const express = require('express');
const http = require('node:http');

const controllerPath = path.resolve(__dirname, '../src/controllers/authController.js');
const userPath = path.resolve(__dirname, '../src/models/User.js');
const bcryptPath = require.resolve('bcrypt', { paths: [path.resolve(__dirname, '../')] });

function cleanupModules() {
  delete require.cache[controllerPath];
  delete require.cache[userPath];
  delete require.cache[bcryptPath];
}

function setupRegisterController({ existingUser = null } = {}) {
  cleanupModules();

  const createCalls = [];

  require.cache[userPath] = {
    id: userPath,
    filename: userPath,
    loaded: true,
    exports: {
      async findByEmail(email) {
        return existingUser;
      },
      async create(data) {
        createCalls.push(data);
        return { id: 'user-123', ...data };
      }
    }
  };

  require.cache[bcryptPath] = {
    id: bcryptPath,
    filename: bcryptPath,
    loaded: true,
    exports: {
      async hash() {
        return 'hashed-password';
      },
      async compare() {
        return true;
      }
    }
  };

  const { register } = require(controllerPath);

  return { register, createCalls };
}

async function sendRegisterRequest(register, body) {
  const app = express();
  app.use(express.json());
  app.post('/api/auth/register', register);

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));

  try {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    return {
      status: response.status,
      body: await response.json()
    };
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test('register succeeds with default USER role', async (t) => {
  const { register, createCalls } = setupRegisterController();
  t.after(cleanupModules);

  const response = await sendRegisterRequest(register, {
    name: 'Test User',
    email: 'user@example.com',
    password: 'password123'
  });

  assert.equal(response.status, 201);
  assert.equal(response.body.message, 'User created successfully');
  assert.equal(response.body.user.role, 'USER');
  assert.equal(createCalls.length, 1);
  assert.equal(createCalls[0].role, 'USER');
});

test('register rejects attempts to override role', async (t) => {
  const { register, createCalls } = setupRegisterController();
  t.after(cleanupModules);

  const response = await sendRegisterRequest(register, {
    name: 'Admin Attempt',
    email: 'admin@example.com',
    password: 'password123',
    role: 'ADMIN'
  });

  assert.equal(response.status, 400);
  assert.deepEqual(response.body, {
    error: 'Role cannot be set during public registration'
  });
  assert.equal(createCalls.length, 0);
});
