import { loginApi, signUpApi } from "@/api/auth.api";
import { LoginPayload, SignUpPayload } from "@/types/auth.types";


export const LoginUser = async (payload: LoginPayload) => {
  const response = await loginApi(payload);
  localStorage.setItem("token", response.token || '');
  return response;
};


export const SignupUser = async (payload: SignUpPayload) => {
    return signUpApi(payload);
};

export const LogoutUser = () => {
    localStorage.removeItem('token');
};
