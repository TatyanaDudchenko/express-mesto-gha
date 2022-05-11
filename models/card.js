const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

// создаем схему
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: ObjectId,
    required: true,
  },
  likes: [
    {
      type: ObjectId,
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// создаём модель и экспортируем её
module.exports = mongoose.model("card", cardSchema);
