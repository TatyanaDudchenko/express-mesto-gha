const express = require('express');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const { routes } = require('./routes/app');

const app = express();

const { login, createUser } = require('./controllers/users');

app.post('/signin', express.json(), login);
app.post('/signup', express.json(), createUser);

app.use((req, res, next) => {
  req.user = {
    _id: '6271547adc67df7bad285983',
  };

  next();
});

app.use(routes);

app.use((req, res, next) => {
  console.log(req.method, req.url);
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
