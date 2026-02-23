"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/loginForm";
import { isAuthenticated } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/post");
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
