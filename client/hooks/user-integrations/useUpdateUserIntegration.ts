import { useMutation } from "@tanstack/react-query";
import * as api from "@/api/user-integrations";
import { useQueryClient } from "@tanstack/react-query"

export const useUpdateUserIntegration = () => {
    const queryClient = useQueryClient();
    
    return useMutation<any, Error, any>({
        mutationFn: (data) => api.update(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["user-integrations"],
            })
        }
    });
}