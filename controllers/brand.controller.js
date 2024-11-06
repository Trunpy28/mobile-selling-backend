import brandService from "../services/brand.service.js";

const brandController = {
    createBrand: async (req, res) => {
        try {
            const newBrand = await brandService.createBrand(req.body);
            res.status(201).json({
                message: 'Tạo mới thương hiệu thành công',
                data: newBrand
            });
        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    },

    getAllBrands: async (req, res) => {
        try {
            const brands = await brandService.getAllBrands();
            res.status(200).json({
                message: 'Lấy danh sách thương hiệu thành công',
                data: brands
            });
        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    },

    updateBrand: async (req, res) => {
        try {
            const brandId = req.params.id;
            const updatedBrand = await brandService.updateBrand(brandId, req.body);
            res.status(200).json({
                message: 'Cập nhật thương hiệu thành công',
                data: updatedBrand
            });
        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    },

    deleteBrand: async (req, res) => {
        try {
            const brandId = req.params.id;
            await brandService.deleteBrand(brandId);
            res.status(200).json({
                message: 'Xóa thương hiệu thành công'
            });
        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    }
};

export default brandController;