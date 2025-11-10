# 🚀 Guia de Configuração do Supabase

Este guia vai te ajudar a configurar o banco de dados Supabase para o sistema de gestão hoteleira.

---

## 📋 Índice

1. [Criar Projeto no Supabase](#1-criar-projeto-no-supabase)
2. [Criar Tabelas no Banco de Dados](#2-criar-tabelas-no-banco-de-dados)
3. [Configurar Row Level Security (RLS)](#3-configurar-row-level-security-rls)
4. [Configurar Variáveis de Ambiente](#4-configurar-variáveis-de-ambiente)
5. [Testar Conexão](#5-testar-conexão)

---

## 1. Criar Projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em **"New Project"**
4. Preencha:
   - **Name**: `dsi-ufrpe-hotel` (ou nome de sua preferência)
   - **Database Password**: Crie uma senha forte (ANOTE!)
   - **Region**: Escolha a mais próxima (ex: `South America (São Paulo)`)
5. Clique em **"Create new project"**
6. Aguarde alguns minutos até o projeto estar pronto

---

## 2. Criar Tabelas no Banco de Dados

### 2.1. Acessar SQL Editor

1. No menu lateral, clique em **"SQL Editor"**
2. Clique em **"New query"**

### 2.2. Executar Scripts SQL

Copie e cole TODOS os scripts abaixo na ordem apresentada. Execute cada bloco clicando em **"Run"** ou pressionando `Ctrl+Enter`.

#### **Script 1: Criar Tabela de Quartos**

```sql
CREATE TABLE quartos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_quarto VARCHAR(10) NOT NULL UNIQUE,
  tipo VARCHAR(50) NOT NULL,
  capacidade INTEGER NOT NULL,
  preco_diario DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'Disponível',
  foto_quarto TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **Script 2: Criar Tabela de Clientes**

```sql
CREATE TABLE clientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_completo VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) NOT NULL UNIQUE,
  email VARCHAR(255),
  telefone VARCHAR(20),
  data_nascimento DATE,
  endereco TEXT,
  cidade VARCHAR(100),
  estado VARCHAR(2),
  pais VARCHAR(100) DEFAULT 'Brasil',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **Script 3: Criar Tabela de Funcionários**

```sql
CREATE TABLE funcionarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_completo VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  telefone VARCHAR(20),
  cargo VARCHAR(100) NOT NULL,
  salario DECIMAL(10, 2),
  data_admissao DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'Ativo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **Script 4: Criar Tabela de Reservas**

```sql
CREATE TABLE reservas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  id_cliente UUID REFERENCES clientes(id) ON DELETE CASCADE,
  id_quarto UUID REFERENCES quartos(id) ON DELETE CASCADE,
  data_checkin DATE NOT NULL,
  data_checkout DATE NOT NULL,
  numero_hospedes INTEGER NOT NULL,
  valor_total DECIMAL(10, 2),
  status VARCHAR(20) DEFAULT 'Confirmada',
  observacoes TEXT,
  checkin_realizado_em TIMESTAMP WITH TIME ZONE,
  checkout_realizado_em TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **Script 5: Criar Tabela de Atividades Recreativas**

```sql
CREATE TABLE atividades_recreativas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  data_hora TIMESTAMP WITH TIME ZONE NOT NULL,
  local VARCHAR(255),
  capacidade_maxima INTEGER,
  preco DECIMAL(10, 2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'Agendada',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **Script 6: Criar Função para Atualizar `updated_at`**

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
```

#### **Script 7: Criar Triggers para Atualização Automática**

```sql
-- Trigger para quartos
CREATE TRIGGER update_quartos_updated_at 
BEFORE UPDATE ON quartos 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Trigger para clientes
CREATE TRIGGER update_clientes_updated_at 
BEFORE UPDATE ON clientes 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Trigger para funcionarios
CREATE TRIGGER update_funcionarios_updated_at 
BEFORE UPDATE ON funcionarios 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Trigger para reservas
CREATE TRIGGER update_reservas_updated_at 
BEFORE UPDATE ON reservas 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Trigger para atividades
CREATE TRIGGER update_atividades_updated_at 
BEFORE UPDATE ON atividades_recreativas 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();
```

#### **Script 8: Inserir Dados de Teste (Opcional)**

```sql
-- Quartos de exemplo
INSERT INTO quartos (numero_quarto, tipo, capacidade, preco_diario, status) VALUES
  ('101', 'Solteiro', 1, 150.00, 'Disponível'),
  ('102', 'Casal', 2, 200.00, 'Disponível'),
  ('103', 'Duplo', 2, 220.00, 'Disponível'),
  ('104', 'Família', 4, 350.00, 'Disponível'),
  ('201', 'Suíte', 2, 450.00, 'Disponível');

-- Clientes de exemplo
INSERT INTO clientes (nome_completo, cpf, email, telefone, cidade, estado) VALUES
  ('João Silva', '123.456.789-00', 'joao@email.com', '(81) 99999-9999', 'Recife', 'PE'),
  ('Maria Santos', '987.654.321-00', 'maria@email.com', '(81) 98888-8888', 'Olinda', 'PE');

-- Atividades de exemplo
INSERT INTO atividades_recreativas (nome, descricao, data_hora, local, capacidade_maxima, preco) VALUES
  ('Yoga na Praia', 'Sessão matinal de yoga', '2024-12-20 07:00:00+00', 'Praia', 20, 0),
  ('Aula de Surf', 'Aula para iniciantes', '2024-12-20 10:00:00+00', 'Praia', 10, 50.00);
```

---

## 3. Configurar Row Level Security (RLS)

### 3.1. Criar Nova Query no SQL Editor

Cole e execute o script abaixo:

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE quartos ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE atividades_recreativas ENABLE ROW LEVEL SECURITY;

-- Políticas para QUARTOS
CREATE POLICY "Permitir leitura autenticada - quartos" 
ON quartos FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Permitir criação autenticada - quartos" 
ON quartos FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Permitir atualização autenticada - quartos" 
ON quartos FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Permitir exclusão autenticada - quartos" 
ON quartos FOR DELETE 
TO authenticated 
USING (true);

-- Políticas para CLIENTES
CREATE POLICY "Permitir leitura autenticada - clientes" 
ON clientes FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Permitir criação autenticada - clientes" 
ON clientes FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Permitir atualização autenticada - clientes" 
ON clientes FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Permitir exclusão autenticada - clientes" 
ON clientes FOR DELETE 
TO authenticated 
USING (true);

-- Políticas para FUNCIONARIOS
CREATE POLICY "Permitir leitura autenticada - funcionarios" 
ON funcionarios FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Permitir criação autenticada - funcionarios" 
ON funcionarios FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Permitir atualização autenticada - funcionarios" 
ON funcionarios FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Permitir exclusão autenticada - funcionarios" 
ON funcionarios FOR DELETE 
TO authenticated 
USING (true);

-- Políticas para RESERVAS
CREATE POLICY "Permitir leitura autenticada - reservas" 
ON reservas FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Permitir criação autenticada - reservas" 
ON reservas FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Permitir atualização autenticada - reservas" 
ON reservas FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Permitir exclusão autenticada - reservas" 
ON reservas FOR DELETE 
TO authenticated 
USING (true);

-- Políticas para ATIVIDADES
CREATE POLICY "Permitir leitura autenticada - atividades" 
ON atividades_recreativas FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Permitir criação autenticada - atividades" 
ON atividades_recreativas FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Permitir atualização autenticada - atividades" 
ON atividades_recreativas FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Permitir exclusão autenticada - atividades" 
ON atividades_recreativas FOR DELETE 
TO authenticated 
USING (true);
```

---

## 4. Configurar Variáveis de Ambiente

### 4.1. Obter Credenciais do Projeto

1. No Supabase, vá em **"Project Settings"** (ícone de engrenagem no menu lateral)
2. Clique em **"API"**
3. Copie os seguintes valores:
   - **Project URL** (algo como `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (na seção "Project API keys")

### 4.2. Criar/Atualizar Arquivo `.env`

Na raiz do projeto `dsi-ufrpe-app`, crie ou edite o arquivo `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **IMPORTANTE**: 
- Substitua os valores pelos dados do SEU projeto
- Nunca compartilhe essas credenciais publicamente
- Adicione `.env` ao `.gitignore`

### 4.3. Verificar `.gitignore`

Adicione ao arquivo `.gitignore`:

```
.env
.env.local
```

---

## 5. Testar Conexão

### 5.1. Verificar Instalação do Supabase

No terminal, execute:

```bash
npm list @supabase/supabase-js
```

Deve mostrar a versão `2.76.1` ou superior.

### 5.2. Testar no App

1. Inicie o app:
   ```bash
   npx expo start
   ```

2. Faça login com um usuário existente

3. Acesse qualquer tela de CRUD (ex: Quartos)

4. Tente listar, criar, editar ou excluir um registro

### 5.3. Verificar Logs no Supabase

1. Vá em **"Table Editor"** no Supabase
2. Selecione a tabela `quartos` (ou outra)
3. Verifique se os dados aparecem

---

## 🔍 Verificação de Tabelas

Após criar todas as tabelas, você pode verificar se estão corretas:

1. No Supabase, vá em **"Table Editor"**
2. Você deve ver 5 tabelas:
   - ✅ `quartos`
   - ✅ `clientes`
   - ✅ `funcionarios`
   - ✅ `reservas`
   - ✅ `atividades_recreativas`

3. Clique em cada tabela e veja as colunas criadas

---

## ⚠️ Troubleshooting

### Erro: "relation does not exist"
- **Causa**: Tabela não foi criada
- **Solução**: Execute novamente o script SQL da tabela

### Erro: "permission denied"
- **Causa**: RLS não configurado corretamente
- **Solução**: Execute o Script 3 (RLS) novamente

### Erro: "JWT expired" ou "Invalid JWT"
- **Causa**: Sessão expirada
- **Solução**: Faça logout e login novamente no app

### App não conecta ao Supabase
- **Causa**: Variáveis de ambiente incorretas
- **Solução**: Verifique `.env` e reinicie o app com `npx expo start -c`

### Dados não aparecem
- **Causa**: RLS bloqueando acesso
- **Solução**: Verifique se o usuário está autenticado e se as políticas RLS existem

---

## 📚 Recursos Adicionais

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

## ✅ Checklist Final

- [ ] Projeto criado no Supabase
- [ ] Todas as 5 tabelas criadas
- [ ] Triggers de `updated_at` configurados
- [ ] RLS habilitado e políticas criadas
- [ ] Dados de teste inseridos (opcional)
- [ ] Arquivo `.env` configurado
- [ ] `.env` adicionado ao `.gitignore`
- [ ] App reiniciado com novas credenciais
- [ ] Teste de CRUD funcionando

---

**Pronto! Seu banco de dados Supabase está configurado e pronto para uso! 🎉**
