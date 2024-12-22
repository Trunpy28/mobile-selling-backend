import brandService from "../services/brand.service.js";
import productService from "../services/product.service.js";
import cloudinaryServices from "../services/cloudinary.service.js";

const productController = {
    createProduct: async (req, res) => {
        try {
            let imageUrls = [];
            if (req.files) {
                const { listResult } = await cloudinaryServices.uploadFiles(req.files);
                imageUrls = listResult.map(result => result.secure_url);
            }
            console.log(req.files);

            const productData = { ...req.body, imageUrl: imageUrls };
            console.log("productData:", productData);
            const newProduct = await productService.createProduct(productData);
            res.status(201).json({
                success: true,
                message: 'Tạo sản phẩm thành công',
                data: newProduct
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
            const { searchQuery, sortOrder, selectedBrands, page, pageSize } = req.query;
            const { products, totalProducts } = await productService.getAllProducts(searchQuery, sortOrder, selectedBrands, page, pageSize);
            res.status(200).json({
                products,
                totalProducts
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
            const { id } = req.params;
            const data = req.body;

            let existingImages = req.body.images || [];
            if (typeof existingImages === 'string') {
                existingImages = [existingImages];
            }

            let uploadedImages = [];
            if (req.files && req.files.length > 0) {
                const { listResult } = await cloudinaryServices.uploadFiles(req.files);
                uploadedImages = listResult.map((result) => result.secure_url);
            }

            const updatedImages = [...existingImages, ...uploadedImages];
            data.imageUrl = updatedImages;

            const updatedProduct = await productService.updateProduct(id, data);

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
    },

    getProductsOfBrand: async (req, res) => {
        try {
            const brand = await brandService.getBrandByName(req.query.brandName);
            const limit = Number.parseInt(req.query.limit);
            const products = await productService.getProductsOfBrand(brand._id, limit);
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

    countTotalProducts: async (req, res) => {
        try {
            const totalProducts = await productService.countTotalProducts();
            res.status(200).json({
                success: true,
                data: totalProducts
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