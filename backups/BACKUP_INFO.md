# Backup do Projeto - Gestão de Perícias

## Data do Backup
**27 de janeiro de 2026 - 05:38:35**

## Arquivo de Backup
- **Nome:** backup_2026-01-27_05-38-35.zip
- **Tamanho:** 54,97 MB
- **Localização:** `backups/backup_2026-01-27_05-38-35.zip`

## Conteúdo do Backup
Este backup contém a versão completa do projeto com:

### ✅ Funcionalidades Implementadas
- Sistema de autenticação com 2 usuários (Tarciana Ellen e Viemar Cruz)
- CRUD completo de perícias judiciais
- Formulário com múltiplas seções:
  - Informações do Processo e do Caso
  - Identificação das Partes (Requerente e Requerida)
  - Participantes da Perícia
  - Informações Adicionais do Processo (datas, horários, local)
  - Checklist de Documentação (12 documentos)
  - Descrição de Ambientes e Atividades
  - Classificação de Riscos Ergonômicos
  - Controle de EPIs
  - Metodologia e Procedimentos
  - Agentes Insalubres e Perigosos
  - Conclusões da Perícia
  - Observações Finais

- Geração de PDF com todos os dados
- Sistema de exclusão com validação de senha
- Interface responsiva com Tailwind CSS
- Integração com Supabase

### 📋 Versões do Software
- **React:** 18.3.1
- **TypeScript:** 5.6.2
- **Vite:** 6.4.1
- **Tailwind CSS:** 3.4.1
- **Supabase:** ^1.163.1
- **jsPDF:** ^2.5.2
- **html2canvas:** ^1.4.1

### 🗄️ Banco de Dados
Campo adicionado ao Supabase via migração:
- data_admissao (DATE)
- data_demissao (DATE)
- horario_pericia (TEXT)
- local_pericia (TEXT)
- funcao_reclamante (TEXT)
- descricao_ambientes (TEXT)
- descricao_atividades (TEXT)
- riscos_ergonomicos (TEXT)
- documentacao (JSONB)
- epis (JSONB)

### 🚀 Deployment
- **URL de Produção:** https://pericias-management.vercel.app
- **Plataforma:** Vercel
- **Última atualização:** 27 de janeiro de 2026

### 📁 Estrutura do Projeto
```
pericias-management/
├── src/
│   ├── components/
│   │   ├── DeleteConfirmModal.tsx
│   │   ├── LoginForm.tsx
│   │   └── PericiaForm.tsx
│   ├── hooks/
│   │   └── usePerencias.ts
│   ├── lib/
│   │   ├── pdfGenerator.ts
│   │   ├── supabase.ts
│   │   └── utils.ts
│   ├── pages/
│   │   └── Dashboard.tsx
│   ├── types/
│   │   └── pericia.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── backups/
├── vercel.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── package.json
└── supabase_migration_add_fields.sql
```

### ⚠️ Importante
Antes de fazer alterações importantes, sempre faça um novo backup!

## Como Restaurar
1. Extraia o arquivo .zip
2. Instale dependências: `npm install`
3. Inicie o servidor: `npm run dev`
4. Para produção: `npm run build` e `vercel --prod`

---
**Criado em:** 27 de janeiro de 2026 às 05:38:35
