-- =====================================================
-- SUPABASE SETUP - SISTEMA DE GERENCIAMENTO HOTELEIRO
-- =====================================================
-- Execute este script completo no SQL Editor do Supabase
-- Dashboard -> SQL Editor -> New Query -> Cole tudo -> Run
-- =====================================================

-- =====================================================
-- 1. CRIAR TABELAS
-- =====================================================

-- Tabela: clientes
CREATE TABLE IF NOT EXISTS public.clientes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome_completo TEXT NOT NULL,
    cpf TEXT UNIQUE NOT NULL,
    email TEXT,
    telefone TEXT,
    data_nascimento DATE,
    endereco TEXT,
    cidade TEXT,
    estado TEXT,
    pais TEXT DEFAULT 'Brasil',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: quartos
CREATE TABLE IF NOT EXISTS public.quartos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    numero_quarto TEXT UNIQUE NOT NULL,
    tipo TEXT NOT NULL, -- 'simples', 'duplo', 'suite', 'luxo'
    capacidade_pessoas INTEGER NOT NULL DEFAULT 1,
    preco_diario DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'disponivel', -- 'disponivel', 'ocupado', 'manutencao', 'reservado'
    descricao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: funcionarios
CREATE TABLE IF NOT EXISTS public.funcionarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome_completo TEXT NOT NULL,
    cpf TEXT UNIQUE NOT NULL,
    email TEXT,
    telefone TEXT,
    cargo TEXT NOT NULL,
    salario DECIMAL(10,2) NOT NULL,
    data_admissao DATE,
    status TEXT DEFAULT 'ativo', -- 'ativo', 'inativo'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: reservas
CREATE TABLE IF NOT EXISTS public.reservas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    id_cliente UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    id_quarto UUID NOT NULL REFERENCES public.quartos(id) ON DELETE CASCADE,
    data_checkin DATE NOT NULL,
    data_checkout DATE NOT NULL,
    numero_hospedes INTEGER DEFAULT 1,
    valor_total DECIMAL(10,2),
    status TEXT DEFAULT 'confirmada', -- 'confirmada', 'cancelada', 'concluida'
    observacoes TEXT,
    checkin_realizado_em TIMESTAMP WITH TIME ZONE,
    checkout_realizado_em TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT check_dates CHECK (data_checkout > data_checkin)
);

-- Tabela: atividades_recreativas
CREATE TABLE IF NOT EXISTS public.atividades_recreativas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    descricao TEXT,
    data_hora TIMESTAMP WITH TIME ZONE NOT NULL,
    local TEXT,
    capacidade_maxima INTEGER,
    preco DECIMAL(10,2) DEFAULT 0.00,
    status TEXT DEFAULT 'agendada', -- 'agendada', 'em_andamento', 'concluida', 'cancelada'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. CRIAR ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_clientes_cpf ON public.clientes(cpf);
CREATE INDEX IF NOT EXISTS idx_clientes_nome ON public.clientes(nome_completo);

CREATE INDEX IF NOT EXISTS idx_quartos_status ON public.quartos(status);
CREATE INDEX IF NOT EXISTS idx_quartos_tipo ON public.quartos(tipo);

CREATE INDEX IF NOT EXISTS idx_funcionarios_cpf ON public.funcionarios(cpf);
CREATE INDEX IF NOT EXISTS idx_funcionarios_status ON public.funcionarios(status);

CREATE INDEX IF NOT EXISTS idx_reservas_cliente ON public.reservas(id_cliente);
CREATE INDEX IF NOT EXISTS idx_reservas_quarto ON public.reservas(id_quarto);
CREATE INDEX IF NOT EXISTS idx_reservas_datas ON public.reservas(data_checkin, data_checkout);
CREATE INDEX IF NOT EXISTS idx_reservas_status ON public.reservas(status);

CREATE INDEX IF NOT EXISTS idx_atividades_data ON public.atividades_recreativas(data_hora);
CREATE INDEX IF NOT EXISTS idx_atividades_status ON public.atividades_recreativas(status);

