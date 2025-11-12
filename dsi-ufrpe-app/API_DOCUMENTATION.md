# 📚 Documentação da API - Sistema de Gestão Hoteleira

## 🔗 Supabase Configuration

**URL do Projeto**: Definido em `.env` como `EXPO_PUBLIC_SUPABASE_URL`  
**Anon Key**: Definido em `.env` como `EXPO_PUBLIC_SUPABASE_ANON_KEY`

---

## 📋 Estrutura das Tabelas

### **1. Tabela: `quartos`**

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

### **2. Tabela: `clientes`**

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

### **3. Tabela: `funcionarios`**

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

### **4. Tabela: `reservas`**

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

### **5. Tabela: `atividades_recreativas`**

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

---

## 🔐 Row Level Security (RLS)

Para cada tabela, aplicar as seguintes políticas:

```sql
-- Habilitar RLS
ALTER TABLE [nome_tabela] ENABLE ROW LEVEL SECURITY;

-- Política de SELECT (leitura)
CREATE POLICY "Permitir leitura autenticada" 
ON [nome_tabela] FOR SELECT 
TO authenticated 
USING (true);

-- Política de INSERT (criação)
CREATE POLICY "Permitir criação autenticada" 
ON [nome_tabela] FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Política de UPDATE (atualização)
CREATE POLICY "Permitir atualização autenticada" 
ON [nome_tabela] FOR UPDATE 
TO authenticated 
USING (true);

-- Política de DELETE (exclusão)
CREATE POLICY "Permitir exclusão autenticada" 
ON [nome_tabela] FOR DELETE 
TO authenticated 
USING (true);
```

---

## 🛠️ Endpoints (Operações via Supabase Client)

### **QUARTOS**

#### **GET - Listar todos os quartos**
```typescript
const { data, error } = await supabase
  .from('quartos')
  .select('*')
  .order('numero_quarto', { ascending: true });
```

#### **GET - Buscar quarto por ID**
```typescript
const { data, error } = await supabase
  .from('quartos')
  .select('*')
  .eq('id', quartoId)
  .single();
```

#### **POST - Criar novo quarto**
```typescript
const { data, error } = await supabase
  .from('quartos')
  .insert([{
    numero_quarto: '101',
    tipo: 'Solteiro',
    capacidade: 1,
    preco_diario: 150.00,
    status: 'Disponível'
  }])
  .select();
```

#### **PUT - Atualizar quarto**
```typescript
const { data, error } = await supabase
  .from('quartos')
  .update({
    tipo: 'Casal',
    capacidade: 2,
    preco_diario: 200.00
  })
  .eq('id', quartoId)
  .select();
```

#### **DELETE - Excluir quarto**
```typescript
const { error } = await supabase
  .from('quartos')
  .delete()
  .eq('id', quartoId);
```

---

### **CLIENTES**

#### **GET - Listar todos os clientes**
```typescript
const { data, error } = await supabase
  .from('clientes')
  .select('*')
  .order('nome_completo', { ascending: true });
```

#### **GET - Buscar cliente por ID**
```typescript
const { data, error } = await supabase
  .from('clientes')
  .select('*')
  .eq('id', clienteId)
  .single();
```

#### **POST - Criar novo cliente**
```typescript
const { data, error } = await supabase
  .from('clientes')
  .insert([{
    nome_completo: 'João Silva',
    cpf: '123.456.789-00',
    email: 'joao@email.com',
    telefone: '(81) 99999-9999',
    data_nascimento: '1990-01-01',
    endereco: 'Rua Exemplo, 123',
    cidade: 'Recife',
    estado: 'PE',
    pais: 'Brasil'
  }])
  .select();
```

#### **PUT - Atualizar cliente**
```typescript
const { data, error } = await supabase
  .from('clientes')
  .update({
    telefone: '(81) 98888-8888',
    email: 'joao.silva@email.com'
  })
  .eq('id', clienteId)
  .select();
```

#### **DELETE - Excluir cliente**
```typescript
const { error } = await supabase
  .from('clientes')
  .delete()
  .eq('id', clienteId);
```

---

### **FUNCIONÁRIOS**

