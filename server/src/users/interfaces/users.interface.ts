export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    created_at: string;
    updated_at: string;
}

export interface FindUserByEmailInput {
    email: string;
}

export interface CreateUserPayload {
    name: string;
    email: string;
    password: string;
}

export interface CreateUserInput {
    id: string;
    name: string;
    email: string;
    password: string;
}