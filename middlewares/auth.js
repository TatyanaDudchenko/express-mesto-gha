const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/authorization-err');

const JWT_SECRET = 'themostclassifiedsecretsecret';

const getToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });

const isAuthtorized = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthorizationError('Необходима авторизация')); // 401
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = await jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new AuthorizationError('Необходима авторизация')); // 401
    return;
  }

  req.user = payload;

  next();
};

module.exports = {
  getToken,
  isAuthtorized,
};
