require('dotenv').config();
require('pg');
const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/sequelize');
const morgan = require('morgan');
const router = require('./src/routes');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms')
);

app.get('/', (req, res) => res.json({ msg: 'g19 api' }));

app.use('/api', router);

app.listen(3001, async () => {
  console.log('Server running on port 3001');
  await sequelize.authenticate();
  console.log('Database Connected!');
});
