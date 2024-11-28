import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ],
    customerInformation: {
        name: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        address: {
            city: {
                type: String,
                required: true
            },
            district: {
                type: String,
                required: true
            },
            ward: {
                type: String,
                required: true
            },
            detailedAddress: {
                type: String,
                required: true
            }
        },
    },
    totalPrice: {
        type: Number,
        required: true
    },
}, {
    timestamps: true,
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;