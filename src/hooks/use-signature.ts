import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getEnrollmentByToken, sendSignature } from "@/api/contract";
import { toast } from "sonner";

export function useSignature(token: string) {
  const [signature, setSignature] = useState("");

  // Query para buscar dados da matrícula
  const {
    data: enrollment,
    isLoading: isLoadingEnrollment,
    error: enrollmentError,
  } = useQuery({
    queryKey: ["enrollment", token],
    queryFn: () => getEnrollmentByToken(token),
    enabled: !!token,
    retry: false,
  });

  // Mutation para enviar assinatura
  const sendSignatureMutation = useMutation({
    mutationFn: ({ signature }: { signature: string }) =>
      sendSignature({ token, signature }),
    onSuccess: () => {
      toast.success("Assinatura enviada com sucesso!");
    },
    onError: (error) => {
      console.error(error);
      toast.error(
        "Seu token expirou, entre em contato conosco e solicite um novo link"
      );
    },
  });

  const handleSendSignature = (data: { signature: string }) => {
    if (!data.signature) {
      toast.error("Por favor, assine antes de enviar");
      return;
    }
    sendSignatureMutation.mutate({
      signature: data.signature,
    });
  };

  return {
    enrollment,
    isLoadingEnrollment,
    enrollmentError,
    signature,
    setSignature,
    sendSignatureMutation,
    handleSendSignature,
  };
}
