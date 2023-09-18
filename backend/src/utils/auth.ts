import createHttpError from "http-errors";
import UserModel, { User, SignUpInput, SignInInput } from "../models/user";
import { Request } from "express";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import env from "./env";
import { uuid } from 'uuidv4';
import { assertIsDefined } from "./assertIsDefined";

/**
 * A way to know which method that the user want to be authenticated with
 */
const AuthMethod = {
    Jwt: "Jwt" as const,
    SessionCookie: "SessionCookie" as const,
};

export type AuthMethod = typeof AuthMethod[keyof typeof AuthMethod];

/**
 * Receive a value and see if it fit to one of the methods, if not
 * return cookies and sessions method by default
 */
export function getAuthMethodFromString(value: string): AuthMethod {
    switch (value) {
        case AuthMethod.Jwt:
            return AuthMethod.Jwt

        default:
            return AuthMethod.SessionCookie
    }
}

/**
 * Get the user id either by jwt or session and cookies
 * otherwise return undefined value if failed for both
*/
export function getAuthenticatedUserId(req: Request): string | undefined {
    let authenticatedUserId: string | undefined = undefined
    const authHeader = req.headers.authorization ?? ''

    // if the jwt string is empty then we will use cookies and sessions
    if (authHeader.length === 0) {
        authenticatedUserId = req.session.userId as string | undefined
        return authenticatedUserId
    }

    // otherwise use cookies and sessions
    try {
        if (!authHeader.startsWith('Bearer ')) {
            throw createHttpError(401, 'Invalid token, it should be like the following "Bearer <token>"')
        }
        const token = authHeader?.split('Bearer ')[1]
        const verified = jwt.verify(token, env.JWT_SECRET)
        authenticatedUserId = '' // TODO: Add jwt authentication later
    } catch (error) {
        throw createHttpError(401, 'Invalid or expired token, please login again.')
    }
    return authenticatedUserId
}


/**
 * Get user by user id
*/
export async function findUserById(userId: string): Promise<User | null> {
    const user = await UserModel.findOne({ id: userId }).select('+email').exec()
    return user as User
}
// export async function getUserByUserId(userId: string): Promise<User> {
//     const user = await UserModel.findById(userId).select('+email').exec()
//     return user as User
// }

/**
 * Get the current logged in user
*/
export async function getAuthenticatedUser(req: Request): Promise<User> {
    const authenticatedUserId: string | undefined = getAuthenticatedUserId(req) as string | undefined
    if (!authenticatedUserId) {
        throw createHttpError(401, 'You are not authenticated.')
    }
    assertIsDefined(authenticatedUserId) // Not required
    const user = await findUserById(authenticatedUserId)
    if (!user) {
        throw createHttpError(404, 'User doesn\'t exists anymore.')
    }
    return user
}

/**
 * Log the user out if he is logged in
*/
export async function logoutAuhtneticatedUser(req: Request) {
    await getAuthenticatedUser(req)
    req.session.destroy(error => {
        if (error) {
            console.error(error)
            throw createHttpError(500, 'Error while logout and destroy the session.')
        }
    })
}

export async function findUserByUsername(username: string): Promise<User | null> {
    return await UserModel.findOne({ username: username }).select('+email').exec()
}

export async function findUserByEmail(email: string): Promise<User | null> {
    return await UserModel.findOne({ email: email }).select('+email').exec()
}

/**
 * Create brand new user
*/
export async function createUser(input: SignUpInput): Promise<User> {
    const existingUsername = await findUserByUsername(input.username)
    if (existingUsername) {
        throw createHttpError(409, 'Username already taken. please choose a different one.')
    }

    const existingEmail = await findUserByEmail(input.email)
    if (existingEmail) {
        throw createHttpError(409, 'Email address already taken. please choose a different one.')
    }

    const rawPassword = input.password
    const hashedPassword = await bcrypt.hash(rawPassword, 10)

    const newUser = await UserModel.create({
        username: input.username,
        email: input.email,
        password: hashedPassword,
        id: uuid(), // not 100% unique for production
    })

    // Impossible but just in case
    if (!newUser) {
        throw createHttpError(500, 'Unknown error while create the user in database.')
    }

    return newUser
}

/**
 * Create new user, if it success, grant him access
 * using the auth method he wants and the function
 * need @param req
 * so it can know what kind of auth method passed
*/
export async function signUp(input: SignUpInput, req: Request): Promise<User> {
    const newUser = await createUser(input)
    await grantAccessToUser(newUser.id, req)
    return newUser
}

/**
 * Try to authenticate the user with login credentials
 * throw error if failed, don't log him in or out
*/
export async function authenticateWithError(input: SignInInput): Promise<User> {
    const existingUser = await UserModel.findOne({ username: input.username }).select('+password +email').exec()
    if (!existingUser) {
        throw createHttpError(404, 'Username can\'t be found.')
    }

    const rawPassword = input.password

    const passwordMatch = await bcrypt.compare(rawPassword, existingUser.password)

    if (!passwordMatch) {
        throw createHttpError(401, 'Invalid password.')
    }
    return existingUser
}

/**
 * Give access using auth method with spesefic user id
 * This function doesn't check for the login credentials etc..
*/
export async function grantAccessToUser(userId: string, req: Request) {
    const authMethod: AuthMethod = getAuthMethodFromString(req.body.authMethod)
    if (authMethod == AuthMethod.Jwt) {
        // TODO: Generate jwt token
        throw createHttpError(501, 'The jwt is not supported yet, please login using cookies and sessions.')
    }
    // Cookies and sessions
    req.session.userId = userId
}

/**
 * Try to authenticate first
 * if user prove he is the account owner
 * using the login credentials
 * then we will give him access to the account
 * and we will return the user in the the caller
 * of this function
*/
export async function signIn(input: SignInInput, req: Request): Promise<User> {
    const user = await authenticateWithError(input)
    await grantAccessToUser(user.id, req)
    return user
}