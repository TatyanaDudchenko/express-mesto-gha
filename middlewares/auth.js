const jwt = require('jsonwebtoken');

const JWT_SECRET = 'themostclassifiedsecretsecret';

const getToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });

const isAuthtorized = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(401).send({ message: 'Необходима авторизация' });
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = await jwt.verify(token, JWT_SECRET);
  } catch (err) {
    res.status(401).send({ message: 'Необходима авторизация' });
    return;
  }

  req.user = payload;

  next();
};

module.exports = {
  getToken,
  isAuthtorized,
};

// const isAuthtorized = async (token) => {
//   try {
//     const decoded = await jwt.verify(token, JWT_SECRET);
//     return !!decoded;
//   } catch (err) {
//     return false;
//   }
// };
