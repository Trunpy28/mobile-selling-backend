import slugify from "slugify";
import Product from "../models/product.model.js";
import Brand from "../models/brand.model.js";

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

    getAllProducts: async (searchQuery, sortOrder, selectedBrands, page, pageSize) => {
        if (page && typeof page === "string") {
            page = parseInt(page);
            if (isNaN(page) || page < 1) page = 1;
        }

        if (pageSize && typeof pageSize === "string") {
            pageSize = parseInt(pageSize);
            if (isNaN(pageSize) || pageSize < 1 || pageSize > 100) pageSize = 10;
        }

        try {
            let query = Product.find();

            if (searchQuery) {
                query.find({ name: { $regex: searchQuery, $options: "i" } });
            }

            if (selectedBrands && selectedBrands.length > 0) {
                const brands = await Brand.find({ name: { $in: selectedBrands } });
                const brandIds = brands.map(brand => brand._id);

                query.find({ brand: { $in: brandIds } });
            }

            const totalProducts = await Product.countDocuments(query.getQuery());

            let sort = {};

            if (sortOrder) {
                if (sortOrder === "name-asc") {
                    sort = { name: 1 };
                }
                else if (sortOrder === "price-desc") {
                    sort = { price: -1 };
                }
                else if (sortOrder === "price-asc") {
                    sort = { price: 1 };
                }

                query.sort(sort);
            }

            if (page && pageSize) {
                query = query.skip((page - 1) * pageSize).limit(pageSize);
            }

            const products = await query.exec();

            return { totalProducts, products };
        } catch (error) {
            throw new Error(error.message);
        }
    },

    getProductsOfBrand: async (brandId, limit) => {
        try {
            let query = Product.find({ brand: brandId });

            if (Number.isInteger(limit) && limit > 0) {
                query = query.limit(limit);
            }

            const products = await query.exec();
            return products;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    updateProduct: async (id, newData) => {
        try {
            const product = await Product.findById(id);
            if (!product) {
                throw new Error('Không tìm thấy sản phẩm');
            }
            if (newData.name) {
                const slug = await generateSlugify(newData.name);
                newData.urlSlug = slug;
            }
            const updatedData = {
                ...product._doc, //Du lieu cu
                ...newData //Ghi de du lieu moi
            };
            const updatedProduct = await Product.findByIdAndUpdate(
                id,
                updatedData,
                { new: true }
            );
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