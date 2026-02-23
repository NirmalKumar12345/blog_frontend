import { AuthResponse, LoginPayload, SignUpPayload } from "@/types/auth.types";
import api from "./axios";

export const loginApi = async (
    payload: LoginPayload
): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', payload);
    return data;
};

export const signUpApi = async (
    payload: SignUpPayload
): Promise<AuthResponse> => {
   const {data}= await api.post<AuthResponse>("/auth/signup", payload);
   return data;
};
