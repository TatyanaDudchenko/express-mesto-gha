const jwt = require('jsonwebtoken');

const JWT_SECRET = 'themostclassifiedsecretsecret';

const getToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });

module.exports = {
  getToken,
};
