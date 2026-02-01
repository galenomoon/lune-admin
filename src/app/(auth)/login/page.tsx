"use client";
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
    <section className="flex flex-col justify-start py-22 px-8 items-center min-h-screen w-screen">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Faça login na sua conta</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Digite seu email e senha abaixo para fazer login na sua conta
            </p>
          </div>
          <div className="grid gap-6 mt-6">
            <FormInput
              name="email"
              control={form.control}
              label="Email"
              placeholder="Digite o email"
            />
            <FormInput
              name="password"
              control={form.control}
              type="password"
              label="Senha"
              placeholder="Digite a senha"
            />
            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}  
            >
              {loginMutation.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Entrar"
              )}
            </Button>
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-background text-muted-foreground relative z-10 px-2">
                ou
              </span>
            </div>
          </div>
          <div className="text-center text-sm mt-6">
            Algum problema com o login?{" "}
            <a
              href="https://wa.me/5511953979723?text=Ol%C3%A1%2C+gostaria+de+ser+professor+na+Lune%21"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 text-primary"
            >
              Entre em contato
            </a>
          </div>
        </form>
      </Form>
    </section>
  );
}
