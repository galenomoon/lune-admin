import { useQuery } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { AddressSchema } from "@/schemas/enrollment";
import { toast } from "sonner";

interface CepResponse {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

interface UseCepProps {
  cep: string;
  enabled?: boolean;
  form?: UseFormReturn<AddressSchema>;
}

export const useCep = ({ cep, enabled = true, form }: UseCepProps) => {
  const cleanCep = cep?.replace(/\D/g, "");
  const isValidCep = cleanCep?.length === 8;

  return useQuery({
    queryKey: ["cep", cleanCep],
    queryFn: async (): Promise<CepResponse> => {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      if (!response.ok) {
        toast.error("Erro ao buscar CEP");
        throw new Error("Erro ao buscar CEP");
      }
      const data = await response.json();
      if (form) {
        form.setValue("street", data.logradouro);
        form.setValue("neighborhood", data.bairro);
        form.setValue("city", data.localidade);
        form.setValue("state", data.uf);
      }
      toast.success("CEP encontrado com sucesso");
      return data;
    },
    enabled: enabled && isValidCep,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 1,
  });
};
