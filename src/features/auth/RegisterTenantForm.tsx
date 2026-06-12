
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authApi } from "@/services/api";
import { RegisterTenantRequest } from "@/services/interface";

const registerSchema = z.object({
  tenant_name: z.string().min(2, { message: "Tenant name is required" }),
  admin_email: z.string().email({ message: "Invalid email address" }),
  admin_password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  invite_code: z.string().min(1, { message: "Beta invite code is required" }),
});

export function RegisterTenantForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      tenant_name: "",
      admin_email: "",
      admin_password: "",
      invite_code: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setLoading(true);
    setError(null);
    const { invite_code, ...rest } = values;
    const requestBody: RegisterTenantRequest = {
      tenant_name: rest.tenant_name,
      admin_email: rest.admin_email,
      admin_password: rest.admin_password,
    };
    try {
      await authApi.registerTenant(requestBody, invite_code);
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: unknown) {
      console.error(err);
      const apiError = err as { detail?: string; message?: string };
      const message = apiError?.detail || apiError?.message || "Registration failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center">
        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Tenant Registered!</h2>
        <p className="mt-2 text-sm text-slate-500">
          Your tenant has been successfully created. Redirecting you to login...
        </p>
        <div className="mt-6">
          <Link href="/login">
            <Button variant="outline">Go to login now</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
      <div className="text-center">
        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-xl">ATS</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Register your tenant</h2>
        <p className="mt-2 text-sm text-slate-500">
          Start your enterprise resume screening today.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20 text-center">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="tenant_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company / Tenant Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Corp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="admin_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Email</FormLabel>
                  <FormControl>
                    <Input placeholder="admin@acme.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="admin_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="invite_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beta Invite Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your invite code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full h-10" disabled={loading}>
            {loading ? "Registering..." : "Register Tenant"}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:text-primary/80">
          Sign in
        </Link>
      </div>
    </div>
  );
}
