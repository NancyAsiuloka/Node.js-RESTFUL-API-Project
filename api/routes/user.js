const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt')

const User = require('../models/user');

router.post('/signup', async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            return res.status(409).json({
                message: 'Email already in use'
            });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hashedPassword,
        });

        const result = await user.save();

        console.log(`Created user with the following information:\n${result}`);
        res.status(201).json({
            message: 'User created'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message || 'Internal Server Error',
        });
    }
});

router.post('/login', async (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length < 1){
            return res.status(401).json({
                type: 'not-found',
                message: 'Email not found.'}).end();
        }
        // compare passwords - is this correct?
        bcrypt.compare(req.body.password, user[0].password, (err, res) =>{

        })

    })
    .catch (err => {
        console.error(err);
        res.status(500).json({
            error: err
        });
    })
})

router.delete('/:userId', async (req, res, next) => {
    try {
        const result = await User.deleteOne({ _id: req.params.userId }).exec();

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        console.log(result);
        res.status(200).json({
            message: 'User deleted'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message || 'Internal Server Error',
        });
    }
});


module.exports = router;
