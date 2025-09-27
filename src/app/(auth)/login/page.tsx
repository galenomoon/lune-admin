"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { LoginSchema, loginSchema } from "@/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/components/forms/form-input";
import { AuthContext } from "@/contexts/auth-context";
import { Loader2 } from "lucide-react";

export default function Login() {
  const { loginMutation } = useContext(AuthContext);
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginSchema) => {
    loginMutation.mutate(data);
  };

  return (
    <section className="flex flex-col justify-start py-22 items-center min-h-screen w-screen">
      <Card className="w-[400px] max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="flex flex-col gap-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormInput name="email" control={form.control} />
              <FormInput
                name="password"
                control={form.control}
                type="password"
              />
              <Button
                disabled={loginMutation.isPending}
                className="cursor-pointer"
                type="submit"
              >
                {loginMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}
