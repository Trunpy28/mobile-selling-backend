import userRouters from "./user.router.js"
import brandRouters from "./brand.router.js"
import productRouters from "./product.router.js"
import productDetailRouters from "./productDetail.router.js"

const routes = (app) => {
    app.use('/api/user', userRouters);
    app.use('/api/brand', brandRouters);
    app.use('/api/product', productRouters);
    app.use('/api/product-detail', productDetailRouters);
}

export default routes;