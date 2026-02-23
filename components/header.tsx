'use client';
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { LogoutUser } from "@/services/auth.services";

export const Header = () => {
    const router = useRouter();
    const handleLogout = () => {        
        LogoutUser();
        router.push("/");
    };
    return (
        <header className="w-full bg-white shadow-sm p-4  top-0 sticky z-10 flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-center">Blog Post</h1>
            <Button type="button" className="cursor-pointer" onClick={handleLogout}> Logout</Button>
        </header>
    )
};