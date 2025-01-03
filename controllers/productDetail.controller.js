import productDetailService from "../services/productDetail.service.js";

const productDetailController = {
    createProductDetail: async (req, res) => {
        try {
            const productDetail = await productDetailService.createProductDetail(req.body);
            res.status(201).json({
                success: true,
                message: 'Tạo chi tiết sản phẩm thành công',
                data: productDetail
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    getProductDetail: async (req, res) => {
        try {
            const { productId } = req.params;
            const productDetail = await productDetailService.getProductDetail(productId);
            console.log("Product Detail: ", productDetail);

            res.status(200).json({
                success: true,
                data: productDetail
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    },

    updateProductDetail: async (req, res) => {
        try {
            const { productId } = req.params;
            const data = req.body;

            const productDetail = await productDetailService.updateProductDetail(productId, data);

            res.status(200).json({
                success: true,
                message: productDetail ? 'Cập nhật chi tiết sản phẩm thành công' : 'Tạo mới chi tiết sản phẩm thành công',
                data: productDetail
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    },

    deleteProductDetail: async (req, res) => {
        try {
            const { productId } = req.params;
            await productDetailService.deleteProductDetail(productId);
            res.status(200).json({
                success: true,
                message: 'Xóa chi tiết sản phẩm thành công'
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }
};

export default productDetailController;