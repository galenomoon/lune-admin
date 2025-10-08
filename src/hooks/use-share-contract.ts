import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ContractEnrollmentData } from "@/api/contract";
import logoHeader from "@/assets/header-logo.svg";

// Função utilitária para gerar e compartilhar contrato
export const generateAndShareContract = async (
  enrollment: ContractEnrollmentData
) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const generateContractHTML = () => {
    console.log(enrollment);
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contrato de Matrícula - ${enrollment.plan?.name}</title>
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
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
          }
          
          .field {
            margin-bottom: 10px;
          }
          
          .field-label {
            font-weight: 600;
            color: #374151;
            font-size: 14px;
            margin-bottom: 3px;
          }
          
          .field-value {
            color: #1f2937;
            font-size: 14px;
          }
          
          .highlight {
            background: #fef3c7;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #f59e0b;
            margin: 20px 0;
          }
          
          .highlight h3 {
            color: #92400e;
            margin-bottom: 10px;
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
            background: #f3f4f6;
            border-radius: 8px;
          }
          
          .terms h3 {
            color: #1f2937;
            margin-bottom: 15px;
          }
          
          .terms ul {
            padding-left: 20px;
          }
          
          .terms li {
            margin-bottom: 8px;
            color: #374151;
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
              <div class="field-label">Data de Nascimento</div>
              <div class="field-value">${
                enrollment.student?.birthDate
                  ? formatDate(enrollment.student.birthDate)
                  : "Não informado"
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
          </div>
          ${
            enrollment.student?.obs
              ? `
          <div class="field">
            <div class="field-label">Observações</div>
            <div class="field-value">${enrollment.student.obs}</div>
          </div>
          `
              : ""
          }
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
              <div class="field-value">${
                enrollment.plan?.price
                  ? formatCurrency(enrollment.plan.price)
                  : "Não informado"
              }</div>
            </div>
            <div class="field">
              <div class="field-label">Dia de Pagamento</div>
              <div class="field-value">Dia ${
                enrollment.paymentDay || 5
              } de cada mês</div>
            </div>
          </div>
          ${
            enrollment.plan?.description
              ? `
          <div class="field">
            <div class="field-label">Descrição do Plano</div>
            <div class="field-value">${enrollment.plan.description}</div>
          </div>
          `
              : ""
          }
        </div>

        <div class="section">
          <h2>Dados da Matrícula</h2>
          <div class="grid">
            <div class="field">
              <div class="field-label">Data de Início</div>
              <div class="field-value">${
                enrollment.startDate
                  ? formatDate(enrollment.startDate)
                  : "Não informado"
              }</div>
            </div>
            <div class="field">
              <div class="field-label">Data de Término</div>
              <div class="field-value">${
                enrollment.endDate
                  ? formatDate(enrollment.endDate)
                  : "Não informado"
              }</div>
            </div>
            <div class="field">
              <div class="field-label">Status</div>
              <div class="field-value">${
                enrollment.status === "active"
                  ? "Ativo"
                  : enrollment.status === "pending"
                  ? "Pendente"
                  : "Cancelado"
              }</div>
            </div>
          </div>
        </div>

        <div class="highlight">
          <h3>Resumo Financeiro</h3>
          <div class="grid">
            <div class="field">
              <div class="field-label">Valor da Mensalidade</div>
              <div class="field-value" style="font-size: 18px; font-weight: bold; color: #059669;">
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

        <div class="signature-section">
          <h3>Assinatura Digital</h3>
          ${
            enrollment.signature
              ? `<div style="margin: 20px 0;">
              <p style="color: #059669; font-weight: 600; margin-bottom: 15px;">✓ Contrato assinado digitalmente</p>
                <img src="${enrollment.signature}" alt="Assinatura" style="max-width: 400px; height: 100px; display: block; border: 2px solid #d1d5db; border-radius: 8px; padding: 10px; background: white; display: inline-block;" />
            </div>`
              : '<p style="color: #dc2626;">⚠ Contrato pendente de assinatura</p>'
          }
          <p style="margin-top: 10px; font-size: 12px; color: #6b7280;">
            Data de geração: ${new Date().toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div class="terms">
          <h3>Termos e Condições</h3>
          <ul>
            <li>O pagamento deve ser efetuado até o dia ${
              enrollment.paymentDay || 5
            } de cada mês.</li>
            <li>Em caso de atraso no pagamento, será cobrada multa de 2% ao mês.</li>
            <li>O cancelamento deve ser solicitado com 30 dias de antecedência.</li>
            <li>Faltas não justificadas não dão direito a reposição de aulas.</li>
            <li>O aluno deve respeitar as normas de convivência da escola.</li>
            <li>Este contrato é válido pelo período especificado nas datas de início e término.</li>
            <li>A renovação do contrato é automática, desde que o aluno continue matriculado na escola.</li>
          </ul>
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
    // Verificar se o navegador suporta navigator.share
    if (navigator.share) {
      const pdfBlob = await generatePDF();
      const fileName = `contrato-matricula-${enrollment.student?.firstName}-${
        enrollment.student?.lastName
      }-${new Date().toISOString().split("T")[0]}.pdf`;

      const file = new File([pdfBlob], fileName, { type: "application/pdf" });

      await navigator.share({
        title: "Contrato de Matrícula",
        text: `Contrato de matrícula de ${enrollment.student?.firstName} ${enrollment.student?.lastName}`,
        files: [file],
      });
    } else {
      // Fallback: baixar o PDF
      const pdfBlob = await generatePDF();
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `contrato-matricula-${enrollment.student?.firstName}-${
        enrollment.student?.lastName
      }-${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error("Erro ao compartilhar contrato:", error);
    throw error;
  }
};
