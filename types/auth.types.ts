export interface LoginPayload{
    email: string;
    password: string;
}

export interface SignUpPayload{
    email: string;
    password: string;
    confirmPassword: string;
}

export interface AuthResponse{
    msg: string;
    token?: string;
    user?: {
        email: string;
    };
}