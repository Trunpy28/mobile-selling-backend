import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    urlSlug: {
        type: String,
        required: true,
        unique: true
    },
    original_price: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    videoInfo: {
        type: String
    },
    imageUrl: {
        type: [String]
    },
    color: {
        type: String,
        required: true
    },
    countInStock: {
        type: Number,
        required: true
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;