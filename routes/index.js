import UserRouter from "./user.router.js";

const routes = (app) => {
    app.use('/api/users', UserRouter);
}

export default routes;