#### **GET - Listar todos os funcionários**
```typescript
const { data, error } = await supabase
  .from('funcionarios')
  .select('*')
  .order('nome_completo', { ascending: true });
```

#### **GET - Buscar funcionário por ID**
```typescript
const { data, error } = await supabase
  .from('funcionarios')
  .select('*')
  .eq('id', funcionarioId)
  .single();
```

#### **POST - Criar novo funcionário**
```typescript
const { data, error } = await supabase
  .from('funcionarios')
  .insert([{
    nome_completo: 'Maria Santos',
    cpf: '987.654.321-00',
    email: 'maria@hotel.com',
    telefone: '(81) 97777-7777',
    cargo: 'Recepcionista',
    salario: 2500.00,
    data_admissao: '2024-01-15',
    status: 'Ativo'
  }])
  .select();
```

#### **PUT - Atualizar funcionário**
```typescript
const { data, error } = await supabase
  .from('funcionarios')
  .update({
    cargo: 'Gerente',
    salario: 4500.00
  })
  .eq('id', funcionarioId)
  .select();
```

#### **DELETE - Excluir funcionário**
```typescript
const { error } = await supabase
  .from('funcionarios')
  .delete()
  .eq('id', funcionarioId);
```

---

### **RESERVAS**

#### **GET - Listar todas as reservas (com relacionamentos)**
```typescript
const { data, error } = await supabase
  .from('reservas')
  .select(`
    *,
    clientes(id, nome_completo, cpf, telefone),
    quartos(id, numero_quarto, tipo, preco_diario)
  `)
  .order('data_checkin', { ascending: false });
```

#### **GET - Buscar reserva por ID**
```typescript
const { data, error } = await supabase
  .from('reservas')
  .select(`
    *,
    clientes(*),
    quartos(*)
  `)
  .eq('id', reservaId)
  .single();
```

#### **POST - Criar nova reserva**
```typescript
const { data, error } = await supabase
  .from('reservas')
  .insert([{
    id_cliente: 'uuid-do-cliente',
    id_quarto: 'uuid-do-quarto',
    data_checkin: '2024-12-01',
    data_checkout: '2024-12-05',
    numero_hospedes: 2,
    valor_total: 800.00,
    status: 'Confirmada',
    observacoes: 'Cliente prefere andar alto'
  }])
  .select();
```

#### **PUT - Atualizar reserva**
```typescript
const { data, error } = await supabase
  .from('reservas')
  .update({
    data_checkout: '2024-12-06',
    valor_total: 1000.00
  })
  .eq('id', reservaId)
  .select();
```

#### **PUT - Realizar Check-in**
```typescript
const { data, error } = await supabase
  .from('reservas')
  .update({
    status: 'Ativa',
    checkin_realizado_em: new Date().toISOString()
  })
  .eq('id', reservaId)
  .select();

// Atualizar status do quarto
await supabase
  .from('quartos')
  .update({ status: 'Ocupado' })
  .eq('id', quartoId);
```

#### **PUT - Realizar Check-out**
```typescript
const { data, error } = await supabase
  .from('reservas')
  .update({
    status: 'Finalizada',
    checkout_realizado_em: new Date().toISOString()
  })
  .eq('id', reservaId)
  .select();

// Atualizar status do quarto
await supabase
  .from('quartos')
  .update({ status: 'Disponível' })
  .eq('id', quartoId);
```

#### **DELETE - Excluir reserva**
```typescript
const { error } = await supabase
  .from('reservas')
  .delete()
  .eq('id', reservaId);
```

---

### **ATIVIDADES RECREATIVAS**

#### **GET - Listar todas as atividades**
```typescript
const { data, error } = await supabase
  .from('atividades_recreativas')
  .select('*')
  .order('data_hora', { ascending: true });
```

#### **GET - Buscar atividade por ID**
```typescript
const { data, error } = await supabase
  .from('atividades_recreativas')
  .select('*')
  .eq('id', atividadeId)
  .single();
```

#### **POST - Criar nova atividade**
```typescript
const { data, error } = await supabase
  .from('atividades_recreativas')
  .insert([{
    nome: 'Yoga na Praia',
    descricao: 'Sessão de yoga com vista para o mar',
    data_hora: '2024-12-01T07:00:00Z',
    local: 'Praia do Hotel',
    capacidade_maxima: 20,
    preco: 0,
    status: 'Agendada'
  }])
  .select();
```

