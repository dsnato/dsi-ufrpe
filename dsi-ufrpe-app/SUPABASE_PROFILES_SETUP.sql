-- =====================================================
-- CONFIGURAÇÃO DA TABELA PROFILES (OPCIONAL)
-- =====================================================
-- Execute este script no SQL Editor do Supabase se quiser
-- vincular usuários autenticados a funcionários do sistema
-- =====================================================

-- 1. CRIAR TABELA PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT,
    funcionario_id UUID REFERENCES public.funcionarios(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CRIAR ÍNDICES
CREATE INDEX IF NOT EXISTS idx_profiles_funcionario ON public.profiles(funcionario_id);

-- 3. HABILITAR RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. CRIAR POLÍTICAS RLS (ACESSO PÚBLICO PARA DESENVOLVIMENTO)
DROP POLICY IF EXISTS "Permitir SELECT em profiles" ON public.profiles;
CREATE POLICY "Permitir SELECT em profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir INSERT em profiles" ON public.profiles;
CREATE POLICY "Permitir INSERT em profiles" ON public.profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir UPDATE em profiles" ON public.profiles;
CREATE POLICY "Permitir UPDATE em profiles" ON public.profiles FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Permitir DELETE em profiles" ON public.profiles;
CREATE POLICY "Permitir DELETE em profiles" ON public.profiles FOR DELETE USING (true);

-- 5. CRIAR TRIGGER PARA AUTO-CRIAR PROFILE AO CADASTRAR USUÁRIO
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 6. CRIAR TRIGGER PARA UPDATED_AT
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- SETUP CONCLUÍDO! ✅
-- =====================================================
-- Agora a tabela profiles será criada automaticamente
-- quando um novo usuário se cadastrar.
-- 
-- Para vincular um usuário a um funcionário:
-- UPDATE profiles SET funcionario_id = '<id_do_funcionario>' WHERE id = '<id_do_usuario>';
-- =====================================================
