const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const cors = require('cors');
const router = require('./routes/routes');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { errorHandler } = require('./errors/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT, MONGO_URL, NODE_ENV } = process.env;

const app = express();
app.use(cors({ origin: ['https://project-mesto.nomoredomainsmonster.ru'], credentials: true, maxAge: 120 }));
mongoose.connect(NODE_ENV !== 'production' ? 'mongodb://127.0.0.1:27017/mestodb' : MONGO_URL);

app.use(express.json());
app.use(cookieParser());
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use(requestLogger); // подключаем логгер запросов

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(
      /^https?:\/\/(?:www\.)?[a-zA-Z0-9-._~:/?#[\]@!$&`()*+,;=]+#?/,
    ),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.use(auth);
app.use('/', router);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());
app.use(errorHandler);

app.listen(NODE_ENV !== 'production' ? 3000 : PORT);
