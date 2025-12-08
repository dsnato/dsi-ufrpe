-- =====================================================
-- CONFIGURAÇÃO DA TABELA HOTEL_CONFIG
-- =====================================================
-- Tabela para armazenar informações do hotel/resort
-- incluindo localização para exibição no mapa
-- =====================================================

-- 1. CRIAR TABELA HOTEL_CONFIG
CREATE TABLE IF NOT EXISTS public.hotel_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    endereco TEXT NOT NULL,
    cidade TEXT,
    estado TEXT,
    cep TEXT,
    telefone TEXT,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. INSERIR DADOS PADRÃO
INSERT INTO public.hotel_config (nome, endereco, cidade, estado, cep, telefone, latitude, longitude)
VALUES (
    'Hostify Hotel & Resort',
    'Av. Boa Viagem, 5000',
    'Recife',
    'PE',
    '51030-000',
    '(81) 3333-4444',
    -8.1177,
    -34.8964
)
ON CONFLICT (id) DO NOTHING;

-- 3. HABILITAR RLS
ALTER TABLE public.hotel_config ENABLE ROW LEVEL SECURITY;

-- 4. CRIAR POLÍTICAS RLS

-- Permitir SELECT para todos (visualizar informações do hotel)
DROP POLICY IF EXISTS "Todos podem visualizar hotel_config" ON public.hotel_config;
CREATE POLICY "Todos podem visualizar hotel_config" 
ON public.hotel_config 
FOR SELECT 
USING (true);

-- Permitir UPDATE apenas para admins
DROP POLICY IF EXISTS "Apenas admins podem atualizar hotel_config" ON public.hotel_config;
CREATE POLICY "Apenas admins podem atualizar hotel_config" 
ON public.hotel_config 
FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Permitir INSERT apenas para admins
DROP POLICY IF EXISTS "Apenas admins podem inserir hotel_config" ON public.hotel_config;
CREATE POLICY "Apenas admins podem inserir hotel_config" 
ON public.hotel_config 
FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Permitir DELETE apenas para admins
DROP POLICY IF EXISTS "Apenas admins podem deletar hotel_config" ON public.hotel_config;
CREATE POLICY "Apenas admins podem deletar hotel_config" 
ON public.hotel_config 
FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- 5. CRIAR TRIGGER PARA UPDATED_AT
CREATE OR REPLACE FUNCTION public.update_hotel_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_hotel_config_updated_at ON public.hotel_config;
CREATE TRIGGER update_hotel_config_updated_at
    BEFORE UPDATE ON public.hotel_config
    FOR EACH ROW
    EXECUTE FUNCTION public.update_hotel_config_updated_at();

-- 6. ADICIONAR CONSTRAINT PARA GARANTIR APENAS UM REGISTRO
-- (Opcional: remover se quiser permitir múltiplos hotéis)
CREATE UNIQUE INDEX IF NOT EXISTS idx_hotel_config_singleton 
ON public.hotel_config ((true));

-- =====================================================
-- SETUP CONCLUÍDO! ✅
-- =====================================================
-- A tabela hotel_config foi criada com os dados padrão.
-- 
-- SEGURANÇA:
-- - Todos podem visualizar as informações do hotel
-- - Apenas ADMINS podem editar, inserir ou deletar
-- 
-- COMO USAR:
-- 1. Faça login com um usuário admin
-- 2. Acesse a tela de Localização
-- 3. Clique em "Editar Informações do Hotel"
-- 4. Altere os dados e salve
-- 
-- NOTA: O índice único garante que existe apenas 
-- um registro de configuração do hotel.
-- =====================================================