#### **PUT - Atualizar atividade**
```typescript
const { data, error } = await supabase
  .from('atividades_recreativas')
  .update({
    capacidade_maxima: 25,
    preco: 15.00
  })
  .eq('id', atividadeId)
  .select();
```

#### **DELETE - Excluir atividade**
```typescript
const { error } = await supabase
  .from('atividades_recreativas')
  .delete()
  .eq('id', atividadeId);
```

---

## 🔍 Filtros e Buscas Avançadas

### **Busca por texto (nome, CPF, etc.)**
```typescript
const { data, error } = await supabase
  .from('clientes')
  .select('*')
  .ilike('nome_completo', `%${searchTerm}%`);
```

### **Filtro por status**
```typescript
const { data, error } = await supabase
  .from('quartos')
  .select('*')
  .eq('status', 'Disponível');
```

### **Filtro por intervalo de datas**
```typescript
const { data, error } = await supabase
  .from('reservas')
  .select('*')
  .gte('data_checkin', '2024-12-01')
  .lte('data_checkout', '2024-12-31');
```

### **Múltiplos filtros**
```typescript
const { data, error } = await supabase
  .from('quartos')
  .select('*')
  .eq('status', 'Disponível')
  .gte('capacidade', 2)
  .lte('preco_diario', 300);
```

### **Ordenação e Paginação**
```typescript
const { data, error } = await supabase
  .from('clientes')
  .select('*')
  .order('nome_completo', { ascending: true })
  .range(0, 9); // Primeiros 10 registros
```

---

## 📊 Consultas Agregadas

### **Contar registros**
```typescript
const { count, error } = await supabase
  .from('quartos')
  .select('*', { count: 'exact', head: true });
```

### **Estatísticas de ocupação**
```typescript
// Total de quartos
const { count: totalQuartos } = await supabase
  .from('quartos')
  .select('*', { count: 'exact', head: true });

// Quartos ocupados
const { count: quartosOcupados } = await supabase
  .from('quartos')
  .select('*', { count: 'exact', head: true })
  .eq('status', 'Ocupado');

// Taxa de ocupação
const taxaOcupacao = (quartosOcupados / totalQuartos) * 100;
```

---

## ⚠️ Tratamento de Erros

### **Estrutura padrão de erro**
```typescript
interface SupabaseError {
  message: string;
  details: string;
  hint: string;
  code: string;
}
```

### **Exemplo de tratamento**
```typescript
const { data, error } = await supabase
  .from('quartos')
  .select('*');

if (error) {
  console.error('Erro ao buscar quartos:', error.message);
  
  // Tratamento específico por código
  if (error.code === '42P01') {
    // Tabela não existe
    alert('Tabela não encontrada no banco de dados');
  } else if (error.code === '23505') {
    // Violação de constraint UNIQUE
    alert('Já existe um registro com esses dados');
  } else {
    alert(`Erro: ${error.message}`);
  }
  
  return;
}

// Processar dados...
```

---

## 🔄 Triggers e Funções (Opcional)

### **Atualizar `updated_at` automaticamente**
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar para cada tabela
CREATE TRIGGER update_quartos_updated_at 
BEFORE UPDATE ON quartos 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();
```

---

## 📝 Notas Importantes

1. **UUID vs Auto-increment**: Usamos UUID para IDs, mais seguro e escalável
2. **Cascade Delete**: Reservas são deletadas automaticamente ao excluir cliente ou quarto
3. **Timestamps**: Todas as tabelas têm `created_at` e `updated_at`
4. **Status**: Use valores padronizados ('Disponível', 'Ocupado', 'Confirmada', 'Ativa', etc.)
5. **RLS**: Sempre verificar se Row Level Security está habilitado em produção

---

## 🚀 Próximos Passos

1. ✅ Criar tabelas no Supabase
2. ✅ Habilitar RLS e criar políticas
3. ✅ Testar endpoints via Supabase Dashboard
4. ✅ Implementar services no app
5. ✅ Integrar com as telas existentes
6. ✅ Adicionar validações e tratamento de erros
7. ✅ Testar fluxo completo de CRUD
