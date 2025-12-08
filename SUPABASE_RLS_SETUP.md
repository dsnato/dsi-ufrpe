# Configuração de Políticas RLS (Row Level Security) no Supabase

## Problema
As operações de DELETE (e possivelmente UPDATE) não estão funcionando porque o Supabase tem Row Level Security (RLS) habilitado, mas sem políticas configuradas.

## Solução: Configurar Políticas RLS

### Passo 1: Acessar o Supabase Dashboard
1. Acesse: https://app.supabase.com
2. Selecione seu projeto
3. Vá em **Authentication** → **Policies**

### Passo 2: Verificar Status do RLS
No menu lateral, clique em **Database** → **Tables** e verifique cada tabela:
- `clientes`
- `funcionarios`
- `quartos`
- `reservas`
- `atividades_recreativas`

Se o RLS estiver **habilitado** (enabled), você precisa criar políticas.

### Passo 3: Criar Políticas para Cada Tabela

#### Opção A: Acesso Público Total (Desenvolvimento)
⚠️ **Use apenas em desenvolvimento! Não é seguro para produção.**

Para cada tabela, execute no **SQL Editor**:

```sql
-- Para CLIENTES
CREATE POLICY "Enable all access for clientes" ON clientes
FOR ALL
USING (true)
WITH CHECK (true);

-- Para FUNCIONARIOS
CREATE POLICY "Enable all access for funcionarios" ON funcionarios
FOR ALL
USING (true)
WITH CHECK (true);

-- Para QUARTOS
CREATE POLICY "Enable all access for quartos" ON quartos
FOR ALL
USING (true)
WITH CHECK (true);

-- Para RESERVAS
CREATE POLICY "Enable all access for reservas" ON reservas
FOR ALL
USING (true)
WITH CHECK (true);

-- Para ATIVIDADES_RECREATIVAS
CREATE POLICY "Enable all access for atividades_recreativas" ON atividades_recreativas
FOR ALL
USING (true)
WITH CHECK (true);
```

#### Opção B: Políticas Separadas por Operação (Mais Controle)

```sql
-- CLIENTES - SELECT (leitura)
CREATE POLICY "Enable read access for clientes" ON clientes
FOR SELECT
USING (true);

-- CLIENTES - INSERT (criação)
CREATE POLICY "Enable insert for clientes" ON clientes
FOR INSERT
WITH CHECK (true);

-- CLIENTES - UPDATE (atualização)
CREATE POLICY "Enable update for clientes" ON clientes
FOR UPDATE
USING (true)
WITH CHECK (true);

-- CLIENTES - DELETE (exclusão)
CREATE POLICY "Enable delete for clientes" ON clientes
FOR DELETE
USING (true);
```

**Repita para cada tabela** (funcionarios, quartos, reservas, atividades_recreativas).

#### Opção C: Desabilitar RLS (NÃO RECOMENDADO)
⚠️ **Apenas para testes locais! Muito inseguro!**

```sql
ALTER TABLE clientes DISABLE ROW LEVEL SECURITY;
ALTER TABLE funcionarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE quartos DISABLE ROW LEVEL SECURITY;
ALTER TABLE reservas DISABLE ROW LEVEL SECURITY;
ALTER TABLE atividades_recreativas DISABLE ROW LEVEL SECURITY;
```

### Passo 4: Verificar Políticas Criadas

Execute no SQL Editor:

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

Você deve ver as políticas criadas para cada tabela.

### Passo 5: Testar no App

Depois de criar as políticas, teste:
1. Criar uma entidade (Cliente, Funcionário, etc.)
2. Editar a entidade
3. Excluir a entidade

## Verificando Erros RLS

Se ainda não funcionar, verifique os logs no Supabase:
1. Vá em **Database** → **Logs**
2. Procure por erros relacionados a "policy" ou "RLS"
3. Os erros mostrarão qual política está faltando

## Exemplo de Erro RLS Típico

```
new row violates row-level security policy for table "clientes"
```

Isso significa que a política não permite a operação.

## Próximos Passos (Produção)

Para produção, você deve implementar autenticação e criar políticas baseadas em usuários autenticados:

```sql
-- Exemplo: Apenas usuários autenticados podem deletar
CREATE POLICY "Authenticated users can delete" ON clientes
FOR DELETE
USING (auth.role() = 'authenticated');
```

## Links Úteis

- [Documentação RLS Supabase](https://supabase.com/docs/guides/auth/row-level-security)
- [Exemplos de Políticas](https://supabase.com/docs/guides/auth/row-level-security#policies)