-- =====================================================
-- 3. CRIAR TRIGGERS PARA UPDATED_AT AUTOMÁTICO
-- =====================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para cada tabela
DROP TRIGGER IF EXISTS update_clientes_updated_at ON public.clientes;
CREATE TRIGGER update_clientes_updated_at
    BEFORE UPDATE ON public.clientes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_quartos_updated_at ON public.quartos;
CREATE TRIGGER update_quartos_updated_at
    BEFORE UPDATE ON public.quartos
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_funcionarios_updated_at ON public.funcionarios;
CREATE TRIGGER update_funcionarios_updated_at
    BEFORE UPDATE ON public.funcionarios
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_reservas_updated_at ON public.reservas;
CREATE TRIGGER update_reservas_updated_at
    BEFORE UPDATE ON public.reservas
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_atividades_updated_at ON public.atividades_recreativas;
CREATE TRIGGER update_atividades_updated_at
    BEFORE UPDATE ON public.atividades_recreativas
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 4. HABILITAR ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quartos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.atividades_recreativas ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. CRIAR POLÍTICAS RLS (ACESSO PÚBLICO PARA DESENVOLVIMENTO)
-- =====================================================
-- ATENÇÃO: Em produção, você deve implementar autenticação adequada!
-- Estas políticas permitem acesso total para facilitar o desenvolvimento.

-- Políticas para CLIENTES
DROP POLICY IF EXISTS "Permitir SELECT em clientes" ON public.clientes;
CREATE POLICY "Permitir SELECT em clientes" ON public.clientes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir INSERT em clientes" ON public.clientes;
CREATE POLICY "Permitir INSERT em clientes" ON public.clientes FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir UPDATE em clientes" ON public.clientes;
CREATE POLICY "Permitir UPDATE em clientes" ON public.clientes FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Permitir DELETE em clientes" ON public.clientes;
CREATE POLICY "Permitir DELETE em clientes" ON public.clientes FOR DELETE USING (true);

-- Políticas para QUARTOS
DROP POLICY IF EXISTS "Permitir SELECT em quartos" ON public.quartos;
CREATE POLICY "Permitir SELECT em quartos" ON public.quartos FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir INSERT em quartos" ON public.quartos;
CREATE POLICY "Permitir INSERT em quartos" ON public.quartos FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir UPDATE em quartos" ON public.quartos;
CREATE POLICY "Permitir UPDATE em quartos" ON public.quartos FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Permitir DELETE em quartos" ON public.quartos;
CREATE POLICY "Permitir DELETE em quartos" ON public.quartos FOR DELETE USING (true);

-- Políticas para FUNCIONÁRIOS
DROP POLICY IF EXISTS "Permitir SELECT em funcionarios" ON public.funcionarios;
CREATE POLICY "Permitir SELECT em funcionarios" ON public.funcionarios FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir INSERT em funcionarios" ON public.funcionarios;
CREATE POLICY "Permitir INSERT em funcionarios" ON public.funcionarios FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir UPDATE em funcionarios" ON public.funcionarios;
CREATE POLICY "Permitir UPDATE em funcionarios" ON public.funcionarios FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Permitir DELETE em funcionarios" ON public.funcionarios;
CREATE POLICY "Permitir DELETE em funcionarios" ON public.funcionarios FOR DELETE USING (true);

-- Políticas para RESERVAS
DROP POLICY IF EXISTS "Permitir SELECT em reservas" ON public.reservas;
CREATE POLICY "Permitir SELECT em reservas" ON public.reservas FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir INSERT em reservas" ON public.reservas;
CREATE POLICY "Permitir INSERT em reservas" ON public.reservas FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir UPDATE em reservas" ON public.reservas;
CREATE POLICY "Permitir UPDATE em reservas" ON public.reservas FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Permitir DELETE em reservas" ON public.reservas;
CREATE POLICY "Permitir DELETE em reservas" ON public.reservas FOR DELETE USING (true);

