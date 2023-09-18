import { ConflitError, HttpError, UnauthorizedError } from "./errors/http.errors"

export async function fetchWithError(input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response> {
    const response = await fetch(input, init)
    if (response.ok) {
        return response
    }
    const errorBody = await response.json()
    const errorMessage: string | undefined = errorBody.error

    switch (response.status) {
        case 401:
            throw new UnauthorizedError(errorMessage)

        case 409:
            throw new ConflitError(errorMessage)

        default:
            throw new HttpError(errorMessage ?? `Unknown error with status: ${response.status}, ${response.statusText} and message: ${errorMessage}`)
    }


}