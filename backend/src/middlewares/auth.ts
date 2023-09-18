import { RequestHandler } from "express";
import { getAuthenticatedUserId } from "../utils/auth";
import createHttpError from "http-errors";

export const requireAuth: RequestHandler = (req, res, next) => {
    const userId = getAuthenticatedUserId(req)
    if (!userId) {
        next(createHttpError(401, 'You are not authenticated.'))
    }
    next()
}