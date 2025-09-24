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

export function CreateEnrollmentDialog() {
  const [activeTab, setActiveTab] = useState("personal-data");

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
      signature: "",
    },
  });

  return (
    <Dialog
      onOpenChange={() => {
        personalDataForm.reset();
        addressForm.reset();
        enrollmentForm.reset();
        setActiveTab("personal-data");
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Nova Matrícula
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col min-w-4xl h-[560px]">
        <DialogHeader className="h-fit">
          <DialogTitle>Nova Matrícula</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="personal-data"
          className="flex-1 flex-row gap-5"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="flex flex-col h-full justify-start gap-2 p-2">
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
          <TabsContent value="personal-data">
            <PersonalDataForm
              form={personalDataForm}
              onSubmit={() => setActiveTab("address")}
            />
          </TabsContent>
          <TabsContent value="address">
            <AddressForm
              form={addressForm}
              onSubmit={() => setActiveTab("enrollment")}
            />
          </TabsContent>
          <TabsContent value="enrollment">
            <EnrollmentForm
              form={enrollmentForm}
              onSubmit={() => setActiveTab("personal-data")}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
