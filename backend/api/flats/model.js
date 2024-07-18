const mongoose= require('mongoose');
const Schema= mongoose.Schema;

const FlatSchema= new Schema({

    city:{
        type:String,
        required:[true, 'Please provide city']
    },
    streetName:{
        type:String,
        required:[true,'Please provide Street Name']
    },
    streetNumber:{
        type:Number,
        required:[true,'Please provide Street Number']
    },
    areaSize:{
        type:Number,
        required:[true,'Please provide Area Size']
    },
    hasAc:{
        type:Boolean,
        default:false
        
    },
    yearBuilt:{
        type:Number,
        required:[true, 'Please provide Year Build']
    },
    rentPrice:{
        type:Number,
        required:[true, 'Please provide Rent Price']
    },
    dateAvailable:{
        type:Date,
        required:[true,'Please provide Date Available']
    },
    ownerId : {
          type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    created:{
        type: Date,
        default:Date.now
    },
    updated:{
        type: Date,
        default:Date.now
    },
    messages:[{type: mongoose.Schema.Types.ObjectId, ref: 'message'}]
})

module.exports = mongoose.model('Flat',FlatSchema)