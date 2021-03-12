const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
require('dotenv').config({
  path: './config/index.env',
});

const connectDB = require('./config/db');
connectDB();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// API end point route
app.use('/api/user/', require('./routes/auth.route')); // route auth register and login user
app.use('/api/category/', require('./routes/category.route')); // route for all category stuff
app.use('/api/product/', require('./routes/product.route')); // route for all product stuff

app.get('/', (req, res) => {
  res.send('test route =>> Homepage');
});

// if page not found
app.use((req, res) => {
  res.status(404).json({
    msg: 'Page not found',
  });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
