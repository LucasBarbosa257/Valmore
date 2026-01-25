export interface UserIntegration {
    id: string;
    provider: string;
    host: string;
    email: string;
    api_token: string;
    created_at: string;
    updated_at: string;
}

export interface FindUserIntegrationsByUserIdInput {
    user_id: string;
}

export interface FindUserIntegrationByUserIdAndProviderInput {
    user_id: string;
    provider: string;
}

export interface CreateUserIntegrationPayload {
    user_id: string;
    provider: string;
}

export interface CreateUserIntegrationInput {
    id: string;
    user_id: string;
    provider: string;
}

export interface UpdateUserIntegrationInput {
    id: string;
    host: string;
    email: string;
    api_token: string;
}