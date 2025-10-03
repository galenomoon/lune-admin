"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useSignature } from "@/hooks/use-signature";
import logoHeader from "@/assets/header-logo.svg";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ContractTerms, SignatureForm } from "../_components";
import Image from "next/image";

export default function SignaturePage() {
  const params = useParams();
  const token = params?.token as string;

  const {
    enrollment,
    isLoadingEnrollment,
    enrollmentError,
    setSignature,
    sendSignatureMutation,
    handleSendSignature,
  } = useSignature(token);

  if (isLoadingEnrollment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8 grid grid-cols-1 gap-4">
        {/* Header */}
        <div className="text-center flex flex-col items-center space-y-2">
          <Image src={logoHeader} alt="Logo" width={220} />
          <h1 className="text-3xl font-bold mt-4">Assinar Matrícula</h1>
          <p className="text-muted-foreground">
            {enrollment?.student
              ? `Olá ${enrollment.student.firstName} ${enrollment.student.lastName}, finalize sua matrícula assinando o contrato abaixo.`
              : "Finalize sua matrícula assinando o contrato abaixo."}
          </p>
        </div>

        {/* Informações da Matrícula */}
        {enrollment && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Detalhes da Matrícula</CardTitle>
              <CardDescription>
                Confira os dados da sua matrícula
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Plano
                  </p>
                  <p className="text-sm">{enrollment.plan?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Modalidade
                  </p>
                  <p className="text-sm">{enrollment.class?.modality?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Turma
                  </p>
                  <p className="text-sm">{enrollment.class?.description}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Data de Início
                  </p>
                  <p className="text-sm">
                    {enrollment.startDate
                      ? new Date(enrollment.startDate).toLocaleDateString(
                          "pt-BR"
                        )
                      : "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Termos do Contrato */}
        <ContractTerms paymentDay={enrollment?.paymentDay} />

        {/* Formulário de Assinatura */}
        <SignatureForm
          onSignatureChange={setSignature}
          onSendSignature={handleSendSignature}
          isLoading={sendSignatureMutation.isPending}
          hasError={!!enrollmentError}
          hasSent={sendSignatureMutation.isSuccess}
        />
      </div>
    </div>
  );
}
