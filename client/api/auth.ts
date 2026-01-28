import { customFetch } from "./customFetch"
import type { AuthResponse } from "@/types/auth";

export const signUp = async (
    data: any
): Promise<AuthResponse> => {
    return await customFetch<AuthResponse>(
        "POST",
        "auth/signup",
        data
    );
}

export const signIn = async (
    data: any
): Promise<AuthResponse> => {
    return await customFetch<AuthResponse>(
        "POST",
        "auth/signin",
        data
    );
}