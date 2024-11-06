import userRouters from "./userRouter.js"

const routes = (app) => {
    app.use('/api/user', userRouters);
}

export default routes;