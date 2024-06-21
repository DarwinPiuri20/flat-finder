const User = require('./model');
const sendEmail= require('../../services/email');

exports.getUserById = async (req, res) => {
    try{
        let id= req.params.id;
        const user = await User.findById({_id:id});
        res.status(200).json({status:'success',user:user});
    }catch(e){
        res.status(404).json({status:'fail',message:'error:0'+e});
    }
}




exports.getAllUsers = async (req, res) => {
    const filter = req.query.filter || {};

    const queryFilter = {};

    if (filter.role) {
        queryFilter.permission = {
            $eq: filter.role
        };
    }

    if (filter.flatCountMin) {
        queryFilter.flatCount = {
            ...queryFilter.flatCount,
            $gte: parseInt(filter.flatCountMin)
        };
    }
    if (filter.flatCountMax) {
        queryFilter.flatCount = {
            ...queryFilter.flatCount,
            $lte: parseInt(filter.flatCountMax)
        };
    }

    const orderBy = req.query.orderBy || 'firstname';
    const order = parseInt(req.query.order) || 1;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    try {
        const users = await User.aggregate([
            {
                $lookup: {
                    from: 'flats',
                    localField: '_id',
                    foreignField: 'ownerid',
                    as: 'flats'
                },
            },
            {
                $addFields: {
                    flatCount: { $size: '$flats' },
                }
            },
            {
                $match: queryFilter
            },
            {
                $sort: { [orderBy]: order }
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            }
        ]);

        res.status(200).json({ message: 'Users', data: users });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }

        // Verificar si el usuario autenticado es el propietario del perfil o tiene permisos de administrador
        if (user._id.toString() !== req.user._id.toString() && req.user.permission !== 'admin') {
            return res.status(401).json({ status: 'fail', message: 'You are not authorized to perform this action' });
        }

        // Actualizar el usuario
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
            new: true, // Devuelve el documento modificado
            runValidators: true // Ejecuta los validadores del esquema
        });

        res.status(200).json({ status: 'success', user: updatedUser });
    } catch (e) {
        res.status(500).json({ status: 'fail', message: 'error:0' + e });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }
        if (user._id.toString() !== req.user._id.toString() && req.user.permission !== 'admin') {
            return res.status(401).json({ status: 'fail', message: 'You are not authorized to perform this action' });
        }
        await user.deleteOne();
        res.status(200).json({ status: 'success', message: 'User deleted successfully' });
    } catch (e) {
        res.status(500).json({ status: 'fail', message: 'error:0' + e });
    }
}

exports.forgotPassword = async (req, res) => {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(404).json({ status: 'fail', message: 'User not found' });
    }
    const token =user.generatePasswordResetToken();
    user.save();

    await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        message: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/api/users/resetpassword/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    })

    res.status(200).json({ status: 'success', message: 'Password reset email sent' });
}

exports.resetPassword = async (req, res) => {
    const { token, password } = req.body;
    const user = await User.findOne({ passwordResetToken: token, passwordResetExpires: { $gt: Date.now() } });

    if (!user) {
        return res.status(400).json({ status: 'fail', message: 'Invalid or expired token' });
    }
    user.resetpassword(password);
    user.save();

    res.status(200).json({ status: 'success', message: 'Password reset successful' });

}

