import mongoose from "mongoose";
import Cart from "../models/cart.model.js";
import priceService from "./price.service.js";

const getMyCart = async (userId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("UserId không hợp lệ")
    }

    try {
        let cart = await Cart.findOne({ userId }).populate('products.product', 'id name price imageUrl color countInStock');

        if(!cart) {
            cart = new Cart({
                userId,
                products: [],
                totalPrice: 0
            })
            await cart.save();
            return await Cart.findOne({ userId });
        }

        return cart;
    }
    catch(err) {
        throw new Error(err.message);
    }
}

const updateProduct = async (userId, productId, quantity) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("User ID không hợp lệ");
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error("Product ID không hợp lệ");
    }

    quantity = Number.parseInt(quantity);
    if (isNaN(quantity) || quantity < 0) {
        throw new Error("Số lượng phải là số nguyên không âm");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        let cart = await getMyCart(userId);
        
        // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
        const productIndex = cart.products.findIndex(
            (p) => p.product._id.toString() === productId
        );

        if(quantity > 0) {
            if (productIndex >= 0) {
                // Nếu đã tồn tại, tăng số lượng        
                cart.products[productIndex].quantity = quantity;
            } else {
                // Nếu chưa tồn tại, thêm sản phẩm vào giỏ
                cart.products.push({
                    product: productId,
                    quantity: quantity,
                });
            }
        }
        else if( quantity === 0) {
            cart.products.splice(productIndex, 1);
        }

        // Cập nhật tổng giá
        cart.totalPrice = await priceService.calculateTotalPriceInCart(cart);
                
        await cart.save({ session });

        await session.commitTransaction();
        await session.endSession();

        return await getMyCart(userId);
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(error.message);
    }
}

const addProductToCart = async (userId, productId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("User ID không hợp lệ");
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error("Product ID không hợp lệ");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        let cart = await getMyCart(userId);

        console.log(cart.products);

        // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
        const productIndex = cart.products.findIndex(
            (p) => p.product._id.toString() === productId
        );

        if (productIndex >= 0) {
            // Nếu đã tồn tại, tăng số lượng
            cart.products[productIndex].quantity++;
        } else {
            // Nếu chưa tồn tại, thêm sản phẩm vào giỏ
            cart.products.push({
                product: productId,
                quantity: 1,
            });
        }

        // Cập nhật tổng giá
        cart.totalPrice = await priceService.calculateTotalPriceInCart(cart);
                
        await cart.save({ session });

        await session.commitTransaction();
        await session.endSession();

        return await getMyCart(userId);
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(error.message);
    }
}

export default {
    getMyCart,
    updateProduct,
    addProductToCart,
};