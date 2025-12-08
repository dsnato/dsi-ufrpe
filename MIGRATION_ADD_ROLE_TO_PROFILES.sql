-- =====================================================
-- MIGRAÇÃO: ADICIONAR CAMPO ROLE À TABELA PROFILES
-- =====================================================
-- Execute este script no SQL Editor do Supabase se você
-- já tem a tabela profiles criada e quer adicionar o campo role
-- =====================================================

-- 1. ADICIONAR COLUNA ROLE (se não existir)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name='profiles' 
        AND column_name='role'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));
        
        RAISE NOTICE 'Coluna role adicionada com sucesso!';
    ELSE
        RAISE NOTICE 'Coluna role já existe!';
    END IF;
END $$;

-- 2. ATUALIZAR REGISTROS EXISTENTES (definir todos como 'user')
UPDATE public.profiles 
SET role = 'user' 
WHERE role IS NULL;

-- 3. CRIAR ÍNDICE
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 4. ATUALIZAR FUNÇÃO DE TRIGGER PARA INCLUIR ROLE
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
        'user'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- MIGRAÇÃO CONCLUÍDA! ✅
-- =====================================================
-- Todos os usuários existentes agora têm role 'user'.
-- Novos usuários serão criados automaticamente com role 'user'.
-- 
-- Para promover um usuário específico a ADMIN:
-- UPDATE profiles SET role = 'admin' WHERE id = '<id_do_usuario>';
-- 
-- Para consultar o email do usuário e encontrar o ID:
-- SELECT p.id, p.username, p.role, u.email
-- FROM profiles p
-- JOIN auth.users u ON p.id = u.id;
-- =====================================================
