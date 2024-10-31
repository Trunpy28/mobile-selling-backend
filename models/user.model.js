import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        default: '',
    },
    phoneNumber: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    avatarUrl: {
        type: String
    },
    role: {
        type: String,
        default: 'User',
        enum: ["User", "Admin"]
    }
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

export default User;