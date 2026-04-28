const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users } = require('../models/usersModel');

const JWT_SECRET = process.env.JWT_SECRET || 'simple-secret-key';

function registerUser(name, email, password) {
  const existing = users.find((user) => user.email === email);
  if (existing) {
    throw new Error('Email already registered');
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password: bcrypt.hashSync(password, 10),
  };

  users.push(newUser);
  return { id: newUser.id, name: newUser.name, email: newUser.email };
}

function loginUser(email, password) {
  const user = users.find((item) => item.email === email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: '1h',
  });

  return token;
}

module.exports = { registerUser, loginUser, JWT_SECRET };
