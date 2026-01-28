import { ChatResponse } from "@/types/chat";
import { useMutation } from "@tanstack/react-query";
import * as api from "@/api/chat";

export const useChat = () => {
    return useMutation<ChatResponse, Error, any>({
        mutationFn: (data) => api.chat(data),
        onSuccess: async (response) => {
            return response;
        }
    });
}