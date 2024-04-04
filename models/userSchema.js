const mongoose = require('mongoose');
const JWT=require('jsonwebtoken');
const bcrypt=require('bcrypt')
const {Schema}=mongoose

// Define User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'username is required'],
        minLength:[5, 'name must be at least 5 char'],
        maxLength:[50, 'name must be less than 50 char']

    },
    email: {
        type: String,
        required: true,
        unique: true ,// Ensures email is unique
        lowercase:true,
        unique:[true, 'already registered']
    },
    password: {
        type: String,
        required: true
    },
    forgotPasswordToken: {
        type: String
    },
    passwordExpiryDate: {
        type: Date
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password= await bcrypt.hash(this.password, 10);
    return next()
})

userSchema.methods = {
    jwtToken() {
        return JWT.sign(
            { id: this._id, email: this.email },
            process.env.SECRET,
            { expiresIn: '24h' }
        );
    }
};

// Create Usermodel
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
