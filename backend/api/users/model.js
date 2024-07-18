const mongoose = require('mongoose');
const bcrypt= require('bcryptjs');
const{v4:uuidv4}= require('uuid');
const Schema= mongoose.Schema;
const UserSchema = new Schema({
    email:{
        type:String,
        unique:true,
        required:[true,'Please provide email'],
        lowercase: true
    },
    password:{
        type:String,
        required:[true, 'Please provide password'],
        minLength:6 
    },
    firstName:{
        type:String,
        required:[true, 'Please Provide Name']
    },
    lastName:{
        type:String,
        required:[true, 'Please Provide Lastname']
    },
    birthDate:{
        type:Date,
        required:[true, 'Please povide Birth Date']
    },
    role:{
        type:String,
        enum:['renter','owner','admin'],
        default:'renter'
    },
    favoriteFlats:[{
        type: Schema.Types.ObjectId,
            ref: 'Flat'
    }],
    created:Date,
    modified:Date,
    messages:[{type: Schema.Types.ObjectId, ref: 'messages'}],
    resetPasswordToken:String ,
    passwordChangedAt:Date,
    permission:{
        type:String,
        
    }
})
/// revisar como mandar el flat como objeto con toda la información
// Middleware para asignar automáticamente el valor de 'permission' basado en 'role'
UserSchema.pre('save', function(next) {
    if (!this.isModified('role')) return next();
  
    switch (this.role) {
      case 'admin':
        this.permission = 'admin';
        break;
      case 'renter':
        this.permission = 'renter';
        break;
      case 'owner':
        this.permission = 'owner';
        break;
      default:
        this.permission = 'renter';
    }
  
    next();
  });

UserSchema.pre('save',async function(next){
    if(!this.isModified('password')) {next()} ;

    const salt= await bcrypt.genSalt(10);
    const hash= await bcrypt.hash(this.password,salt);
    this.password=hash;
    next();
});

UserSchema.methods={
    authenticate: async function(password){
        return await bcrypt.compare(password,this.password)
    },
    
    tojson: function(){
        const user= this.toObject();
        delete user.password;
        return user;
    },
    generatePasswordResetToken: function(){
    this.resetPasswordToken= uuidv4();
    return this.resetPasswordToken
},
    resetPassword: function(password){
        this.password= password;
        this.resetPasswordToken= null;
        this.passwordChangedAt= Date.now();
        return this.save();
    },
    toJson: function(){
        const user= this.toObject();
        delete user.password;
        return user;
    }
}

module.exports= mongoose.model('User',UserSchema)