export interface UserIntegration {
    id: string;
    provider: string;
    host: string;
    api_token: string;
    created_at: string;
    updated_at: string;
}

export interface CreateUserIntegrationInput {
    id: string;
    provider: string;
    host: string;
    api_token: string;
}

export interface UpdateUserIntegrationInput {
    id: string;
    host: string;
    api_token: string;
}