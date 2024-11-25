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

    getProductDetail: async (productId) => {
        try {
            const productDetail = await ProductDetails.findOne(productId);
            return productDetail;
        } catch (error) {
            throw new Error(error.message);
        }
    },
}

export default productDetailService;