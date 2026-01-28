import * as api from "@/api/user-integrations";
import { ListUserIntegrationsResponse } from "@/types/user-integrations";
import { useQuery } from "@tanstack/react-query";

export const useListUserIntegrations = () => {
    const response = useQuery({
        queryKey: ['user-integrations'],
        queryFn: async (): Promise<ListUserIntegrationsResponse[]> => api.list(),
        retry: false
    });

    return {
        user_integrations: response.data,
        isPending: response.isPending
    };
}