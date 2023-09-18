import 'dotenv/config';
import env from './utils/env';
import app from './core/app';
import mongoose from 'mongoose';

const port = env.PORT || 8080;

mongoose.connect(env.MONGODB_CONNECTION)
    .then(() => {
        console.log('Connected to mongodb using mongoose library.');

        app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    }).catch(console.error);

