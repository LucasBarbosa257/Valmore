import { AuthResponse } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import * as api from "@/api/auth";
import { useRouter } from "next/navigation";

export const useSignIn = () => {
    const router = useRouter();

    return useMutation<AuthResponse, Error, any>({
        mutationFn: (data) => api.signIn(data),
        onSuccess: async (response) => {
            const expires_at = new Date();
            expires_at.setHours(expires_at.getHours() + 2);

            Cookies.set(
                "access-token", 
                response.accessToken, 
                { expires: expires_at, path: "/" }
            );

            router.push("/chat")
        }
    });
}