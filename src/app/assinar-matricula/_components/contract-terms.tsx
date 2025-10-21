import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ContractTerms({paymentDay}: {paymentDay: number}) {
  return (
    <Card className="w-full mb-8">
      <CardHeader>
        <CardTitle>Termos e Condições do Contrato</CardTitle>
        <CardDescription>
          Leia atentamente os termos antes de assinar sua matrícula
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full">
          <div className="space-y-4 pr-4">
            <section>
              <h3 className="font-semibold text-lg mb-2">1. Objeto do Contrato</h3>
              <p className="text-sm text-muted-foreground">
                Este contrato tem por objeto a prestação de serviços de ensino de dança, 
                conforme modalidade e plano escolhidos pelo aluno.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">2. Duração e Renovação</h3>
              <p className="text-sm text-muted-foreground">
                O contrato terá duração conforme o plano escolhido e será renovado 
                automaticamente, salvo manifestação contrária do aluno com antecedência 
                mínima de 30 dias.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">3. Pagamento</h3>
              <p className="text-sm text-muted-foreground">
                O pagamento das mensalidades deve ser efetuado até o dia {paymentDay} de cada mês. 
                Em caso de atraso superior a 15 dias, o aluno poderá ter suas aulas suspensas.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">4. Frequência e Presença</h3>
              <p className="text-sm text-muted-foreground">
                O aluno compromete-se a frequentar regularmente as aulas. A falta de 
                frequência não gera direito a desconto ou reembolso das mensalidades.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">5. Cancelamento</h3>
              <p className="text-sm text-muted-foreground">
                O cancelamento do contrato deve ser solicitado com antecedência mínima 
                de 30 dias, mediante comunicação escrita à administração.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">6. Responsabilidades</h3>
              <p className="text-sm text-muted-foreground">
                O aluno é responsável por sua segurança e integridade física durante as aulas. 
                A escola não se responsabiliza por objetos pessoais deixados nas dependências.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">7. Aceitação</h3>
              <p className="text-sm text-muted-foreground">
                Ao assinar este contrato, o aluno declara ter lido, compreendido e aceito 
                todos os termos e condições aqui estabelecidos.
              </p>
            </section>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
