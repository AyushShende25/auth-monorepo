import { authApi, userQueryOptions } from "@/api/authApi";
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
import type { ApiErrorResponse } from "@/constants/types";
import { type LoginInput, loginSchema } from "@auth-monorepo/shared/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(userQueryOptions());
    if (user) {
      throw redirect({ to: "/" });
    }
  },
});

function RouteComponent() {
  const navigate = useNavigate();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema.shape.body),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onSubmit(values: LoginInput) {
    try {
      await authApi.login(values);
      await navigate({ to: "/protected" });
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data as ApiErrorResponse;
        if (Array.isArray(errorData.errors)) {
          form.setError("root", {
            type: "server error",
            message: errorData.errors.map((err) => err.message).join(", "),
          });
        } else {
          form.setError("root", {
            type: "server error",
            message: errorData.message,
          });
        }
      } else {
        form.setError("root", {
          type: "server error",
          message: "Unexpected error",
        });
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-88px)] px-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-sm">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.formState.errors?.root && (
            <p className="text-destructive text-sm">{form.formState.errors.root.message}</p>
          )}
          <Button className="w-full" type="submit">
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
}
