export interface User {
    username: string,
    email: string,
    createdAt: string,
    updatedAt: string,
}

export interface SignUpInput {
    username: string,
    email: string,
    password: string,
}

export interface SignInInput {
    username: string,
    password: string,
}