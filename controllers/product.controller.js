import productService from "../services/product.service.js";

const productController = {
    createProduct: async (req, res) => {
        try {
            const newProduct = await productService.createProduct(req.body);
            res.status(201).json({
                success: true,
                message: 'Tạo sản phẩm thành công',
                product: newProduct
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    getProductBySlug: async (req, res) => {
        try {
            const product = await productService.getProductBySlug(req.params.slug);
            res.status(200).json({
                success: true,
                product
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    },

    getProductById: async (req, res) => {
        try {
            const product = await productService.getProductById(req.params.id);
            res.status(200).json({
                success: true,
                product
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    },

    getAllProducts: async (req, res) => {
        try {
            const products = await productService.getAllProducts();
            res.status(200).json({
                success: true,
                products
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    },

    updateProduct: async (req, res) => {
        try {
            const updatedProduct = await productService.updateProduct(req.params.id, req.body);
            res.status(200).json({
                success: true,
                message: 'Cập nhật sản phẩm thành công',
                product: updatedProduct
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    },

    deleteProduct: async (req, res) => {
        try {
            await productService.deleteProduct(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Xóa sản phẩm thành công'
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }
};

export default productController;