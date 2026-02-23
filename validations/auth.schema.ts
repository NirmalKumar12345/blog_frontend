import z from "zod";

export const LoginSchema=z.object({
    email: z.string().min(1,"Email is required").email("Invalid Email"),
    password: z.string().min(1,"Password is required")
});

export const SignupSchema =z.object({
    email: z.string().min(1,"Email is required").email("Invalid Email"),
    password: z.string().min(8,"Password will be minimum 8 charaters is required"),
    confirmPassword: z.string(),
}).refine((data)=>data.password===data.confirmPassword,{
    message: "Password can't be match",
    path: ["confirmPassword"]
});