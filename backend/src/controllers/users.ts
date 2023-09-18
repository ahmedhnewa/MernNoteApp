import { RequestHandler } from "express";
import { SignUpValidationSchema, SignInValidationSchema, createUserOutputFrom } from '../models/user'
import createHttpError from "http-errors";
import * as AuthSerivce from "../utils/auth";

export const getCurrentAuthenticatedUser: RequestHandler = async (req, res, next) => {
    try {
        const user = await AuthSerivce.getAuthenticatedUser(req)
        res.status(200).json(createUserOutputFrom(user))
    } catch (error) {
        next(error)
    }
}

export const signUp: RequestHandler = async (req, res, next) => {
    try {
        await SignUpValidationSchema.validateAsync(req.body)

        const username: string = req.body.username
        const email: string = req.body.email
        const rawPassword: string = req.body.password

        const newUser = await AuthSerivce.signUp({
            username: username,
            email: email,
            password: rawPassword,
        }, req)

        if (!newUser) {
            throw createHttpError(500, 'Error while create the user.')
        }

        res.status(201).json(createUserOutputFrom(newUser))
    } catch (error) {
        next(error)
    }
}

export const signIn: RequestHandler = async (req, res, next) => {
    try {
        await SignInValidationSchema.validateAsync(req.body)

        const username: string = req.body.username
        const rawPassword: string = req.body.password

        const existingUser = await AuthSerivce.signIn({
            username: username,
            password: rawPassword,
        }, req)

        res.status(200).json(createUserOutputFrom(existingUser))
    } catch (error) {
        next(error)
    }
}

export const signOut: RequestHandler = async (req, res, next) => {
    try {
        await AuthSerivce.logoutAuhtneticatedUser(req)
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
}