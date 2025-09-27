import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book } from "lucide-react";
import {
  AddressSchema,
  addressSchema,
  EnrollmentSchema,
  enrollmentSchema,
  personalDataSchema,
  PersonalDataSchema,
} from "@/schemas/enrollment";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PersonalDataForm from "@/app/(authenticated)/matriculas/_components/personal-data-form";
import AddressForm from "@/app/(authenticated)/matriculas/_components/address-form";
import EnrollmentForm from "@/app/(authenticated)/matriculas/_components/enrollment-form";
import { createEnrollment } from "@/api/enrollment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { dateStringToDate } from "@/utils/parse-date";
import { useCep } from "@/hooks/use-cep";
import { CreateEnrollmentPayload } from "@/interfaces/enrollment";

export function CreateEnrollmentDialog() {
  const [activeTab, setActiveTab] = useState("personal-data");
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const personalDataForm = useForm<PersonalDataSchema>({
    resolver: zodResolver(personalDataSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      birthDate: "",
      cpf: "",
      rg: "",
      phone: "",
      instagram: "",
      email: "",
      obs: "",
    },
  });

  const addressForm = useForm<AddressSchema>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: "",
      number: "",
      city: "",
      neighborhood: "",
      state: "",
      complement: "",
      cep: "",
    },
  });

  const enrollmentForm = useForm<EnrollmentSchema>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      startDate: "",
      planId: "",
      paymentDay: "",
      classId: "",
      modalityId: "",
      signature: "",
    },
  });

  const createEnrollmentMutation = useMutation({
    mutationFn: createEnrollment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Matrícula criada com sucesso!");
      setIsOpen(false);
      resetForms();
    },
    onError: (error) => {
      toast.error("Erro ao criar matrícula");
      console.error(error);
    },
  });

  const resetForms = () => {
    personalDataForm.reset();
    addressForm.reset();
    enrollmentForm.reset();
    setActiveTab("personal-data");
  };

  const handleEnrollmentSubmit = (data: EnrollmentSchema) => {
    const personalData = personalDataForm.getValues();
    const address = addressForm.getValues();

    const enrollmentData = {
      student: {
        firstName: personalData.firstName,
        lastName: personalData.lastName,
        birthDate: dateStringToDate(personalData.birthDate) || new Date(),
        cpf: personalData.cpf,
        rg: personalData.rg,
        phone: personalData.phone,
        instagram: personalData.instagram,
        email: personalData.email,
        obs: personalData.obs,
        password: personalData.cpf.replace(/\D/g, "").slice(0, 4),
      },
      address,
      enrollment: {
        startDate: new Date(data.startDate),
        planId: data.planId,
        paymentDay: data.paymentDay,
        classId: data.classId,
        modalityId: data.modalityId,
        signature: data.signature,
      },
    };

    createEnrollmentMutation.mutate(enrollmentData as CreateEnrollmentPayload);
  };

  const cepValue = addressForm.watch("cep");

  const shouldSearchCep =
    !!cepValue && cepValue.replace(/\D/g, "").length === 8;

  const { isLoading: cepLoading } = useCep({
    cep: cepValue || "",
    enabled: shouldSearchCep,
    form: addressForm,
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          resetForms();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Nova Matrícula
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col min-w-4xl max-h-[90vh]">
        <DialogHeader className="h-fit flex-shrink-0">
          <DialogTitle>Nova Matrícula</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="personal-data"
          className="flex-1 flex-row gap-5 min-h-0"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="flex flex-col h-full justify-start gap-2 p-2 flex-shrink-0">
            <TabsTrigger
              className="max-h-fit w-full justify-start"
              value="personal-data"
            >
              <User />
              Dados pessoais
            </TabsTrigger>
            <TabsTrigger
              className="max-h-fit w-full justify-start"
              value="address"
            >
              <MapPin />
              Endereço
            </TabsTrigger>
            <TabsTrigger
              className="max-h-fit w-full justify-start"
              value="enrollment"
            >
              <Book />
              Matrícula
            </TabsTrigger>
          </TabsList>
          <div className="flex-1 overflow-y-auto min-h-[60vh]">
            <TabsContent value="personal-data" className="h-full">
              <PersonalDataForm
                form={personalDataForm}
                onSubmit={() => setActiveTab("address")}
              />
            </TabsContent>
            <TabsContent value="address" className="h-full">
              <AddressForm
                cepLoading={cepLoading}
                form={addressForm}
                onSubmit={() => setActiveTab("enrollment")}
              />
            </TabsContent>
            <TabsContent value="enrollment" className="h-full">
              <EnrollmentForm
                form={enrollmentForm}
                isCreateEnrollmentLoading={createEnrollmentMutation.isPending}
                onSubmit={handleEnrollmentSubmit}
              />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
