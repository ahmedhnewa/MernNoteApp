import Joi from "joi";
import { InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        select: false,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
}, { timestamps: true })

const signUpValidationSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(32)
        .required(),
    email: Joi
        .string()
        .min(6)
        .max(255)
        .email()
        .required(),
    password: Joi
        .string()
        .min(8)
        .max(1024)
        .required(),
    authMethod: Joi.string().min(3).max(16)
})

const signInValidationSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(32)
        .required(),
    password: Joi
        .string()
        .min(8)
        .max(1024)
        .required(),
    authMethod: Joi.string().min(3).max(16)
})

export interface SignUpInput {
    username: string,
    password: string,
    email: string,
}

export interface SignInInput {
    username: string,
    password: string,
}

export type User = InferSchemaType<typeof userSchema>
export type UserOutput = Omit<User, "password">

export function createUserOutputFrom(user: User): UserOutput {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    }
}

export default model<User>('User', userSchema)
export const SignUpValidationSchema = signUpValidationSchema
export const SignInValidationSchema = signInValidationSchema