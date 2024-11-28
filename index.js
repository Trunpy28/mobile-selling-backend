import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';

dotenv.config();

const app = express();


app.use(morgan('dev'));

const allowedOrigins = ['http://localhost:5173'];
app.use(cors({
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to DB Successfully');
    })
    .catch((err) => {
        console.log(err);
    });

app.listen(process.env.PORT, () => {
    console.log('Server is running in port: ' + process.env.PORT);
})