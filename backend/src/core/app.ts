import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan'
import createHttpError, { isHttpError } from 'http-errors';
import { isError as isJoiError } from 'joi'
import cors from 'cors';
import session from 'express-session'
import MongoStore from 'connect-mongo';

import notesRoutes from '../routes/notes'
import usersRoutes from '../routes/users'
import env from '../utils/env';
import { requireAuth } from '../middlewares/auth';

const app = express();

app.use(cors())
app.use(morgan('dev'))

app.use(express.json())

app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: env.MONGODB_CONNECTION,
    })
}))

const apiRouteKey = 'api'

app.use(`/${apiRouteKey}/auth`, usersRoutes)
app.use(`/${apiRouteKey}/notes`, requireAuth, notesRoutes)

app.use((req, res, next) => {
    next(createHttpError(404, 'Endpoint not found.'));
})

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    let errorMessage = "An unknown error occurred.";
    let statusCode = 500
    if (isJoiError(error)) {
        errorMessage = error.details[0].message
        statusCode = 400
    } else if (isHttpError(error)) {
        errorMessage = error.message;
        statusCode = error.status
    } else if (error instanceof Error) {
        errorMessage = error.message // not good for production
    }
    const exceptions = [404, 400, 403, 401, 409]
    if (!exceptions.includes(statusCode)) {
        console.error(error)
    }

    res.status(statusCode).json({
        error: errorMessage
    })
});

export default app;