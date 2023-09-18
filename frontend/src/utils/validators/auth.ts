import { SignInInput, SignUpInput } from "../../models/user";

export function validateSignUpInput(input: SignUpInput): string | null {
    if (input.username.length < 3) {
        return 'Username must be longer than 3 characters'
    }
    if (input.username.length > 32) {
        return 'Username must be less than 32 characters'
    }

    if (input.password.length < 8) {
        return 'Password must be longer than 8 characters'
    }
    if (input.password.length > 255) {
        return 'Password must be less than 255 characters'
    }

    if (input.email.length < 6) {
        return 'Email must be longer than 8 characters'
    }
    if (input.email.length > 255) {
        return 'Email must be less than 255 characters'
    }
    return null
}

export function validateSignInInput(input: SignInInput): string | null {
    if (input.username.length < 3) {
        return 'Username must be longer than 3 characters'
    }
    if (input.username.length > 32) {
        return 'Username must be less than 32 characters'
    }

    if (input.password.length < 8) {
        return 'Password must be longer than 8 characters'
    }
    if (input.password.length > 255) {
        return 'Password must be less than 255 characters'
    }
    return null
}