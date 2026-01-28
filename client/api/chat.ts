import { ChatResponse } from "@/types/chat";
import { customFetch } from "./customFetch"

export const chat = async (
  data: any
): Promise<ChatResponse> => {
  return await customFetch<ChatResponse>(
    "POST",
    "chat",
    data
  );
}