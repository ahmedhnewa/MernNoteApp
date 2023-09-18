import { SignInInput, SignUpInput, User } from "../models/user";
import { fetchWithError } from "../core/network";

export async function getCurrentLoggedInUser(): Promise<User> {
    const response = await fetchWithError('/api/auth', {
        method: 'GET',
        // credentials: 'include',
    })
    return response.json()
}

export async function signUp(input: SignUpInput): Promise<User> {
    const response = await fetchWithError('/api/auth/signUp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    })
    return response.json()
}

export async function signIn(input: SignInInput): Promise<User> {
    const response = await fetchWithError('/api/auth/signIn', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    })
    return response.json()
}

export async function signOut() {
    await fetchWithError('/api/auth/signOut', {
        method: 'POST',
    })
}