const User = require('../users/model');
const jwt = require('jsonwebtoken');
const config = require('../../settings/config');
const { promisify } = require('util');


const handleError = (res, message, status = 500) => {
    res.status(status).json({ status: 'fail', message });
};


const signToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, config.secrets.jwt, { expiresIn: config.expireTime });
};


exports.register = async (req, res) => {
    try {
        const newUser = new User({
            ...req.body,
            created: new Date(),
            modified: new Date()
        });
        const user = await newUser.save();
        const token = signToken(user);
        const returnNewUser = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        };
        res.status(201).json({ status: 'success', user: returnNewUser, token });
    } catch (error) {
        handleError(res, `Error registering user: ${error.message}`, 400);
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return handleError(res, 'Please provide email and password', 400);
    }

    try {
        const user = await User.findOne({ email });
        if (!user || !user.authenticate(password)) {
            return handleError(res, 'Invalid email or password', 401);
        }
        
        const token = signToken(user);
        const returnUser = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        };
        res.status(200).json({ status: 'success', user: returnUser, token });
    } catch (error) {
        handleError(res, 'Internal server error', 500);
    }
};

exports.protect = async (req, res, next) => {
    let token = '';
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return handleError(res, 'You are not logged in', 401);
    }

    try {
        const decoded = await promisify(jwt.verify)(token, config.secrets.jwt);
        const user = await User.findById(decoded.id);
        if (!user) {
            return handleError(res, 'User not found', 401);
        }

        req.user = user;
        next();
    } catch (error) {
        handleError(res, 'Invalid token', 401);
    }
};


exports.isOwner = (req, res, next) => {
    if (req.user && req.user.permission === 'owner') {
        return next();
    }
    handleError(res, 'You are not authorized to perform this action', 403);
};


exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.permission === 'admin') {
        return next();
    }
    handleError(res, 'You are not authorized to perform this action', 403);
};


exports.isOwnerOrAdmin = (req, res, next) => {
    if (req.user && (req.user.permission === 'admin' || req.user.permission === 'owner')) {
        return next();
    }
    handleError(res, 'You are not authorized to perform this action', 403);
};
