import jsPDF from 'jspdf';
import type { Pericia } from '../types/pericia';

export const generatePericiaPDF = (pericia: Pericia) => {
  console.log('=== DADOS DA PERÍCIA PARA PDF ===', pericia);
  console.log('Campos preenchidos:', Object.keys(pericia).filter(k => pericia[k as keyof Pericia]));
  
  const doc = new jsPDF();
  const lineHeight = 7;
  let yPos = 20;

  const checkPageBreak = () => {
    // Mantém margem inferior maior para não cortar linhas longas
    if (yPos > 260) {
      doc.addPage();
      yPos = 20;
    }
  };

  const addSectionTitle = (title: string) => {
    checkPageBreak();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(title, 20, yPos);
    yPos += lineHeight + 3;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
  };

  const addField = (label: string, value: string | undefined | null | boolean) => {
    if (!value && value !== false) return; // Só pula se for vazio/null/undefined, mas não se for false
    checkPageBreak();
    const text = `${label}: ${value}`;
    const splitText = doc.splitTextToSize(text, 170);
    doc.text(splitText, 20, yPos);
    yPos += (splitText.length * 5) + 2;
  };

  // Header
  doc.setFontSize(18);
  doc.text('Relatório de Perícia Judicial', 105, yPos, { align: 'center' });
  yPos += 15;
  doc.setFontSize(10);
  doc.text('Insalubridade e Periculosidade', 105, yPos, { align: 'center' });
  yPos += 15;

  // I. Informações do Processo e do Caso
  addSectionTitle('I. Informações do Processo e do Caso');
  addField('Processo nº', pericia.processo_numero);
  addField('Vara', pericia.vara);
  addField('Comarca', pericia.comarca);
  addField('Status', pericia.status.toUpperCase());
  addField('Resumo do Caso', pericia.resumo_caso);
  
  // Objetivos da Perícia
  if (pericia.objetivo_determinar_insalubridade || pericia.objetivo_determinar_periculosidade || pericia.objetivo_avaliar_exposicao || pericia.objetivo_outros) {
    yPos += 3;
    doc.setFont('helvetica', 'bold');
    doc.text('Objetivos da Perícia:', 20, yPos);
    yPos += 5;
    doc.setFont('helvetica', 'normal');
    if (pericia.objetivo_determinar_insalubridade) {
      doc.text('• Determinar a existência de insalubridade', 25, yPos);
      yPos += 5;
    }
    if (pericia.objetivo_determinar_periculosidade) {
      doc.text('• Determinar a existência de periculosidade', 25, yPos);
      yPos += 5;
    }
    if (pericia.objetivo_avaliar_exposicao) {
      doc.text('• Apreciar os níveis de exposição a agentes insalubres ou perigosos', 25, yPos);
      yPos += 5;
    }
    if (pericia.objetivo_outros) {
      const splitText = doc.splitTextToSize(`• ${pericia.objetivo_outros}`, 165);
      doc.text(splitText, 25, yPos);
      yPos += (splitText.length * 5);
    }
  }
  yPos += 5;

  // II. Identificação das Partes
  addSectionTitle('II. Identificação das Partes');
  
  // Requerente
  doc.setFont('helvetica', 'bold');
  doc.text('Parte Requerente:', 20, yPos);
  yPos += 5;
  doc.setFont('helvetica', 'normal');
  addField('Nome', pericia.parte_requerente);
  addField('Cargo/Função', pericia.requerente_cargo);
  addField('Setor/Departamento', pericia.requerente_setor);
  addField('Endereço', pericia.requerente_endereco);
  addField('Telefone', pericia.requerente_telefone);
  addField('E-mail', pericia.requerente_email);
  
  yPos += 3;
  
  // Requerida
  doc.setFont('helvetica', 'bold');
  doc.text('Parte Requerida:', 20, yPos);
  yPos += 5;
  doc.setFont('helvetica', 'normal');
  addField('Nome', pericia.parte_requerida);
  addField('Cargo/Função', pericia.requerida_cargo);
  addField('Setor/Departamento', pericia.requerida_setor);
  addField('Endereço', pericia.requerida_endereco);
  addField('Telefone', pericia.requerida_telefone);
  addField('E-mail', pericia.requerida_email);
  yPos += 5;

  // III. Informações do Perito
  addSectionTitle('III. Informações do Perito');
  addField('Nome', pericia.perito_nome);
  addField('Especialidade', pericia.perito_especialidade);
  addField('Profissão e Formação', pericia.perito_profissao_formacao);
  addField('Experiência', pericia.perito_experiencia);
  addField('Data da Nomeação', pericia.data_nomeacao);
  yPos += 5;

  // IV. Metodologia e Procedimentos
  addSectionTitle('IV. Metodologia e Procedimentos');
  
  if (pericia.metodo_inspecao_local || pericia.metodo_medicoes_ambientais || pericia.metodo_analise_documentos || pericia.metodo_entrevistas || pericia.metodo_outros) {
    doc.setFont('helvetica', 'bold');
    doc.text('Métodos Utilizados:', 20, yPos);
    yPos += 5;
    doc.setFont('helvetica', 'normal');
    if (pericia.metodo_inspecao_local) {
      doc.text('• Inspeção do local de trabalho', 25, yPos);
      yPos += 5;
    }
    if (pericia.metodo_medicoes_ambientais) {
      doc.text('• Medições e avaliações ambientais', 25, yPos);
      yPos += 5;
    }
    if (pericia.metodo_analise_documentos) {
      doc.text('• Análise de documentos', 25, yPos);
      yPos += 5;
    }
    if (pericia.metodo_entrevistas) {
      doc.text('• Entrevistas com trabalhadores', 25, yPos);
      yPos += 5;
    }
    if (pericia.metodo_outros) {
      const splitText = doc.splitTextToSize(`• ${pericia.metodo_outros}`, 165);
      doc.text(splitText, 25, yPos);
      yPos += (splitText.length * 5);
    }
    yPos += 3;
  }
  
  addField('Procedimentos de Avaliação', pericia.procedimentos_avaliacao);
  yPos += 5;

  // V. Ambiente de Trabalho Inspecionado
  addSectionTitle('V. Ambiente de Trabalho Inspecionado');
  addField('Data da Perícia', pericia.data_pericia);
  addField('Setor/Departamento', pericia.setor);
  addField('Local Inspecionado', pericia.local_inspecionado);
  addField('Atividade Realizada', pericia.atividade_realizada);
  yPos += 5;

  // VI. Agentes Insalubres e Perigosos
  addSectionTitle('VI. Agentes Insalubres e Perigosos');
  addField('Agentes Químicos', pericia.agentes_quimicos);
  addField('Agentes Físicos', pericia.agentes_fisicos);
  addField('Agentes Biológicos', pericia.agentes_biologicos);
  addField('Condições Perigosas', pericia.condicoes_perigosas);
  yPos += 5;

  // VII. Conclusões da Perícia
  addSectionTitle('VII. Conclusões da Perícia');
  if (pericia.existe_insalubridade) {
    addField('Insalubridade', `SIM - ${pericia.grau_insalubridade?.toUpperCase()}`);
  } else {
    addField('Insalubridade', 'NÃO CONSTATADA');
  }
  if (pericia.existe_periculosidade) {
    addField('Periculosidade', `SIM - ${pericia.risco_periculosidade || 'Risco identificado'}`);
  } else {
    addField('Periculosidade', 'NÃO CONSTATADA');
  }
  addField('Parecer Técnico', pericia.parecer_perito);
  yPos += 5;

  // VIII. Participantes da Perícia
  if (pericia.participantes && pericia.participantes.length > 0) {
    addSectionTitle('VIII. Participantes da Perícia');
    pericia.participantes.forEach((part, index) => {
      checkPageBreak();
      doc.setFont('helvetica', 'bold');
      doc.text(`Participante #${index + 1}`, 20, yPos);
      yPos += 5;
      doc.setFont('helvetica', 'normal');
      if (part.nome) {
        doc.text(`Nome: ${part.nome}`, 25, yPos);
        yPos += 5;
      }
      if (part.cargo) {
        doc.text(`Cargo: ${part.cargo}`, 25, yPos);
        yPos += 5;
      }
      if (part.tipo) {
        doc.text(`Tipo: ${part.tipo}`, 25, yPos);
        yPos += 5;
      }
      if (part.falas) {
        const falasText = `Falas: ${part.falas}`;
        const splitFalas = doc.splitTextToSize(falasText, 160);
        doc.text(splitFalas, 25, yPos);
        yPos += (splitFalas.length * 5) + 2;
      }
      yPos += 3;
    });
    yPos += 2;
  }

  // IX. Observações Finais
  if (pericia.observacoes_finais) {
    addSectionTitle('IX. Observações Finais');
    addField('', pericia.observacoes_finais);
    yPos += 5;
  }

  // Footer / Assinatura
  checkPageBreak();
  yPos += 15;
  checkPageBreak();
  doc.line(60, yPos, 150, yPos);
  yPos += 5;
  doc.setFontSize(10);
  doc.text(pericia.perito_nome, 105, yPos, { align: 'center' });
  yPos += 5;
  doc.text(`${pericia.perito_especialidade}`, 105, yPos, { align: 'center' });

  doc.save(`Pericia_${pericia.processo_numero.replace(/\//g, '-')}.pdf`);
};

// Updated 14:33:16
