import mongoose from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true,
        unique: true
    },

    email: { 
        type: String,
        required: true,
        unique: true
    },

    password: { 
        type: String, 
        required: true 
    },

    refreshToken: {
        type: String
    }


}, {timestamps:true});


adminSchema.pre('save', async function(next) {
    try {
        if (!this.isModified('password')) {
        return next();
        }

        const hashedPassword = await bcrypt.hash(this.password, 10);

        if (!hashedPassword) {
        throw new Error('bcrypt.hash() returned undefined');
        }

        this.password = hashedPassword;

        next();
    } catch (error) {
        console.error('Error during password hashing:', error);
        next(error);
    }
});
  
  
  
adminSchema.methods.checkPassword = async function(inputPassword){
    const match = await bcrypt.compare(inputPassword, this.password);
    return match;
}



export const Admin = mongoose.model("Admin", adminSchema);