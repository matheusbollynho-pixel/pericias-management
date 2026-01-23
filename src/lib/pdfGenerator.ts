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
  // Perito Responsável
  if (pericia.perito_nome) {
    doc.setFont('helvetica', 'bold');
    doc.text(`Perito Responsável: ${pericia.perito_nome}`, 20, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += 10;
  }

  // I. Informações do Processo e do Caso
  addSectionTitle('I. Informações do Processo e do Caso');
  addField('Processo nº', pericia.processo_numero);
  addField('Vara', pericia.vara);
  addField('Comarca', pericia.comarca);
  addField('Status', pericia.status?.toUpperCase());
  addField('Resumo do Caso', pericia.resumo_caso);
  
  // II. Participantes da Perícia
  if (pericia.participantes && pericia.participantes.length > 0) {
    addSectionTitle('II. Participantes da Perícia');
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

  // III. Objetivo da Perícia
  if (pericia.objetivo_determinar_insalubridade || pericia.objetivo_determinar_periculosidade || pericia.objetivo_avaliar_exposicao || pericia.objetivo_outros) {
    addSectionTitle('III. Objetivo da Perícia');
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
    yPos += 5;
  }

  // IV. Identificação das Partes
  // IV. Identificação das Partes
  const hasRequerenteData = pericia.parte_requerente || pericia.requerente_cargo || pericia.requerente_setor || pericia.requerente_endereco || pericia.requerente_telefone || pericia.requerente_email;
  const hasRequeridaData = pericia.parte_requerida || pericia.requerida_cargo || pericia.requerida_setor || pericia.requerida_endereco || pericia.requerida_telefone || pericia.requerida_email;
  
  if (hasRequerenteData || hasRequeridaData) {
    addSectionTitle('IV. Identificação das Partes');
    
    // Requerente
    if (hasRequerenteData) {
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
    }
    
    // Requerida
    if (hasRequeridaData) {
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
      yPos += 3;
    }
    yPos += 2;
  }

  // V. Metodologia e Procedimentos
  const hasMetodologia = pericia.metodo_inspecao_local || pericia.metodo_medicoes_ambientais || pericia.metodo_analise_documentos || pericia.metodo_entrevistas || pericia.metodo_outros || pericia.procedimentos_avaliacao;
  
  if (hasMetodologia) {
    addSectionTitle('V. Metodologia e Procedimentos');
    
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
  }

  // V. Agentes Insalubres e Perigosos
  const hasAgentes = pericia.agentes_quimicos || pericia.agentes_fisicos || pericia.agentes_biologicos || pericia.condicoes_perigosas;
  
  if (hasAgentes) {
    addSectionTitle('V. Agentes Insalubres e Perigosos');
    addField('Agentes Químicos', pericia.agentes_quimicos);
    addField('Agentes Físicos', pericia.agentes_fisicos);
    addField('Agentes Biológicos', pericia.agentes_biologicos);
    addField('Condições Perigosas', pericia.condicoes_perigosas);
    yPos += 5;
  }

  // VI. Conclusões da Perícia
  const hasConclusoes = pericia.existe_insalubridade === true || pericia.existe_periculosidade === true || !!pericia.parecer_perito;
  
  if (hasConclusoes) {
    addSectionTitle('VI. Conclusões da Perícia');
    if (pericia.existe_insalubridade === true) {
      addField('Insalubridade', `SIM - ${pericia.grau_insalubridade?.toUpperCase()}`);
    }
    if (pericia.existe_periculosidade === true) {
      addField('Periculosidade', `SIM - ${pericia.risco_periculosidade || 'Risco identificado'}`);
    }
    addField('Parecer Técnico', pericia.parecer_perito);
    yPos += 5;
  }

  // VII. Observações Finais
  if (pericia.observacoes_finais) {
    addSectionTitle('VII. Observações Finais');
    addField('', pericia.observacoes_finais);
    yPos += 5;
  }

  // Footer
  checkPageBreak();
  yPos += 15;
  doc.setFontSize(10);
  doc.text('Relatório gerado por sistema', 105, yPos, { align: 'center' });

  doc.save(`Pericia_${(pericia.processo_numero || 'documento').replace(/\//g, '-')}.pdf`);
};

// Updated 14:33:16
