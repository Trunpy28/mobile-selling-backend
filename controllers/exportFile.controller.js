import iconv from "iconv-lite";
import { Parser } from "json2csv";
import Product from "../models/product.model.js";
import Brand from "../models/brand.model.js";
import User from "../models/user.model.js";

const exportFileController = {
    exportProductCSV: async (req, res) => {
        try {
            const brands = await Brand.find();
            const productsByBrand = [];
            let totalProductCount = 0;

            for (const brand of brands) {
                const productCount = await Product.countDocuments({ brand: brand._id });
                totalProductCount += productCount;

                productsByBrand.push({
                    Brand: brand.name,
                    ProductCount: productCount,
                });
            }

            const totalUserCount = await User.countDocuments();
            productsByBrand.push({
                Brand: "Total Products",
                ProductCount: totalProductCount,
            });
            productsByBrand.push({
                Brand: "Total Users",
                ProductCount: totalUserCount,
            });

            const users = await User.find();
            const userDetails = users.map((user) => ({
                name: user.name,
                email: user.email,
                phone: user.phoneNumber,
                address: user.address ? `${user.address.city}, ${user.address.district}, ${user.address.ward}, ${user.address.detailedAddress}` : "No Address",

            }));

            const products = await Product.find().populate("brand", "name");
            const productDetails = products.map((product) => ({
                productName: product.name,
                originalPrice: product.originalPrice,
                price: product.price,
                color: product.color,
                quantity: product.countInStock,
                brand: product.brand ? product.brand.name : "No Brand",
            }));

            const fieldsBrandOverview = ["Brand", "ProductCount"];
            const fieldsUserDetails = ["name", "email", "phone", "address"];
            const fieldsProductDetails = ["brand", "productName", "originalPrice", "price", "color", "quantity"];

            const json2csvParserBrand = new Parser({ fields: fieldsBrandOverview });
            const csvBrandOverview = json2csvParserBrand.parse(productsByBrand);

            const json2csvParserUser = new Parser({ fields: fieldsUserDetails });
            const csvUserDetails = json2csvParserUser.parse(userDetails);

            const json2csvParserProduct = new Parser({ fields: fieldsProductDetails });
            const csvProductDetails = json2csvParserProduct.parse(productDetails);

            const BOM = "\uFEFF";
            const finalCSV = `
Bang Tong Quan San Pham Va Nguoi Dung
${csvBrandOverview}

Bang Thong Tin Nguoi Dung
${csvUserDetails}

Bang Thong Tin San Pham
${csvProductDetails}
            `;

            const csvBuffer = iconv.encode(BOM + finalCSV, "windows-1252");

            res.header("Content-Type", "text/csv; charset=windows-1252");
            res.header("Content-Disposition", "attachment; filename=product_report.csv");
            res.status(200).send(csvBuffer);
        } catch (error) {
            console.error("Error exporting CSV:", error);
            res.status(400).json({
                message: "Failed to export CSV.",
            });
        }
    },
};

export default exportFileController;