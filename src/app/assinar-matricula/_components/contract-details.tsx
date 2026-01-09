import { ContractEnrollmentData } from "@/api/contract";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ContractDetails({
  enrollment,
}: {
  enrollment: ContractEnrollmentData;
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Detalhes da Matrícula</CardTitle>
        <CardDescription>
          Confira todos os dados da sua matrícula
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dados do Aluno */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary">Dados do Aluno</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Nome Completo
              </p>
              <p className="text-sm font-medium">
                {enrollment.student?.firstName} {enrollment.student?.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">CPF</p>
              <p className="text-sm">{enrollment.student?.cpf}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Telefone
              </p>
              <p className="text-sm">
                {enrollment.student?.phone || "Não informado"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-sm">
                {enrollment.student?.email || "Não informado"}
              </p>
            </div>
            {enrollment.student?.instagram && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Instagram
                </p>
                <p className="text-sm">{enrollment.student.instagram}</p>
              </div>
            )}
            {enrollment.student?.obs && (
              <div className="md:col-span-2 lg:col-span-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Observações
                </p>
                <p className="text-sm">{enrollment.student.obs}</p>
              </div>
            )}
          </div>
        </div>

        {/* Dados da Turma */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary">Dados da Turma</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Modalidade
              </p>
              <p className="text-sm font-medium">
                {enrollment.class?.modality?.name}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Descrição
              </p>
              <p className="text-sm">{enrollment.class?.description}</p>
            </div>
          </div>
        </div>

        {/* Dados do Plano */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary">Dados do Plano</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Nome do Plano
              </p>
              <p className="text-sm font-medium">{enrollment.plan?.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Valor Mensal
              </p>
              <p className="text-sm font-medium text-green-600">
                {enrollment.plan?.price?.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Descrição do Plano
              </p>
              <p className="text-sm">
                {enrollment.plan?.description || "Sem descrição"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Dia de Pagamento
              </p>
              <p className="text-sm font-medium">
                Dia {enrollment.paymentDay} de cada mês
              </p>
            </div>
          </div>
        </div>

        {/* Dados da Matrícula */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary">
            Dados da Matrícula
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Data de Início
              </p>
              <p className="text-sm font-medium">
                {enrollment.startDate
                  ? new Date(enrollment.startDate).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Data de Término
              </p>
              <p className="text-sm font-medium">
                {enrollment.endDate
                  ? new Date(enrollment.endDate).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : "-"}
              </p>
            </div>
            {enrollment.signature && (
              <div className="md:col-span-2 lg:col-span-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Status da Assinatura
                </p>
                <p className="text-sm text-green-600 font-medium">
                  ✓ Contrato já assinado
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Resumo Financeiro */}
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <h3 className="text-lg font-semibold text-primary">
            Resumo Financeiro
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Valor da Mensalidade
              </p>
              <p className="text-2xl font-bold text-green-600">
                {enrollment.plan?.price?.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Vencimento
              </p>
              <p className="text-lg font-semibold">
                Dia {enrollment.paymentDay} de cada mês
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
