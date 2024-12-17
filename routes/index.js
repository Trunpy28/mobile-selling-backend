import userRouters from "./user.router.js"
import brandRouters from "./brand.router.js"
import productRouters from "./product.router.js"
import productDetailRouters from "./productDetail.router.js"
import cartRouters from "./cart.router.js";
import reportRouters from "./exportFile.router.js";

const routes = (app) => {
    app.use('/api/user', userRouters);
    app.use('/api/brand', brandRouters);
    app.use('/api/product', productRouters);
    app.use('/api/product-detail', productDetailRouters);
    app.use('/api/cart', cartRouters);
    app.use('/api/report', reportRouters);
}

export default routes;