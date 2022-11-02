const _ = require('lodash');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
  // check for all fields
  const { photo, url } = req.body;
  const name = "POSTED ITEM",
      description = url,
      price = parseInt(Math.random() * 50 + 10),
      category = "6352f9ab3d86780016e64044",
      quantity = 50,
      shipping = false;


    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity
    ) {
      return res.status(400).json({
        error: 'All fields are required',
      });
    }

    let product = new Product({ name, description, price, category, quantity, shipping, photo });

    // 1kb = 1000
    // 1mb = 1000000

    // if (photo) {
    //   // console.log("FILES PHOTO: ", files.photo);
    //   if (photo.length > 1000000) {
    //     return res.status(400).json({
    //       error: 'Image should be less than 1mb in size',
    //     });
    //   }
    //   product.photo.data = photo;
    //   product.photo.contentType = 'image/png';
    // }

    product.save((err, result) => {
      if (err) {
        console.log('PRODUCT CREATE ERROR ', err);
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(result);
    });
  };