const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const User = require('../models/user');




exports.user_signup = async (req, res, next) => {
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
}

exports.user_login = async (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length < 1){
            return res.status(401).json({
                message: 'Auth failed'});
        }
        // compare passwords - is this correct?
        bcrypt.compare(req.body.password, user[0].password, (err, result) =>{
            if(err) {
                return res.status(401).json({
                    message: "Auth failed"
                })
            }
            if(result){
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                }, process.env.JWT_KEY,
                {
                    expiresIn: "1hr"
                }
                );
                return res.status(200).json({
                    message: 'Auth successful',
                    token: token
                })
            }
            res.status(401).json({
                message: 'Auth failed'
            })
        })

    })
    .catch (err => {
        console.error(err);
        res.status(500).json({
            error: err
        });
    })
}

exports.user_delete = async (req, res, next) => {
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
}