const User = require('../users/model');
const jwt = require('jsonwebtoken');
const config= require('../../settings/config');
const {promisify} = require('util');

//create and login users
exports.register = async (req, res)=> {
    try{
        var newUser = new User(req.body)
        newUser.created = new Date()
        newUser.modified = new Date()
        const user = await newUser.save();

        
        const token = signToken(user);
        const returnNewUser ={
            firstName:user.firstName,
            lastName:user.lastName,
            email:user.email,
            role:user.role,
        }
        res.status(201).json({status:'success', user:returnNewUser,token})
        }catch(e){
            res.status(404).json({status:'fail',message:'error:0'+e})
        }
}


exports.login = async (req, res) => {
    let { email, password } = req.body;
    if (!email || !password) {
        return res.status(404).json({ status: 'error', message: 'Please provide email and password' });
    }
    try {
        const userExists = await User.findOne({ email: email });
        if (!userExists || !userExists.authenticate(password)) {
            return res.status(404).json({ status: 'error', message: 'Invalid email or password' });
        }
        
        const token = signToken(userExists); 
        const returnUser = {
            firstName:userExists.firstName,
            lastName:userExists.lastName,
            email:userExists.email,
            role:userExists.role,
        }
        res.status(200).json({ status: 'success', user: returnUser, token }); 
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }

}
const signToken = (user) => {
    return jwt.sign({id: user.id,email: user.email},config.secrets.jwt,{expiresIn:config.expireTime});
}

exports.protect = async (req, res, next) => {
    let token = '';
    if (!req.headers.authorization) {
        return res.status(401).json({ status: 'fail', message: 'You are not logged in' });
    }
    let arrAuth = req.headers.authorization.split(' ');
    if (arrAuth[0] === 'Bearer' && arrAuth[1]) {
        token = arrAuth[1];
    }

    if (!token) {
        return res.status(401).json({ status: 'fail', message: 'You are not logged in' });
    }

    try {
        const verify = promisify(jwt.verify);
        const decoded = await verify(token, config.secrets.jwt);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ status: 'fail', message: 'User not found' });
        }

        console.log('Authenticated user:', user); // Log para verificar el usuario autenticado
        req.user = user; // Establecer req.user con el usuario autenticado
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ status: 'fail', message: 'Invalid token' });
    }
};


exports.isOwner = async (req, res, next) => {
    if (req.user && req.user.permission && req.user.permission === 'owner') {
        next()
        
    } else {
        res.status(401).json({status:'Fail',message:'You are not authorized to perform this action'})
   
    }
}

exports.isAdmin = async (req, res, next) => {
    console.log('Checking admin permissions for user:', req.user);  // Log para verificar permisos de administrador
    if (req.user && req.user.permission && req.user.permission === 'admin') {
        next();
    } else {
        res.status(401).json({status:'Fail',message:'You are not authorized to perform this action'});
    }
}
;
exports.isOwnerOrAdmin = async (req, res, next) => {
    if (req.user && (req.user.permission === 'admin' || req.user.permission === 'owner')) {
        next()
        
    } else {
        res.status(401).json({status:'Fail',message:'You are not authorized to perform this action'})
   
    }
}