import userRouters from "./user.router.js"
import brandRouters from "./brand.router.js"

const routes = (app) => {
    app.use('/api/user', userRouters);
    app.use('/api/brand', brandRouters);
}

export default routes;