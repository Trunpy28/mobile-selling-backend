import { get } from 'mongoose';
import Brand from '../models/brand.model.js';

const brandService = {
    createBrand: async (data) => {
        try {
            const newBrand = await Brand.create(data);
            return newBrand;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    getAllBrands: async () => {
        try {
            const brands = await Brand.find();
            return brands;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    getBrandById: async (id) => {
        try {
            const brand = await Brand.findById(id);
            return brand;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    updateBrand: async (id, data) => {
        try {
            const updatedBrand = await Brand.findByIdAndUpdate(
                id,
                data,
                { new: true }
            );
            return updatedBrand;
        }
        catch (error) {
            throw new Error(error.message);
        }
    },

    deleteBrand: async (id) => {
        try {
            await Brand.findByIdAndDelete(id);
            return true;
        } catch (error) {
            throw new Error(error.message);
        }
    }
};

export default brandService;