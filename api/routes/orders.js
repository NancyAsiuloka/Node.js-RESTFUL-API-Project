const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order')

// Handle incoming GET request to /orders
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Orders were fetched'
    })
});

router.post('/', (req, res, next) => {
    const order = new Order();

    res.status(201).json({
        message: 'Orders was created',
        order: order
    })
});

router.get('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order details',
        orderId: req.params.orderId
    })
});

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order deleted',
        orderId: req.params.orderId
    })
});

module.exports = router;

