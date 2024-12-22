import cartService from "../services/cart.service.js";
import productService from "../services/product.service.js";

const cartController = {
    getMyCart: async (req, res) => {
        const userId = req.user.id;
        if(!userId) {
            return res.status(401).json({
                message: 'Chưa đăng nhập'
            });
        }
    
        try {
            const cart = await cartService.getMyCart(userId);
            return res.status(200).json({
                message: "Lấy thông tin giỏ hàng thành công",
                cart
            });
        }
        catch(err) {
            console.log(err.message);
            
            return res.status(500).json({
                message: "Lấy thông tin giỏ hàng thất bại"
            });
        }
    },
    
    updateProduct: async (req, res) => {
        const userId = req.user.id;
        const { productId, quantity } = req.body;
    
        if(!userId) {
            return res.status(401).json({
                message: 'Chưa đăng nhập'
            });
        }
    
        if(!productId) {
            return res.status(400).json({
                message: 'Thiếu ID sản phẩm'
            });
        }
    
        try {
            const product = await productService.getProductById(productId);
            if(!product) {
                const cart = await cartService.updateProduct(userId, productId, 0);
                return res.status(404).json({
                    message: "Sản phẩm không tồn tại"
                });
            }
    
            const cart = await cartService.updateProduct(userId, productId, quantity);
            return res.status(200).json({
                cart,
                message: "Cập nhật sản phẩm trong giỏ hàng thành công"
            });
        }
        catch(err) {
            return res.status(500).json({
                message: "Cập nhật sản phẩm trong giỏ hàng thất bại"
            })
        }
    },
    
    addProductToCart: async (req, res) => {
        const userId = req.user.id;
        const { productId } = req.body;
    
        if(!userId) {
            return res.status(401).json({
                message: 'Chưa đăng nhập'
            });
        }
    
        if(!productId) {
            return res.status(400).json({
                message: 'Thiếu ID sản phẩm'
            });
        }
    
        try {
            const product = await productService.getProductById(productId);
            if(!product) {
                const cart = await cartService.updateProduct(userId, productId, 0);
                return res.status(404).json({
                    message: "Sản phẩm không tồn tại"
                });
            }
    
            const cart = await cartService.addProductToCart(userId, productId);
            return res.status(200).json({
                cart,
                message: "Thêm sản phẩm trong giỏ hàng thành công"
            });
        }
        catch(err) {
            return res.status(500).json({
                message: "Thêm sản phẩm trong giỏ hàng thất bại"
            })
        }
    }
}

export default cartController;