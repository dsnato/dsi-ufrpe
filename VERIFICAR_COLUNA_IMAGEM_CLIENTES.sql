-- =====================================================
-- VERIFICAÇÃO DA COLUNA imagem_url NA TABELA clientes
-- =====================================================
-- Execute este script para verificar se a coluna existe
-- =====================================================

-- 1. Verificar se a coluna imagem_url existe
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'clientes'
AND column_name = 'imagem_url';

-- 2. Ver todos os campos da tabela clientes
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'clientes'
ORDER BY ordinal_position;

-- 3. Ver clientes com imagem (se a coluna existir)
SELECT 
    id,
    nome_completo,
    imagem_url
FROM clientes
WHERE imagem_url IS NOT NULL;

-- 4. Contar quantos clientes têm imagem
SELECT 
    COUNT(*) as total_clientes,
    COUNT(imagem_url) as clientes_com_imagem,
    COUNT(*) - COUNT(imagem_url) as clientes_sem_imagem
FROM clientes;

-- =====================================================
-- SE A COLUNA NÃO EXISTIR, ADICIONE MANUALMENTE:
-- =====================================================
-- ALTER TABLE clientes ADD COLUMN imagem_url TEXT;
