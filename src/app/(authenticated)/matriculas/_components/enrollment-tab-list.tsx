import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoreVertical,
  Calendar,
  Clock,
  User,
  BookOpen,
  GraduationCap,
  Pencil,
  Trash,
  RefreshCcw,
  File,
  Link,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EnrollmentWithDetails } from "@/interfaces/enrollment";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEnrollmentTab } from "@/contexts/enrollment-tab-context";
import { StudentDetails } from "@/interfaces/students";
import { generateAndShareContract } from "@/hooks/use-share-contract";
import { ContractEnrollmentData } from "@/api/contract";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { generateSignatureLink } from "@/api/enrollment";

interface EnrollmentTabListProps {
  enrollments: EnrollmentWithDetails[];
  studentData?: StudentDetails;
}

const daysOfWeek: Record<string, string> = {
  sunday: "Domingo",
  monday: "Segunda-feira",
  tuesday: "Terça-feira",
  wednesday: "Quarta-feira",
  thursday: "Quinta-feira",
  friday: "Sexta-feira",
  saturday: "Sábado",
};

const EnrollmentTabList = ({
  enrollments,
  studentData,
}: EnrollmentTabListProps) => {
  const {
    openEditEnrollmentForm,
    cancelEnrollmentMutation,
    openRenewEnrollmentForm,
    openAddEnrollmentForm,
  } = useEnrollmentTab();

  const generateLinkMutation = useMutation({
    mutationKey: ["generate-signature-link"],
    mutationFn: (enrollment: EnrollmentWithDetails) => {
      if (!enrollment?.id) throw new Error("Enrollment ID not found");
      return generateSignatureLink(enrollment.id);
    },
    onSuccess: (data) => {
      copyLink(data.link);
    },
    onError: () => {
      toast.error("Erro ao gerar link de assinatura");
    },
  });

  const copyLink = (link: string) => {
    if (link) {
      navigator.clipboard.writeText(link);
      toast.success("Link copiado para a área de transferência");
    } else {
      toast.error("Nenhum link para copiar");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "ativo":
        return "dark:bg-green-900 bg-green-100 dark:text-green-200 text-green-800";
      case "pending":
      case "pendente":
        return "dark:bg-yellow-900 bg-yellow-100 dark:text-yellow-200 text-yellow-800";
      case "canceled":
      case "cancelado":
        return "dark:bg-red-900 bg-red-100 dark:text-red-200 text-red-800";
      case "renew":
        return "dark:bg-blue-900 bg-blue-100 dark:text-blue-200 text-blue-800";
      default:
        return "dark:bg-zinc-800 bg-zinc-100 dark:text-zinc-300 text-zinc-800";
    }
  };

  const status = {
    active: "Ativo",
    renew: "Renovar",
    pending: "Pendente",
    canceled: "Cancelado",
    archived: "Arquivado",
  };

  const handleEditEnrollment = (enrollment: EnrollmentWithDetails) => {
    openEditEnrollmentForm(enrollment, studentData);
  };

  const handleCancelEnrollment = (enrollment: EnrollmentWithDetails) => {
    cancelEnrollmentMutation.mutate(enrollment.id);
  };

  const handleRenewEnrollment = (enrollment: EnrollmentWithDetails) => {
    openRenewEnrollmentForm(enrollment, studentData);
  };

  const convertToContractData = (
    enrollment: EnrollmentWithDetails
  ): ContractEnrollmentData => {
    return {
      id: enrollment.id,
      classId: enrollment.classId || "",
      createdAt: "",
      endDate: format(new Date(enrollment?.endDate), "dd/MM/yyyy", {
        locale: ptBR,
      }),
      paymentDay: enrollment.paymentDay,
      plan: {
        id: enrollment.plan.id,
        name: enrollment.plan.name,
        description: enrollment.plan.description,
        price: enrollment.plan.price,
        createdAt: enrollment.plan.createdAt,
        updatedAt: enrollment.plan.updatedAt,
      },
      planId: enrollment.planId,
      signature: enrollment.signature,
      startDate: format(new Date(enrollment?.startDate), "dd/MM/yyyy", {
        locale: ptBR,
      }),
      status: enrollment.status,
      student: {
        id: enrollment.studentId,
        firstName: studentData?.personalData?.firstName || "Não informado",
        lastName: studentData?.personalData?.lastName || "Não informado",
        birthDate: studentData?.personalData?.birthDate as unknown as string,
        cpf: studentData?.personalData?.cpf || "Não informado",
        rg: studentData?.personalData?.rg || "Não informado",
        phone: studentData?.personalData?.phone || null,
        instagram: studentData?.personalData?.instagram || null,
        email: studentData?.personalData?.email || null,
        obs: studentData?.personalData?.obs || null,
        createdAt: "", //studentData?.personalData?.createdAt?.toISOString() || '',
        updatedAt: "", //studentData?.personalData?.updatedAt?.toISOString() || '',
      },
      studentId: enrollment.studentId,
      updatedAt: "", //enrollment.updatedAt.toISOString(),
      class: enrollment.class
        ? {
            id: enrollment.class.id,
            name: enrollment.class.name,
            description: enrollment.class.description,
            modalityId: enrollment.class.modalityId,
            createdAt: enrollment.class.createdAt,
            updatedAt: enrollment.class.updatedAt,
            classLevelId: enrollment.class.classLevelId,
            maxStudents: enrollment.class.maxStudents,
            teacherId: enrollment.class.teacherId,
            modality: enrollment.class.modality,
          }
        : {
            id: "",
            name: "Sem classe",
            description: "Sem descrição",
            modalityId: "",
            createdAt: "",
            updatedAt: "",
            classLevelId: "",
            maxStudents: 0,
            teacherId: "",
            modality: {
              id: "",
              name: "Não informado",
              createdAt: "",
              updatedAt: "",
            },
          },
    };
  };

  const handleShareContract = async (enrollment: EnrollmentWithDetails) => {
    try {
      const contractData = convertToContractData(enrollment);
      await generateAndShareContract(contractData);
    } catch (error) {
      console.error("Erro ao compartilhar contrato:", error);
      toast.error("Erro ao compartilhar contrato");
    }
  };

  return (
    <section className="flex flex-col h-full">
      <CardHeader className="mb-6 gap-1 w-full px-0">
        <section className="flex flex-row gap-1">
          <article className="flex flex-col gap-1">
            <CardTitle>Matrículas</CardTitle>
            <p className="text-sm text-muted-foreground">
              Gerencie as matrículas do aluno
            </p>
          </article>
        </section>
      </CardHeader>

      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {enrollments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhuma matrícula encontrada
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {enrollments.map((enrollment) => {
              const gridClass = enrollment?.class?.gridClasses?.[0];
              const classLevel = enrollment?.class?.classLevel?.name;
              const dayOfWeek = gridClass?.dayOfWeek
                ? daysOfWeek[gridClass.dayOfWeek]
                : "";
              const startTime = gridClass?.startTime;
              const endTime = gridClass?.endTime;
              const teacherName =
                enrollment?.class?.teacher?.firstName +
                " " +
                enrollment?.class?.teacher?.lastName;
              const enrollmentStatus =
                status[enrollment?.status as keyof typeof status];

              return (
                <Card
                  key={enrollment?.id}
                  className="hover:shadow-md transition-shadow gap-2 py-4 px-5"
                >
                  <CardHeader className="p-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg font-semibold capitalize">
                          {enrollment?.plan?.name}
                        </CardTitle>
                        <Badge className={getStatusColor(enrollment?.status)}>
                          {enrollmentStatus}
                        </Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditEnrollment(enrollment)}
                          >
                            <Pencil className="h-4 w-4" />
                            Editar matrícula
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleRenewEnrollment(enrollment)}
                            className=""
                          >
                            <RefreshCcw className="h-4 w-4" />
                            Renovar matrícula
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleShareContract(enrollment)}
                            className=""
                          >
                            <File className="h-4 w-4 " />
                            Compartilhar Contrato
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              generateLinkMutation.mutate(enrollment)
                            }
                            className=""
                          >
                            <Link className="h-4 w-4" />
                            Gerar Link
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleCancelEnrollment(enrollment)}
                            className="text-red-600"
                          >
                            <Trash className="h-4 w-4 text-red-600" />
                            Cancelar matrícula
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-1 p-0 pb-0">
                    {enrollment?.class ? (
                      <>
                        <div className="flex items-center space-x-2 text-sm">
                          <BookOpen className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">
                            {enrollment?.class?.modality?.name}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 text-sm">
                          <GraduationCap className="h-4 w-4 text-purple-500" />
                          <span>{classLevel}</span>
                        </div>

                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="h-4 w-4 text-green-500" />
                          <span>{dayOfWeek}</span>
                        </div>

                        <div className="flex items-center space-x-2 text-sm">
                          <Clock className="h-4 w-4 text-orange-500" />
                          <span>
                            {startTime} - {endTime}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 text-sm">
                          <User className="h-4 w-4 text-indigo-500" />
                          <span>{teacherName}</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-gray-500">
                        <p>Sem classe atribuída</p>
                        <p className="text-xs mt-1">
                          Plano: {enrollment?.plan?.weeklyClasses} aulas/semana
                        </p>
                      </div>
                    )}

                    <div className="pt-2 border-t mt-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>
                          Início:{" "}
                          {format(
                            new Date(enrollment?.startDate),
                            "dd/MM/yyyy",
                            {
                              locale: ptBR,
                            }
                          )}
                        </span>
                        <span>
                          Vencimento:{" "}
                          {format(new Date(enrollment?.endDate), "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            <Card className="hover:shadow-md transition-shadow gap-2 py-4 px-5 cursor-pointer border-dashed border-2 hover:border-solid">
              <CardContent className="flex items-center justify-center h-full min-h-[200px] p-0">
                <Button
                  variant="ghost"
                  className="flex flex-col gap-2 h-full w-full"
                  onClick={() =>
                    studentData && openAddEnrollmentForm(studentData)
                  }
                >
                  <Plus className="h-8 w-8 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Adicionar matrícula
                  </span>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export { EnrollmentTabList };