-- Políticas para ATIVIDADES
DROP POLICY IF EXISTS "Permitir SELECT em atividades" ON public.atividades_recreativas;
CREATE POLICY "Permitir SELECT em atividades" ON public.atividades_recreativas FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir INSERT em atividades" ON public.atividades_recreativas;
CREATE POLICY "Permitir INSERT em atividades" ON public.atividades_recreativas FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir UPDATE em atividades" ON public.atividades_recreativas;
CREATE POLICY "Permitir UPDATE em atividades" ON public.atividades_recreativas FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Permitir DELETE em atividades" ON public.atividades_recreativas;
CREATE POLICY "Permitir DELETE em atividades" ON public.atividades_recreativas FOR DELETE USING (true);

-- =====================================================
-- 6. INSERIR DADOS DE EXEMPLO (OPCIONAL)
-- =====================================================

-- Clientes de exemplo
INSERT INTO public.clientes (nome_completo, cpf, email, telefone, cidade, estado) VALUES
    ('João Silva', '123.456.789-00', 'joao@email.com', '(81) 98765-4321', 'Recife', 'PE'),
    ('Maria Santos', '987.654.321-00', 'maria@email.com', '(81) 91234-5678', 'Olinda', 'PE'),
    ('Pedro Oliveira', '456.789.123-00', 'pedro@email.com', '(81) 99999-8888', 'Jaboatão', 'PE')
ON CONFLICT (cpf) DO NOTHING;

-- Quartos de exemplo
INSERT INTO public.quartos (numero_quarto, tipo, capacidade_pessoas, preco_diario, status, descricao) VALUES
    ('101', 'simples', 1, 150.00, 'disponivel', 'Quarto simples com cama de solteiro'),
    ('102', 'duplo', 2, 250.00, 'disponivel', 'Quarto duplo com duas camas de solteiro'),
    ('201', 'suite', 2, 400.00, 'disponivel', 'Suíte com cama de casal e banheira'),
    ('301', 'luxo', 4, 800.00, 'disponivel', 'Suíte de luxo com vista para o mar')
ON CONFLICT (numero_quarto) DO NOTHING;

-- Funcionários de exemplo
INSERT INTO public.funcionarios (nome_completo, cpf, email, telefone, cargo, salario, status) VALUES
    ('Ana Costa', '111.222.333-44', 'ana@hotel.com', '(81) 98888-7777', 'Recepcionista', 2500.00, 'ativo'),
    ('Carlos Souza', '222.333.444-55', 'carlos@hotel.com', '(81) 97777-6666', 'Gerente', 5000.00, 'ativo'),
    ('Fernanda Lima', '333.444.555-66', 'fernanda@hotel.com', '(81) 96666-5555', 'Camareira', 1800.00, 'ativo')
ON CONFLICT (cpf) DO NOTHING;

-- Atividades de exemplo
INSERT INTO public.atividades_recreativas (nome, descricao, data_hora, local, capacidade_maxima, preco, status) VALUES
    ('Aula de Yoga', 'Yoga matinal na praia', '2024-12-15 07:00:00', 'Praia do hotel', 20, 0.00, 'agendada'),
    ('Passeio de Barco', 'Tour pelas ilhas próximas', '2024-12-16 14:00:00', 'Marina', 30, 150.00, 'agendada'),
    ('Noite de Karaokê', 'Diversão garantida no lounge', '2024-12-17 20:00:00', 'Lounge Principal', 50, 0.00, 'agendada');

-- =====================================================
-- SETUP CONCLUÍDO! ✅
-- =====================================================
-- Agora você pode:
-- 1. Ir para "Table Editor" e ver suas tabelas criadas
-- 2. Ir para "Authentication" -> "Settings" e pegar sua anon key
-- 3. Configurar o arquivo .env no seu projeto React Native
-- =====================================================
