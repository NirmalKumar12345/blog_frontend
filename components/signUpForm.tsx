'use client';
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
import { SignupUser } from "@/services/auth.services";
import { SignupSchema } from "@/validations/auth.schema";
import Link from "next/link"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";


export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    const result = SignupSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: { [k: string]: string } = {};
      result.error.issues.forEach((err) => {
        const key = String(err.path[0] || "");
        fieldErrors[key] = err.message;
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }
    try {
      const res = await SignupUser(form);
      toast.success(res.msg);
      router.push('/post');
    }
    catch (err: any) {
      toast.error(err?.response?.data?.msg || "SignUp Failed")
    }
    finally {
      setLoading(false);
    }
  }
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="m@example.com"
                required
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input id="confirm-password" type="password" value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit" className="cursor-pointer" disabled={loading}>
                  {loading ? "Creating..." : "Create Account"}</Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link href="/">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
