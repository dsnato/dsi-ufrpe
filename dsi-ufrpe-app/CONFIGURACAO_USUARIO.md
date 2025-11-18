# Configuração de Usuário na Tela Home

## Problema Resolvido

A função `getProfile` não estava sendo executada porque a tela Home esperava receber a sessão como prop, mas ela nunca era passada na navegação do Login.

## Solução Atual

O código agora funciona da seguinte forma:

1. **Busca a sessão automaticamente** usando `supabase.auth.getSession()` dentro do componente
2. **Usa o `display_name`** cadastrado no registro do usuário (field `user_metadata`)
3. **Fallback para o email** se não houver display_name

### Como funciona

Quando um usuário se registra, o nome é salvo em `user_metadata.display_name`:

```typescript
await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
        data: {
            display_name: name,  // <- Este valor é usado na Home
            phone: telefone,
            cnpj: cnpj,
            hotel_name: hotelName,
        }
    }
});
```

Na tela Home, o código busca o nome assim:

```typescript
const displayName = currentSession.user.user_metadata?.display_name;
if (displayName) {
    const firstName = displayName.split(' ')[0];
    setUsername(firstName);
}
```

## Solução Avançada (Opcional)

Se você quiser vincular usuários autenticados a funcionários do sistema, pode criar a tabela `profiles`:

### Passo 1: Executar o Script SQL

Execute o arquivo `SUPABASE_PROFILES_SETUP.sql` no SQL Editor do Supabase.

### Passo 2: Atualizar o código da Home

Descomente ou adicione o código para buscar o funcionário vinculado:

```typescript
// Busca o profile do usuário
const { data: profileData } = await supabase
    .from('profiles')
    .select(`username, funcionario_id`)
    .eq('id', currentSession.user.id)
    .single();

// Se tiver funcionario_id, busca o nome do funcionário
if (profileData?.funcionario_id) {
    const { data: funcionarioData } = await supabase
        .from('funcionarios')
        .select('nome_completo')
        .eq('id', profileData.funcionario_id)
        .single();

    if (funcionarioData?.nome_completo) {
        const firstName = funcionarioData.nome_completo.split(' ')[0];
        setUsername(firstName);
        return;
    }
}
```

### Passo 3: Vincular usuário a funcionário

No Supabase, execute:

```sql
UPDATE profiles 
SET funcionario_id = '<id_do_funcionario>' 
WHERE id = '<id_do_usuario>';
```

## Fluxo de Prioridade para Exibir o Nome

1. **Funcionário vinculado** (se tabela profiles estiver configurada e houver vínculo)
2. **Username do profile** (se houver)
3. **Display name do metadata** (cadastrado no registro) ✅ **IMPLEMENTADO**
4. **Email** (fallback final)

## Logs de Debug

O código inclui console.logs detalhados:

- 🔍 Iniciando operação
- 📝 Dados obtidos
- ✅ Sucesso
- ❌ Erro

Monitore o terminal/console para ver o fluxo de execução.

## Testando

1. Faça login com um usuário cadastrado
2. Veja no terminal/console os logs de debug
3. O nome deve aparecer no header da tela Home
4. Se aparecer apenas o email, verifique se o `display_name` foi salvo no registro

## Verificando no Supabase

Para verificar os dados do usuário:

1. Acesse o Supabase Dashboard
2. Vá em **Authentication** → **Users**
3. Clique no usuário
4. Veja a seção **User Metadata**
5. Verifique se `display_name` está preenchido
