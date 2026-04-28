const bcrypt = require('bcryptjs');

const users = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: bcrypt.hashSync('alice123', 10),
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    password: bcrypt.hashSync('bob123', 10),
  },
  {
    id: 3,
    name: 'Carol Davis',
    email: 'carol@example.com',
    password: bcrypt.hashSync('carol123', 10),
  },
];

module.exports = { users };
