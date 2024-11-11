import slugify from "slugify";
import Product from "../models/product.model.js";

export const generateSlugify = async (name) => {
    const slug = slugify(
        name,
        { lower: true, locale: 'vi', strict: true }
    );
    const slugExist = await Product.findOne({ urlSlug: slug });
    let counter = 1;
    let uniqueSlug = slug;

    while (slugExist) {
        uniqueSlug = `${slug}-${counter}`;
        slugExist = await Product.findOne({ urlSlug: uniqueSlug });
        counter++;
    }
    return uniqueSlug;
}

const productService = {
    createProduct: async (data) => {
        try {
            const slug = await generateSlugify(data.name);
            const newProduct = await Product.create({
                ...data,
                urlSlug: slug
            });
            return newProduct;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    getProductBySlug: async (slug) => {
        try {
            const product = await Product.findOne({ urlSlug: slug });
            if (!product) {
                throw new Error('Không tìm thấy sản phẩm');
            }
            return product;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    getProductById: async (id) => {
        try {
            const product = await Product.findById(id);
            if (!product) {
                throw new Error('Không tìm thấy sản phẩm');
            }
            return product;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    getAllProducts: async () => {
        try {
            const products = await Product.find();
            return products;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    updateProduct: async (id, data) => {
        try {
            if (data.name) {
                const slug = await generateSlugify(data.name);
                data.urlSlug = slug;
            }
            const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });
            if (!updatedProduct) {
                throw new Error('Không tìm thấy sản phẩm');
            }
            return updatedProduct;
        } catch (error) {
            throw new Error(error.message);
        }

    },

    deleteProduct: async (id) => {
        try {
            const product = await Product.findByIdAndDelete(id);
            if (!product) {
                throw new Error('Không tìm thấy sản phẩm');
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }
};

export default productService;