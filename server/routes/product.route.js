const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const formidable = require('formidable');
const fs = require('fs');
const productById = require('../middleware/productById');

// @route   Get api/product/list
// @desc    Get a list of products  with filter
//  options(order = asc or desc, sortBy any product propert like name, limit, number of returned product)
// @access  Public
// lil explanation => sortBy ?(optional chaining) query :(else) _id (defauilt by id)
router.get('/list', async (req, res) => {
  let order = req.query.order ? req.query.order : 'asc';
  let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
  let limit = req.query.limit ? parseInt(req.query.limit) : 15;

  try {
    let products = await Product.find({})
      .select('-photo')
      .populate('category')
      .sort([[sortBy, order]])
      .limit(limit)
      .exec();

    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).send('Invalid querys');
  }
});

// @route   Get api/product/categories
// @desc    Get a list categories of products (list category has product inside)
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    let categories = await Product.distinct('category');
    if (!categories) {
      return res.status(400).json({
        error: 'Categories not found',
      });
    }
    res.json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});
// get all list and all categories has product must be place on the top
// get categories has product only show id of category

// @route   GET
// @Desc    Search product function
router.get('/search', async (req, res) => {
  // create query object to hold search value and category value
  const query = {};
  // assign search value to query.name
  if (req.query.search) {
    query.name = {
      $regex: req.query.search,
      $options: 'i',
    };
    // assigne category value to query.category
    if (req.query.category && req.query.category != 'All') {
      query.category = req.query.category;
    }
  }
  try {
    let products = await Product.find(query).select('-photo');
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error to get products');
  }
});

// @route   Post api/product/
// @desc    Create a Product
// @access  Private Admin
router.post('/', auth, adminAuth, (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Image could not be uploaded',
      });
    }

    if (!files.photo) {
      return res.status(400).json({
        error: 'Image is required',
      });
    }

    if (
      files.photo.type !== 'image/jpeg' &&
      files.photo.type !== 'image/jpg' &&
      files.photo.type !== 'image/png'
    ) {
      return res.status(400).json({
        error: 'Image type not allowed',
      });
    }

    // Check for all fields, maybe from mongo schema
    const { name, description, price, category, quantity, shipping } = fields;
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({
        error: 'All fields are required',
      });
    }

    let product = new Product(fields);
    // 1MB = 1000000
    if (files.photo.size > 1000000) {
      return res.status(400).json({
        error: 'Image should be less than 1MB in size',
      });
    }

    product.photo.data = fs.readFileSync(files.photo.path);
    product.photo.contentType = files.photo.type;

    try {
      await product.save();
      res.json('Product Created Successfully');
    } catch (error) {
      console.log(error);
      res.status(500).send('Server error');
    }
  });
});

// @route   Get api/product/productId
// @desc    Get a product info
// @access  Public
router.get('/:productId', productById, (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
});

// @route   Get api/photo/product/productId
// @desc    Get a product photo separately, to decrease duration of load data
// @access  Public
router.get('/photo/:productId', productById, (req, res) => {
  if (req.product.photo.data) {
    res.set('Content-Type', req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }

  res.status(400).json({
    error: 'Failed to load image',
  });
});

module.exports = router;
