const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");
const checkAuth = require('../middleware/check-auth')
const OrdersController = require('../controllers/order')

// Handle incoming GET request to /orders
router.get("/", checkAuth, OrdersController.orders_get_all );


router.post("/", checkAuth, OrdersController.orders_create_order);

router.get("/:orderId", checkAuth, );

router.delete("/:orderId", checkAuth, (req, res, next) => {
  Order.remove({ _id: req.params.orderId})
  .exec()
  .then(result => {
    res.status(200).json({
      message: 'Order deleted',
      request: {
        type: 'POST',
        url: 'http://localhost:3000/orders',
        body: {
          productId: 'ID',
          quantity: 'Number'
        }
      }
    })
  })
  .catch(err => {
    res.status(500).json({
      error: err
    })
  });
});

module.exports = router;
