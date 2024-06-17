const User = require('./model');

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
