import Product from "../models/product.model.js";
import ProductDetails from "../models/productDetails.model.js";

const productDetailService = {
    createProductDetail: async (data) => {
        try {
            const product = await Product.findById(data.product);
            if (!product) {
                throw new Error('Sản phẩm không tồn tại');
            }
            const productDetail = await ProductDetails.create(data);
            return productDetail;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    getProductDetail: async (product) => {
        try {
            const productDetail = await ProductDetails.findOne({ product });
            return productDetail;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    updateProductDetail: async (productId, data) => {
        try {
            const productDetail = await ProductDetails.findByIdAndUpdate(
                productId,
                data,
                { new: true }
            );
            return productDetail;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    deleteProductDetail: async (productId) => {
        try {
            await ProductDetails.findByIdAndDelete(productId);
            return true;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default productDetailService;