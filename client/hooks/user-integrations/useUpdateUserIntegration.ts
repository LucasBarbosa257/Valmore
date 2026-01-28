import { useMutation } from "@tanstack/react-query";
import * as api from "@/api/user-integrations";

export const useUpdateUserIntegration = () => {
    return useMutation<any, Error, any>({
        mutationFn: (data) => api.update(data),
        onSuccess: async () => {
            
        }
    });
}