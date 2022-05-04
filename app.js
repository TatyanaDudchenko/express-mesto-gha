const express = require('express');
const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const path = require('path');
const { routes } = require('./routes/app')

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use(routes);

// mongoose.connect('mongodb://localhost:27017/mestodb ', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

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

// app.listen(PORT, () => {
//   // Если всё работает, консоль покажет, какой порт приложение слушает
//   console.log(`Слушаем порт ${PORT}`);
// });

