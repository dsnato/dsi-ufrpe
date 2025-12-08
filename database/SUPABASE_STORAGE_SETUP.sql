-- =====================================================
-- CONFIGURAÇÃO DO STORAGE PARA IMAGENS DE ATIVIDADES
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- IMPORTANTE: Antes de executar este script, você precisa:
-- 1. Criar o bucket 'atividades-images2' manualmente no Supabase Storage
--    Vá em: Storage → Create a new bucket → Nome: atividades-images2
--    Marque como PUBLIC
-- 2. Depois execute as políticas abaixo

-- =====================================================
-- POLÍTICAS RLS PARA O STORAGE BUCKET
-- =====================================================

-- 1. Permitir visualização pública de todas as imagens
DROP POLICY IF EXISTS "Permitir leitura pública de imagens" ON storage.objects;
CREATE POLICY "Permitir leitura pública de imagens"
ON storage.objects FOR SELECT
USING (bucket_id = 'atividades-images2');

-- 2. Permitir upload de imagens (para desenvolvimento, permite todos)
DROP POLICY IF EXISTS "Permitir upload de imagens" ON storage.objects;
CREATE POLICY "Permitir upload de imagens"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'atividades-images2');

-- 3. Permitir atualização de imagens
DROP POLICY IF EXISTS "Permitir atualização de imagens" ON storage.objects;
CREATE POLICY "Permitir atualização de imagens"
ON storage.objects FOR UPDATE
USING (bucket_id = 'atividades-images2')
WITH CHECK (bucket_id = 'atividades-images2');

-- 4. Permitir exclusão de imagens
DROP POLICY IF EXISTS "Permitir exclusão de imagens" ON storage.objects;
CREATE POLICY "Permitir exclusão de imagens"
ON storage.objects FOR DELETE
USING (bucket_id = 'atividades-images2');

-- =====================================================
-- CONFIGURAÇÃO CONCLUÍDA! ✅
-- =====================================================
-- Agora você pode fazer upload de imagens para o bucket
-- atividades-images2 sem erros de permissão.
-- =====================================================

-- TESTANDO (OPCIONAL):
-- Você pode testar o upload via interface do Supabase:
-- Storage → atividades-images2 → Upload file
-- =====================================================
