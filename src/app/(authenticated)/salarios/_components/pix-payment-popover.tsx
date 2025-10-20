"use client";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { createStaticPix } from "pix-utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Copy, Check, QrCode } from "lucide-react";
import { toast } from "sonner";
import { phoneNumberFormatter } from "@/utils/parse-phone";

interface PixPaymentPopoverProps {
  teacherName: string;
  pixKey: string | null;
  amount: number;
}

export default function PixPaymentPopover({
  teacherName,
  pixKey,
  amount,
}: PixPaymentPopoverProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  // Se não tiver chave PIX, mostrar botão desabilitado
  if (!pixKey) {
    return (
      <Button size="sm" disabled className="gap-1">
        <CheckCircle className="h-3 w-3" />
        Pagar
      </Button>
    );
  }

 // crie uma function pra limpar o pixkey de qualquer caractere especial a não ser que seja do tipo email
 const cleanPixKey = (pixKey: string) => {
    const isEmail = pixKey.includes('@');
    const isPhone = pixKey.includes('-') && pixKey.includes('(') && pixKey.includes(')');
    const isCPF = pixKey.includes('-') && pixKey.includes('.');

    if (isCPF) {
      return (pixKey.replace(/[^0-9]/g, ''));
    }

    if (isPhone) {
      return '+55' + (pixKey.replace(/[^0-9]/g, ''));
    }

    if (isEmail) {
      return pixKey;
    }

    return pixKey.replace(/[^a-zA-Z0-9]/g, '');
  };
  // Gerar payload PIX
  const pixData = createStaticPix({
    merchantName: teacherName.toUpperCase().slice(0, 25),
    merchantCity: "SAO PAULO",
    pixKey: cleanPixKey(pixKey),
    transactionAmount: amount,
  });

  // Verificar se retornou erro
  if ('error' in pixData) {
    console.error("Erro ao gerar PIX:", pixData);
    return (
      <Button size="sm" disabled className="gap-1">
        <CheckCircle className="h-3 w-3" />
        Erro PIX
      </Button>
    );
  }
  
  // Extrair o payload (BR Code) do objeto retornado
  const pixPayload = pixData.toBRCode();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pixPayload);
      setCopied(true);
      toast.success("Código PIX copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Erro ao copiar código PIX");
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      // Copiar automaticamente quando abrir
      handleCopy();
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button size="sm" className="gap-1">
          <CheckCircle className="h-3 w-3" />
          Pagar
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          {/* Header */}
          <div>
            <h4 className="font-semibold text-sm">Pagamento via PIX</h4>
            <p className="text-xs text-muted-foreground mt-1">
              {teacherName}
            </p>
          </div>

          <Separator />

          {/* Valor */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Valor:</span>
            <span className="text-lg font-bold">
              R$ {amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg">
            <QRCodeSVG value={pixPayload} size={180} level="M" />
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <QrCode className="h-3 w-3" />
              Escaneie com o app do banco
            </div>
          </div>

          {/* Status de copiado */}
          {copied && (
            <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md text-sm">
              <Check className="h-4 w-4" />
              Código PIX copiado para área de transferência!
            </div>
          )}

          {/* Botão copiar */}
          <Button
            onClick={handleCopy}
            variant="outline"
            className="w-full gap-2"
            size="sm"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copiar código PIX
              </>
            )}
          </Button>

          {/* Instruções */}
          <p className="text-xs text-muted-foreground text-center">
            Cole o código no seu app de banco ou escaneie o QR Code acima
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}

