-- =====================================================
-- CONFIGURAÇÃO DE STORAGE PARA IMAGENS DE CLIENTES
-- =====================================================
-- Este script cria o bucket de storage para armazenar
-- fotos dos clientes com políticas de acesso adequadas
-- =====================================================

-- 1. Criar bucket para imagens de clientes (se não existir)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'clientes-images',
  'clientes-images',
  true,  -- Bucket público para permitir acesso direto às imagens
  5242880,  -- 5MB de limite por arquivo
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Criar políticas de acesso ao bucket
-- Permitir que usuários autenticados façam upload de imagens
CREATE POLICY "Usuários autenticados podem fazer upload de imagens de clientes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'clientes-images');

-- Permitir que usuários autenticados atualizem suas imagens (upsert)
CREATE POLICY "Usuários autenticados podem atualizar imagens de clientes"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'clientes-images');

-- Permitir que usuários autenticados deletem imagens
CREATE POLICY "Usuários autenticados podem deletar imagens de clientes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'clientes-images');

-- Permitir acesso público para leitura (visualização das imagens)
CREATE POLICY "Imagens de clientes são publicamente acessíveis"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'clientes-images');

-- =====================================================
-- ADICIONAR COLUNA imagem_url NA TABELA clientes
-- =====================================================

-- Adicionar coluna para armazenar a URL da imagem (se não existir)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'clientes' 
        AND column_name = 'imagem_url'
    ) THEN
        ALTER TABLE clientes 
        ADD COLUMN imagem_url TEXT;
        
        COMMENT ON COLUMN clientes.imagem_url IS 'URL pública da foto do cliente no Supabase Storage';
    END IF;
END $$;

-- =====================================================
-- VERIFICAÇÕES
-- =====================================================

-- Verificar se o bucket foi criado
SELECT 
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets
WHERE id = 'clientes-images';

-- Verificar políticas criadas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'objects' 
AND policyname LIKE '%clientes%'
ORDER BY policyname;

-- Verificar se a coluna foi adicionada
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'clientes'
AND column_name = 'imagem_url';
