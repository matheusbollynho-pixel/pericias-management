# 🏛️ INSTRUÇÕES DE CONFIGURAÇÃO - Sistema de Perícias

## 🚀 Passo a Passo para Funcionar

### 1️⃣ Criar Projeto no Supabase

1. Acesse: https://supabase.com
2. Clique em "New Project"
3. Escolha um nome (ex: "pericias-judiciais")
4. Anote a **senha do banco** que você criar

### 2️⃣ Executar o SQL no Supabase

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em "New Query"
3. Copie **TODO** o conteúdo do arquivo `supabase_schema.sql`
4. Cole no editor e clique em **RUN**
5. Aguarde aparecer "Success"

### 3️⃣ Pegar as Credenciais

1. No Supabase, vá em **Settings** (⚙️ no menu lateral)
2. Clique em **API**
3. Copie:
   - **Project URL** (algo como: https://xyzabc.supabase.co)
   - **anon public** key (chave longa começando com eyJ...)

### 4️⃣ Configurar o Projeto

1. Na pasta `pericias-management`, crie um arquivo `.env.local`
2. Cole isso dentro (substituindo pelos seus valores):

```env
VITE_SUPABASE_URL=https://sua-url-aqui.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

### 5️⃣ Instalar e Rodar

```bash
cd pericias-management
npm install
npm run dev
```

Acesse: **http://localhost:5173**

---

## ✅ O que o Sistema Faz

- ✅ **Cadastro completo** de perícias judiciais
- ✅ **Todos os campos** do formulário oficial
- ✅ **Registro de participantes** com falas
- ✅ **Avaliação** de insalubridade (mínimo/médio/máximo)
- ✅ **Avaliação** de periculosidade
- ✅ **Dashboard** com estatísticas
- ✅ **Busca** por processo, vara ou parte
- ✅ **Status** (Em andamento/Concluída/Arquivada)

---

## 📋 Próximos Passos (Futuros)

- [ ] Upload de fotos e documentos
- [ ] Geração de PDF do laudo
- [ ] Envio por WhatsApp/Email
- [ ] Sistema de autenticação
- [ ] Filtros avançados

---

## 🆘 Problemas Comuns

**Erro "Missing Supabase credentials":**
- Verifique se criou o arquivo `.env.local`
- Verifique se as variáveis começam com `VITE_`

**Erro "relation pericias does not exist":**
- Execute o SQL novamente no Supabase
- Verifique se está no projeto correto

**Página em branco:**
- Abra o Console do navegador (F12)
- Veja a mensagem de erro
- Geralmente é problema nas credenciais

---

**Desenvolvido para gestão profissional de perícias judiciais** ⚖️
