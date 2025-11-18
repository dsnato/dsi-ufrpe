# Sistema de Roles (Funções de Usuário)

## Visão Geral

O sistema de profiles agora inclui um campo `role` que define as permissões de cada usuário:

- **user** (padrão): Usuário comum do sistema
- **admin**: Administrador com acesso total

## Configuração Inicial

### 1. Para Novos Bancos

Execute o script `SUPABASE_PROFILES_SETUP.sql` que já inclui o campo `role`.

### 2. Para Bancos Existentes

Execute o script `MIGRATION_ADD_ROLE_TO_PROFILES.sql` para adicionar o campo `role` à tabela existente.

## Como Funciona

### Criação Automática de Perfil

Quando um novo usuário se registra no sistema:
1. Um perfil é criado automaticamente na tabela `profiles`
2. O campo `role` é definido como **'user'** por padrão
3. O campo `username` é preenchido com o nome do cadastro ou email

### Promover Usuário a Admin

Para tornar um usuário administrador, execute no SQL Editor do Supabase:

```sql
-- Consultar usuários existentes
SELECT p.id, p.username, p.role, u.email
FROM profiles p
JOIN auth.users u ON p.id = u.id;

-- Promover usuário específico a admin (use o ID da consulta acima)
UPDATE profiles 
SET role = 'admin' 
WHERE id = '<UUID_DO_USUARIO>';
```

### Rebaixar Admin para User

```sql
UPDATE profiles 
SET role = 'user' 
WHERE id = '<UUID_DO_USUARIO>';
```

## Exemplos de Uso

### Consultar Todos os Admins

```sql
SELECT p.*, u.email
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.role = 'admin';
```

### Consultar Usuários Comuns

```sql
SELECT p.*, u.email
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.role = 'user';
```

### Verificar Role de um Usuário Específico

```sql
SELECT p.role, p.username, u.email
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'usuario@exemplo.com';
```

## Estrutura da Tabela Profiles

```sql
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY,                    -- ID do usuário (FK para auth.users)
    username TEXT,                          -- Nome de usuário
    role TEXT DEFAULT 'user',               -- Role: 'user' ou 'admin'
    funcionario_id UUID,                    -- FK opcional para funcionarios
    created_at TIMESTAMP WITH TIME ZONE,    -- Data de criação
    updated_at TIMESTAMP WITH TIME ZONE     -- Data de atualização
);
```

## Restrições e Validações

- O campo `role` aceita apenas os valores: **'user'** ou **'admin'**
- Tentativas de inserir outros valores resultarão em erro
- O valor padrão é sempre **'user'**
- A alteração de role deve ser feita **apenas pelo administrador do banco de dados**

## Segurança

⚠️ **IMPORTANTE**: 
- A alteração de roles deve ser feita **apenas diretamente no banco de dados**
- Não exponha a funcionalidade de alterar roles através da aplicação
- Apenas administradores do Supabase devem ter acesso a essa funcionalidade
- Use Row Level Security (RLS) para proteger operações sensíveis baseadas em roles

## Próximos Passos (Futuro)

Para implementar controle de acesso baseado em roles na aplicação:

1. Criar políticas RLS específicas por role
2. Adicionar verificação de role no código da aplicação
3. Implementar middleware de autorização
4. Criar telas administrativas apenas para admins

Exemplo de política RLS baseada em role:

```sql
-- Exemplo: Apenas admins podem deletar clientes
CREATE POLICY "Apenas admins podem deletar clientes"
ON public.clientes
FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);
```
