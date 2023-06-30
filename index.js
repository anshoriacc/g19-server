require('dotenv').config();
require('pg');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { sequelize } = require('./src/config');
const router = require('./src/routes');
const { responseMiddleware } = require('./src/middlewares');

const corsOptions = {
  origin: '*',
  allowedHeaders: ['Content-Type'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
};

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));
app.use(responseMiddleware);
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms')
);
app.use('/api', router);

app.get('/', (_, res) => {
  return res.json({ message: 'g19 api', timestamp: new Date().toString() });
});

sequelize
  .sync()
  .then(() =>
    app.listen(8080, () => {
      console.log('Server running on port 8080');
    })
  )
  .catch((err) => console.log(err));
