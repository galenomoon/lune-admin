import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ContractTerms({ paymentDay }: { paymentDay: number }) {
  return (
    <Card className="w-full mb-8">
      <CardHeader>
        <CardTitle>Termos e Condições do Contrato</CardTitle>
        <CardDescription>
          Leia atentamente todas as cláusulas antes de confirmar sua matrícula.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] w-full">
          <div className="space-y-4 pr-4">
            <section>
              <h3 className="font-semibold text-lg mb-2">
                1. Objeto do Contrato
              </h3>
              <p className="text-sm text-muted-foreground">
                O presente contrato tem como objeto a prestação de serviços
                educacionais na área de dança, de acordo com a modalidade e o
                plano contratados pelo aluno.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">
                2. Vigência e Renovação
              </h3>
              <p className="text-sm text-muted-foreground">
                A vigência do contrato acompanha o plano selecionado e sua
                renovação ocorrerá de forma automática, salvo manifestação
                expressa do aluno com antecedência mínima de 30 (trinta) dias.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">3. Pagamento</h3>
              <p className="text-sm text-muted-foreground mb-2">
                As mensalidades deverão ser pagas até o dia {paymentDay} de cada
                mês. Em caso de atraso, o aluno deverá comunicar imediatamente a
                direção do Estúdio Lune.
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                Será aplicada multa moratória de 5% (cinco por cento) sobre o
                valor da mensalidade por dia de atraso. Após 15 (quinze) dias de
                inadimplência, a matrícula poderá ser suspensa.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">
                4. Frequência e Assiduidade
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                O aluno compromete-se a manter frequência regular nas aulas. A
                ausência, independentemente do motivo, não gera direito a
                abatimento, reposição ou reembolso da mensalidade.
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                Aulas canceladas por iniciativa do professor ou da instituição
                deverão ser repostas, respeitando a disponibilidade da grade e
                do estúdio.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">5. Cancelamento</h3>
              <p className="text-sm text-muted-foreground mb-2">
                O cancelamento deverá ser solicitado por escrito com
                antecedência mínima de 30 (trinta) dias. Na ausência desse aviso
                prévio, será cobrada a mensalidade subsequente.
              </p>
              <div className="text-sm text-muted-foreground space-y-2">
                <p className="font-medium">Multa por rescisão antecipada:</p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>
                    <strong>Plano Trimestral:</strong> multa equivalente a 1
                    (uma) mensalidade.
                  </li>
                  <li>
                    <strong>Plano Semestral:</strong> multa equivalente a 1,5
                    (uma e meia) mensalidade.
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">6. Recessos</h3>
              <p className="text-sm text-muted-foreground mb-2">
                O estúdio realizará recesso no final de cada ano. Para alunos
                com planos trimestrais e semestrais, o pagamento permanece
                inalterado, pois tais planos referem-se ao período contratado, e
                não ao número de aulas ofertadas mensalmente.
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                Alunos do plano mensal que optarem por cancelar antes do recesso
                não têm garantia de vaga no retorno, salvo se efetuarem a
                pré-matrícula ao final do ano.
              </p>
              <p className="text-sm text-muted-foreground">
                No meio do ano, o estúdio poderá realizar um recesso adicional
                de até 2 (duas) semanas.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">
                7. Responsabilidades
              </h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <div>
                  <p className="font-medium mb-1">Do aluno:</p>
                  <p>
                    O aluno é responsável por sua segurança e cuidados pessoais
                    durante as atividades. A instituição não se responsabiliza
                    por perdas ou danos de objetos pessoais.
                  </p>
                </div>
                <div>
                  <p className="font-medium mb-1">Do estúdio:</p>
                  <p>
                    O estúdio assegura a oferta de espaço adequado e
                    equipamentos necessários para o desenvolvimento das aulas.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">8. Apresentações</h3>
              <p className="text-sm text-muted-foreground mb-2">
                No meio do ano, será realizada uma apresentação obrigatória, a
                fim de acompanhar o progresso dos alunos. Alterações de turma
                poderão ocorrer conforme desempenho.
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                O uso do uniforme oficial é obrigatório para participação. A
                ausência do uniforme impossibilita a apresentação.
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                Ao final do ano, o estúdio promove seu espetáculo anual, de
                participação opcional.
              </p>
              <p className="text-sm text-muted-foreground">
                Alunos participantes deverão arcar com o figurino completo e
                taxa de participação. A não participação não impede a
                continuidade nas aulas.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">
                9. Equipe Competitiva Lune
              </h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p className="font-medium mb-1">
                  Responsabilidades do aluno integrante:
                </p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>
                    O aluno deverá realizar os pagamentos referentes às aulas de
                    sua modalidade, condicionamento físico e ensaios.
                  </li>
                  <li>
                    A presença é obrigatória em todas as atividades da equipe.
                  </li>
                  <li>
                    Após 3 (três) faltas não justificadas mediante comprovação,
                    o aluno poderá ser desligado da equipe.
                  </li>
                  <li>
                    O figurino para competições é de responsabilidade do aluno.
                  </li>
                  <li>
                    O uniforme completo é obrigatório para aulas e competições.
                  </li>
                  <li>
                    O aluno deverá manter conduta exemplar e desempenho
                    adequado.
                  </li>
                  <li>
                    Premiações em dinheiro não são previstas. Medalhas são
                    pessoais, enquanto troféus permanecem no estúdio.
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">10. Aceitação</h3>
              <p className="text-sm text-muted-foreground">
                Ao confirmar este contrato, o aluno declara ciência,
                concordância e plena aceitação de todas as condições aqui
                estabelecidas.
              </p>
            </section>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
