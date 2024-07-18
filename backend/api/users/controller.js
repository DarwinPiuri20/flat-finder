
const User = require('./model');
exports.updateUser = async (req, res) => {
    try {
        let userId = req.params.id;
        if( userId == 0) {
            userId= req.user._id
        }
        console.log('user id ',userId)
        const user = await User.findByIdAndUpdate(userId, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }
        res.status(200).json({ status: 'success', data: user });
    }catch (error) {
        res.status(500).json({ status: 'fail', message: 'Server error: ' + error.message });
    }
};
exports.deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }
        res.status(200).json({ status: 'success', message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: 'Server error: ' + error.message });
    }
}

exports.getUserById = async (req, res) => {
    try{
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }
        res.status(200).json({ status: 'success', data: user });
    }catch (error) {
        res.status(500).json({ status: 'fail', message: 'Server error: ' + error.message });
    }
}


exports.getCurrentUser = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ status: 'fail', message: 'User not authenticated' });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }

        res.status(200).json({ status: 'success', data: user });
    } catch (e) {
        res.status(500).json({ status: 'fail', message: 'Server error: ' + e.message });
    }
};
exports.getAllUsers = async (req, res) => {
    const filter = req.query.filter || {};
    
    const queryFilter = {}
    
    if (filter.role){
        queryFilter.role= {
            $eq: filter.role

        }
    }
    
    if(filter.firstName ){
        queryFilter.firstName= {
            $regex: filter.firstName,
            $options: 'i'
        }
    }
    if(filter.flatsCounter){
        const arrayCounter = filter.flatsCounter.split('-');
        filter.flatCountMin = arrayCounter[0];
        filter.flatCountMax = arrayCounter[1];

    }
    
    if (filter.flatCountMin){
        queryFilter.flatCount= {
            $gte: parseInt(filter.flatCountMin)
        }
    }
    if (filter.flatCountMax){
        queryFilter.flatCount= {
            $lte: parseInt(filter.flatCountMax)
        }
    }
    
    if (filter.flatCountMin && filter.flatCountMax){
        queryFilter.flatCount= {
            $gte: parseInt(filter.flatCountMin),
            $lte: parseInt(filter.flatCountMax)
        }
    }
    if(filter.age){
        queryFilter.age= {
            $lte: parseInt(filter.age)
        }
    }
    console.log(queryFilter)
    
    const orderBy = req.query.orderBy || 'firstName';
    const order = parseInt(req.query.order) || 1;
    
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const skip = (page - 1) * limit;
    
    const users = await User.aggregate([
        { $lookup:
                {
                    from: 'flats',
                    localField: '_id',
                    foreignField: 'ownerId',
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
            $skip: skip
        },
        {
            $limit: limit
        },
        {$sort: { [orderBy]: order }}
        
    ]);
    

    res.status(200).json({message: 'Users', data: users});
}

exports.forgotPassword = async (req, res) => {
    
}
exports.resetPassword = async (req, res) => {
    
}