import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { SignatureCanvasComponent } from "@/components/signature-canvas";
import { signatureSchema } from "@/schemas/signature";
import { Loader2, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SignatureFormProps {
  onSignatureChange: (signature: string) => void;
  onSendSignature: (data: { signature: string; token: string }) => void;
  isLoading: boolean;
  hasError: boolean;
  hasSent: boolean;
}

export default function SignatureForm({
  onSignatureChange,
  onSendSignature,
  isLoading,
  hasError,
  hasSent,
}: SignatureFormProps) {
  const form = useForm({
    resolver: zodResolver(signatureSchema),
    defaultValues: {
      signature: "",
    },
  });

  const handleSubmit = (data: { signature: string }) => {
    onSendSignature({ signature: data.signature, token: "" });
  };

  if (hasSent) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-semibold text-green-700">
              Assinatura enviada com sucesso
            </h2>
            <p className="text-muted-foreground">
              Muito obrigado, entraremos em contato com você, e seja bem vindo a
              lune 💜✨
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (hasError) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold text-red-700">
              Erro ao carregar link
            </h2>
            <p className="text-muted-foreground">
              Desculpe, solicite um novo link a coordenação e tente novamente
              através dele por favor.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Assine o campo abaixo</CardTitle>
        <CardDescription>
          Use o campo de assinatura digital para finalizar sua matrícula
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="signature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assinatura Digital</FormLabel>
                  <FormControl>
                    <SignatureCanvasComponent
                      onSignatureChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isLoading || !form.watch("signature")}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Enviando...
                </>
              ) : (
                "Enviar Assinatura"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
