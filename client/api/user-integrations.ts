import { ListUserIntegrationsResponse } from "@/types/user-integrations";
import { customFetch } from "./customFetch"

export const list = async (): Promise<ListUserIntegrationsResponse[]> => {
    return await customFetch<ListUserIntegrationsResponse[]>(
        "GET",
        "user-integrations"
    );
}

export const update = async (
    data: any
): Promise<any> => {
    return await customFetch<any>(
        "POST",
        "user-integrations/update",
        data
    );
}