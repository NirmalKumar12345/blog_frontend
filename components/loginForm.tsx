'use client';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState } from "react"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { LoginSchema } from "@/validations/auth.schema";
import { LoginUser } from "@/services/auth.services";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  setEmailError("");
  setPasswordError("");

  const result = LoginSchema.safeParse({ email, password });

  if (!result.success) {
    result.error.issues.forEach((err: any) => {
      if (err.path[0] === "email") {
        setEmailError(err.message);
      }
      if (err.path[0] === "password") {
        setPasswordError(err.message);
      }
    });

    setLoading(false);
    return;
  }

  try {
    const res = await LoginUser({ email, password });

    toast.success(res.msg);

    setTimeout(() => {
      router.push("/post");
    }, 1500);

  } catch (err: any) {
    localStorage.removeItem("token");
    toast.error(err?.response?.data?.msg || "Login Failed");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email"
                />
                {emailError && <p className="text-sm text-red-500">{emailError}</p>}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input id="password" value={password} placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)} type="password" />
                {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
              </Field>
              <Field>
                <Button type="submit" className="cursor-pointer" disabled={loading}>{loading ? "Logging in..." : "Login"}</Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <Link href="/signUp">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
