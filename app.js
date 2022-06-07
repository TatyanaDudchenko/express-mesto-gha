const express = require('express');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { routes } = require('./routes/app');

const app = express();

const { login, createUser } = require('./controllers/users');
const { validationsLogin, validationsCreateUser } = require('./middlewares/validations');

app.post('/signin', express.json(), validationsLogin, login);
app.post('/signup', express.json(), validationsCreateUser, createUser);

app.use(routes);

app.use(errors()); // обработчик ошибок celebrate

// здесь обрабатываем все ошибки
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.statusCode === 500 ? 'На сервере произошла ошибка' : err.message;
  res.status(statusCode).send({ message });
  next();
});

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb ', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  app.listen(PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    console.log(`Слушаем порт ${PORT}`);
  });
}

main();

//т.к. из зависимостей удален модуль prettier, автоформатирование кода не работает, даже при eslint
