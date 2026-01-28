import Cookies from "js-cookie"
import { handleApiError } from "./errorHandler"

export async function customFetch<T>(
    method: string,
    endpoint: string,
    data?: any,
): Promise<T> {
    const baseURL = endpoint === 'chat' ? `${process.env.NEXT_PUBLIC_AI_URL}` : `${process.env.NEXT_PUBLIC_SERVER_URL}`;
    const headers: HeadersInit = {}

    const token = Cookies.get("access-token")
    const apiKey = process.env.NEXT_PUBLIC_SERVER_API_KEY

    if (token) {
        headers["Authorization"] = `Bearer ${token}`
    }

    if (apiKey) {
        headers["x-api-key"] = apiKey
    }

    const options: RequestInit = {
        method,
        headers
    }

    if (!(data instanceof FormData)) {
        options.headers = {
            ...options.headers,
            "Content-Type": "application/json",
        }
    }

    if (method === "POST" && data) {
        options.body = data instanceof FormData ? data : JSON.stringify(data)
    }

    try {
        const response = await fetch(`${baseURL}/${endpoint}`, options)

        if (!response.ok) {
            let errorMessage = ""

            try {
                const errorData = await response.json()
                errorMessage = errorData.message || errorMessage
            } catch { }

            handleApiError(errorMessage)
            throw new Error(errorMessage)
        }

        if (response.status === 204) {
            return {} as T
        }

        return (await response.json()) as T
    } catch (error: any) {
        throw error
    }
}