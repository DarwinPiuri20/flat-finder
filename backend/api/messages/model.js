const mongoose= require('mongoose');
const Schema= mongoose.Schema;


const MessageSchema= new Schema({
    content:{
        type:String,
        required:[true, 'Please provide content']
    },
    FlatId:{
        type:Schema.Types.ObjectId,
        ref:'Flat',
        required:true
    },
    SenderId:{
        type:Schema.Types.ObjectId,
        ref:'users',
        required:true },
        created:Date
});

module.exports= mongoose.model('Message',MessageSchema)