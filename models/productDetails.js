import mongoose from "mongoose";

const productDetailsSchema = new mongoose.Schema({
    specifications: {
        os: {
            type: String,
            default: ""
        },
        cpu: {
            type: String,
            default: ""
        },
        gpu: {
            type: String,
            default: ""
        },
        ram: {
            type: String,
            default: ""
        },
        storage: {
            type: String,
            default: ""
        }
    },
    camera_display: {
            back_camera: {
            type: String,
            default: ""
        },
        back_camera: {
            type: String,
            default: ""
        },
        display_tech: {
            type: String,
            default: ""
        },
        display_resolution: {
            type: String,
            default: ""
        },
        display_width: {
            type: String,
            default: ""
        },
        display_brightness: {
            type: String,
            default: ""
        }
    },
    pin_adapter: {
        pin_capacity: {
            type: String,
            default: ""
        },
        pin_type: {
            type: String,
            default: ""
        },
        max_adapter_power: {
            type: String,
            default: ""
        }
    },
    design_material: {
        design: {
            type: String,
            default: ""
        },
        material: {
            type: String,
            default: ""
        },
        size_weight: {
            type: String,
            default: ""
        },
        releaseDate: {
            type: String,
            default: ""
        }
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, {
    timestamps: true,
});

const ProductDetails = mongoose.model('ProductDetails', productDetailsSchema);

export default ProductDetails;