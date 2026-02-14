import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ContractEnrollmentData } from "@/api/contract";
import logoHeader from "@/assets/header-logo.svg";

// Função utilitária para gerar e compartilhar contrato
export const generateAndShareContract = async (
  enrollment: ContractEnrollmentData
) => {
  const formatDate = (date: string) => {
    // Verifica se a data está no formato "dd/MM/yyyy" (vindo de convertToContractData)
    const parts = date.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      const parsed = new Date(Number(year), Number(month) - 1, Number(day));
      if (!isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
      }
    }
    // Fallback para formato ISO ou outros
    const parsed = new Date(date);
    if (!isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    }
    return date;
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const generateContractHTML = () => {
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contrato de Matrícula - ${enrollment.plan?.name}</title>
         <p style="margin-top: 10px; font-size: 12px; color: #6b7280;">
            Data de geração: ${new Date().toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background: white;
            padding: 20px;
          }
          
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 20px;
          }
          
          .header h1 {
            font-size: 28px;
            color: #1f2937;
            margin-bottom: 10px;
          }
          
          .header p {
            color: #6b7280;
            font-size: 16px;
          }
          
          .section {
            margin-bottom: 25px;
            padding: 15px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            background: #f9fafb;
          }
          
          .section h2 {
            font-size: 18px;
            color: #1f2937;
            margin-bottom: 15px;
            border-bottom: 1px solid #d1d5db;
            padding-bottom: 5px;
          }
          
          .grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
          }
          
          .grid-2 {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }
          
          .full-width {
            grid-column: 1 / -1;
          }
          
          .field {
            margin-bottom: 10px;
          }
          
          .field-label {
            font-weight: 600;
            color: #6b7280;
            font-size: 13px;
            margin-bottom: 3px;
          }
          
          .field-value {
            color: #1f2937;
            font-size: 14px;
            font-weight: 500;
          }
          
          .highlight {
            background: #f9fafb;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
          }
          
          .highlight h3 {
            color: #1f2937;
            margin-bottom: 10px;
            font-size: 18px;
          }
          
          .price-value {
            font-size: 24px;
            font-weight: bold;
            color: #059669;
          }
          
          .signature-section {
            margin-top: 30px;
            padding: 20px;
            border: 2px solid #d1d5db;
            border-radius: 8px;
            text-align: center;
          }
          
          .signature-section h3 {
            color: #1f2937;
            margin-bottom: 15px;
          }
          
          .terms {
            margin-top: 30px;
            padding: 20px;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
          }
          
          .terms h2 {
            font-size: 20px;
            color: #1f2937;
            margin-bottom: 5px;
          }

          .terms .terms-subtitle {
            color: #6b7280;
            font-size: 14px;
            margin-bottom: 20px;
          }
          
          .terms section {
            margin-bottom: 16px;
          }

          .terms section h3 {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 8px;
          }

          .terms section p {
            font-size: 13px;
            color: #6b7280;
            margin-bottom: 6px;
            line-height: 1.5;
          }

          .terms section ul {
            padding-left: 20px;
            list-style-type: disc;
          }

          .terms section ul li {
            font-size: 13px;
            color: #6b7280;
            margin-bottom: 4px;
            line-height: 1.5;
          }
          
          .footer {
            margin-top: 40px;
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="${
            logoHeader.src
          }" alt="Lune - Escola de Dança" style="max-width: 220px; margin: 0 auto 20px; display: block;" />
          <h1>Contrato de Matrícula</h1>
          <p>Lune - Escola de Dança</p>
        </div>

        <!-- Detalhes da Matrícula -->
        <div class="section">
          <h2>Dados do Aluno</h2>
          <div class="grid">
            <div class="field">
              <div class="field-label">Nome Completo</div>
              <div class="field-value">${enrollment.student?.firstName} ${
      enrollment.student?.lastName
    }</div>
            </div>
            <div class="field">
              <div class="field-label">CPF</div>
              <div class="field-value">${
                enrollment.student?.cpf || "Não informado"
              }</div>
            </div>
            <div class="field">
              <div class="field-label">Telefone</div>
              <div class="field-value">${
                enrollment.student?.phone || "Não informado"
              }</div>
            </div>
            <div class="field">
              <div class="field-label">Email</div>
              <div class="field-value">${
                enrollment.student?.email || "Não informado"
              }</div>
            </div>
            ${
              enrollment.student?.instagram
                ? `
            <div class="field">
              <div class="field-label">Instagram</div>
              <div class="field-value">${enrollment.student.instagram}</div>
            </div>
            `
                : ""
            }
            ${
              enrollment.student?.obs
                ? `
            <div class="field full-width">
              <div class="field-label">Observações</div>
              <div class="field-value">${enrollment.student.obs}</div>
            </div>
            `
                : ""
            }
          </div>
        </div>

        <div class="section">
          <h2>Dados da Turma</h2>
          <div class="grid">
            <div class="field">
              <div class="field-label">Modalidade</div>
              <div class="field-value">${
                enrollment.class?.modality?.name || "Não informado"
              }</div>
            </div>
            <div class="field">
              <div class="field-label">Descrição</div>
              <div class="field-value">${
                enrollment.class?.description || "Não informado"
              }</div>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Dados do Plano</h2>
          <div class="grid">
            <div class="field">
              <div class="field-label">Nome do Plano</div>
              <div class="field-value">${
                enrollment.plan?.name || "Não informado"
              }</div>
            </div>
            <div class="field">
              <div class="field-label">Valor Mensal</div>
              <div class="field-value" style="color: #059669;">
                ${
                  enrollment.plan?.price
                    ? formatCurrency(enrollment.plan.price)
                    : "Não informado"
                }
              </div>
            </div>
            <div class="field">
              <div class="field-label">Descrição do Plano</div>
              <div class="field-value">${
                enrollment.plan?.description || "Sem descrição"
              }</div>
            </div>
            <div class="field">
              <div class="field-label">Dia de Pagamento</div>
              <div class="field-value">Dia ${
                enrollment.paymentDay || 5
              } de cada mês</div>
            </div>
          </div>
        </div>

        <!-- Dados da Matrícula comentado temporariamente (datas de início e término incorretas)
        <div class="section">
          <h2>Dados da Matrícula</h2>
          <div class="grid">
            <div class="field">
              <div class="field-label">Data de Início</div>
              <div class="field-value">${
                enrollment.startDate
                  ? formatDate(enrollment.startDate)
                  : "-"
              }</div>
            </div>
            <div class="field">
              <div class="field-label">Data de Término</div>
              <div class="field-value">${
                enrollment.endDate
                  ? formatDate(enrollment.endDate)
                  : "-"
              }</div>
            </div>
            ${
              enrollment.signature
                ? `
            <div class="field full-width">
              <div class="field-label">Status da Assinatura</div>
              <div class="field-value" style="color: #059669;">✓ Contrato já assinado</div>
            </div>
            `
                : ""
            }
          </div>
        </div>
        -->

        <div class="highlight">
          <h3>Resumo Financeiro</h3>
          <div class="grid-2">
            <div class="field">
              <div class="field-label">Valor da Mensalidade</div>
              <div class="field-value price-value">
                ${
                  enrollment.plan?.price
                    ? formatCurrency(enrollment.plan.price)
                    : "Não informado"
                }
              </div>
            </div>
            <div class="field">
              <div class="field-label">Vencimento</div>
              <div class="field-value" style="font-size: 16px; font-weight: 600;">
                Dia ${enrollment.paymentDay || 5} de cada mês
              </div>
            </div>
          </div>
        </div>

        <!-- Assinatura Digital -->
        <div class="signature-section">
          <h3>Assinatura Digital</h3>
          ${
            enrollment.signature
              ? `<div style="margin: 20px 0;">
              <p style="color: #059669; font-weight: 600; margin-bottom: 15px;">✓ Contrato assinado digitalmente</p>
                <img src="${enrollment.signature}" alt="Assinatura" style="max-width: 400px; height: 100px; border: 2px solid #d1d5db; border-radius: 8px; padding: 10px; background: white; display: inline-block;" />
            </div>`
              : '<p style="color: #dc2626;">⚠ Contrato pendente de assinatura</p>'
          }
         
        </div>

        <!-- Termos e Condições -->
        <div class="terms">
          <h2>Termos e Condições do Contrato</h2>
          <p class="terms-subtitle">Leia atentamente todas as cláusulas antes de confirmar sua matrícula.</p>

          <section>
            <h3>1. Objeto do Contrato</h3>
            <p>O presente contrato tem como objeto a prestação de serviços educacionais na área de dança, de acordo com a modalidade e o plano contratados pelo aluno.</p>
          </section>

          <section>
            <h3>2. Vigência e Renovação</h3>
            <p>A vigência do contrato acompanha o plano selecionado e sua renovação ocorrerá de forma automática, salvo manifestação expressa do aluno com antecedência mínima de 30 (trinta) dias.</p>
          </section>

          <section>
            <h3>3. Pagamento</h3>
            <p>As mensalidades deverão ser pagas até o dia ${
              enrollment.paymentDay || 5
            } de cada mês. Em caso de atraso, o aluno deverá comunicar imediatamente a direção do Estúdio Lune.</p>
            <p>Será aplicada multa moratória de 5% (cinco por cento) sobre o valor da mensalidade por dia de atraso. Após 15 (quinze) dias de inadimplência, a matrícula poderá ser suspensa.</p>
          </section>

          <section>
            <h3>4. Frequência e Assiduidade</h3>
            <p>O aluno compromete-se a manter frequência regular nas aulas. A ausência, independentemente do motivo, não gera direito a abatimento, reposição ou reembolso da mensalidade.</p>
            <p>Aulas canceladas por iniciativa do professor ou da instituição deverão ser repostas, respeitando a disponibilidade da grade e do estúdio.</p>
          </section>

          <section>
            <h3>5. Cancelamento</h3>
            <p>O cancelamento deverá ser solicitado por escrito com antecedência mínima de 30 (trinta) dias. Na ausência desse aviso prévio, será cobrada a mensalidade subsequente.</p>
            <p><strong>Multa por rescisão antecipada:</strong></p>
            <ul>
              <li><strong>Plano Trimestral:</strong> multa equivalente a 1 (uma) mensalidade.</li>
              <li><strong>Plano Semestral:</strong> multa equivalente a 1,5 (uma e meia) mensalidade.</li>
            </ul>
          </section>

          <section>
            <h3>6. Recessos</h3>
            <p>O estúdio realizará recesso no final de cada ano. Para alunos com planos trimestrais e semestrais, o pagamento permanece inalterado, pois tais planos referem-se ao período contratado, e não ao número de aulas ofertadas mensalmente.</p>
            <p>Alunos do plano mensal que optarem por cancelar antes do recesso não têm garantia de vaga no retorno, salvo se efetuarem a pré-matrícula ao final do ano.</p>
            <p>No meio do ano, o estúdio poderá realizar um recesso adicional de até 2 (duas) semanas.</p>
          </section>

          <section>
            <h3>7. Responsabilidades</h3>
            <p><strong>Do aluno:</strong></p>
            <p>O aluno é responsável por sua segurança e cuidados pessoais durante as atividades. A instituição não se responsabiliza por perdas ou danos de objetos pessoais.</p>
            <p><strong>Do estúdio:</strong></p>
            <p>O estúdio assegura a oferta de espaço adequado e equipamentos necessários para o desenvolvimento das aulas.</p>
          </section>

          <section>
            <h3>8. Apresentações</h3>
            <p>No meio do ano, será realizada uma apresentação obrigatória, a fim de acompanhar o progresso dos alunos. Alterações de turma poderão ocorrer conforme desempenho.</p>
            <p>O uso do uniforme oficial é obrigatório para participação. A ausência do uniforme impossibilita a apresentação.</p>
            <p>Ao final do ano, o estúdio promove seu espetáculo anual, de participação opcional.</p>
            <p>Alunos participantes deverão arcar com o figurino completo e taxa de participação. A não participação não impede a continuidade nas aulas.</p>
          </section>

          <section>
            <h3>9. Equipe Competitiva Lune</h3>
            <p><strong>Responsabilidades do aluno integrante:</strong></p>
            <ul>
              <li>O aluno deverá realizar os pagamentos referentes às aulas de sua modalidade, condicionamento físico e ensaios.</li>
              <li>A presença é obrigatória em todas as atividades da equipe.</li>
              <li>Após 3 (três) faltas não justificadas mediante comprovação, o aluno poderá ser desligado da equipe.</li>
              <li>O figurino para competições é de responsabilidade do aluno.</li>
              <li>O uniforme completo é obrigatório para aulas e competições.</li>
              <li>O aluno deverá manter conduta exemplar e desempenho adequado.</li>
              <li>Premiações em dinheiro não são previstas. Medalhas são pessoais, enquanto troféus permanecem no estúdio.</li>
            </ul>
          </section>

          <section>
            <h3>10. Aceitação</h3>
            <p>Ao confirmar este contrato, o aluno declara ciência, concordância e plena aceitação de todas as condições aqui estabelecidas.</p>
          </section>
        </div>

        <div class="footer">
          <p>Lune - Escola de Dança | Contrato gerado automaticamente</p>
          <p>Para dúvidas, entre em contato conosco</p>
        </div>
      </body>
      </html>
    `;
  };

  const generatePDF = async (): Promise<Blob> => {
    const htmlContent = generateContractHTML();

    try {
      // Método 1: Tentar com iframe para isolar CSS
      return await generatePDFWithIframe(htmlContent);
    } catch (error) {
      console.warn("Método iframe falhou, tentando método alternativo:", error);
      // Método 2: Fallback com div simples
      return await generatePDFWithDiv(htmlContent);
    }
  };

  const generatePDFWithIframe = async (htmlContent: string): Promise<Blob> => {
    // Criar um iframe para isolar o CSS
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.left = "-9999px";
    iframe.style.top = "0";
    iframe.style.width = "794px"; // A4 width in pixels
    iframe.style.height = "1123px"; // A4 height in pixels
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    try {
      // Aguardar o iframe carregar
      await new Promise((resolve) => {
        iframe.onload = resolve;
        iframe.src = "about:blank";
      });

      // Inserir o HTML no iframe
      const iframeDoc =
        iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc)
        throw new Error("Não foi possível acessar o documento do iframe");

      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();

      // Aguardar um pouco para o CSS ser aplicado
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Capturar o HTML como canvas
      const canvas = await html2canvas(iframeDoc.body, {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: 794,
        height: iframeDoc.body.scrollHeight,
      });

      // Remover o iframe
      document.body.removeChild(iframe);

      return createPDFFromCanvas(canvas);
    } catch (error) {
      document.body.removeChild(iframe);
      throw error;
    }
  };

  const generatePDFWithDiv = async (htmlContent: string): Promise<Blob> => {
    // Criar um elemento temporário para renderizar o HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    tempDiv.style.top = "0";
    tempDiv.style.width = "794px"; // A4 width in pixels
    tempDiv.style.backgroundColor = "#ffffff";
    tempDiv.style.fontFamily = "Arial, sans-serif";
    tempDiv.style.fontSize = "14px";
    tempDiv.style.lineHeight = "1.6";
    tempDiv.style.color = "#333333";
    document.body.appendChild(tempDiv);

    try {
      // Aguardar um pouco para o CSS ser aplicado
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Capturar o HTML como canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: 794,
        height: tempDiv.scrollHeight,
      });

      // Remover o elemento temporário
      document.body.removeChild(tempDiv);

      return createPDFFromCanvas(canvas);
    } catch (error) {
      document.body.removeChild(tempDiv);
      throw error;
    }
  };

  const createPDFFromCanvas = (canvas: HTMLCanvasElement): Blob => {
    // Criar PDF
    const pdf = new jsPDF("p", "mm", "a4");
    const imgData = canvas.toDataURL("image/png");

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Adicionar primeira página
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Adicionar páginas adicionais se necessário
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    return pdf.output("blob");
  };

  try {
    // Gerar o PDF apenas uma vez
    const pdfBlob = await generatePDF();
    const fileName = `contrato-matricula-${enrollment.student?.firstName}-${
      enrollment.student?.lastName
    }-${new Date().toISOString().split("T")[0]}.pdf`;

    // Verificar se o navegador suporta navigator.share com arquivos
    if (navigator.share && navigator.canShare) {
      const file = new File([pdfBlob], fileName, { type: "application/pdf" });

      const shareData = {
        title: "Contrato de Matrícula",
        text: `Contrato de matrícula de ${enrollment.student?.firstName} ${enrollment.student?.lastName}`,
        files: [file],
      };

      if (navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return;
      }
    }

    // Fallback: baixar o PDF
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    // Ignorar erro de cancelamento do usuário (AbortError)
    if (error instanceof Error && error.name === "AbortError") {
      return;
    }
    console.error("Erro ao compartilhar contrato:", error);
    throw error;
  }
};
