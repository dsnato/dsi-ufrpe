# Configuração de Recuperação de Senha com Supabase

## Fluxo Implementado

O fluxo de recuperação de senha foi implementado seguindo o processo do Supabase, que utiliza **links de redefinição enviados por e-mail** ao invés de códigos OTP.

### Telas Criadas

1. **`/screens/RecuperacaoSenha/index.tsx`** - Tela inicial onde o usuário insere o e-mail
2. **`/screens/RecuperacaoSenha/confirmacao.tsx`** - Confirma que o link foi enviado para o e-mail
3. **`/screens/RecuperacaoSenha/nova-senha.tsx`** - Permite criar uma nova senha (acessada via link do e-mail)
4. **`/screens/RecuperacaoSenha/sucesso.tsx`** - Confirma que a senha foi alterada com sucesso

## Como Funciona

### 1. Usuário Solicita Recuperação
- Na tela de login, clica em "Recuperar" senha
- Insere o e-mail cadastrado
- O app chama `supabase.auth.resetPasswordForEmail(email, { redirectTo: '...' })`

### 2. Supabase Envia E-mail
- O Supabase envia automaticamente um e-mail com um link
- O link contém um token de recuperação
- O link redireciona para a tela de nova senha do app

### 3. Usuário Cria Nova Senha
- Clica no link recebido por e-mail
- É redirecionado para a tela `nova-senha`
- Insere a nova senha duas vezes
- O app chama `supabase.auth.updateUser({ password: newPassword })`

### 4. Confirmação
- Senha é atualizada com sucesso
- Usuário vê tela de sucesso
- Pode fazer login com a nova senha

## Configurações Necessárias no Supabase

### 1. Email Templates (IMPORTANTE!)

Acesse o Dashboard do Supabase:
1. Vá em **Authentication** → **Email Templates**
2. Selecione **Reset Password**
3. Configure o template do e-mail com o link de redirecionamento

### 2. Redirect URLs

Configure as URLs de redirecionamento permitidas:
1. Vá em **Authentication** → **URL Configuration**
2. Adicione a URL de redirecionamento do seu app:

   ```
   dsiufrpeapp://screens/RecuperacaoSenha/nova-senha
   ```
   
   Para desenvolvimento local, você também pode adicionar:

   ```
   http://localhost:19000/screens/RecuperacaoSenha/nova-senha
   exp://localhost:19000/screens/RecuperacaoSenha/nova-senha
   ```

### 3. Email Provider

Certifique-se de que o provedor de e-mail está configurado:
1. Vá em **Project Settings** → **Auth**
2. Configure um provedor de e-mail (Supabase oferece um padrão para desenvolvimento)
3. Para produção, configure um provedor SMTP personalizado (SendGrid, AWS SES, etc.)

## Deep Linking (para Produção)

Para que o link do e-mail abra o app corretamente, você precisa configurar deep linking:

### 1. Configure o scheme no `app.json`:
```json
{
  "expo": {
    "scheme": "dsi-ufrpe-app",
    "ios": {
      "bundleIdentifier": "com.seudominio.dsiufrpeapp"
    },
    "android": {
      "package": "com.seudominio.dsiufrpeapp"
    }
  }
}
```

### 2. Link do E-mail

O Supabase irá gerar links no formato:

```
dsiufrpeapp://screens/RecuperacaoSenha/nova-senha?token=...
```

### 3. Tratamento de Deep Links
O Expo Router já trata automaticamente os deep links baseado na estrutura de pastas.

## Testando o Fluxo

### Durante o Desenvolvimento:

1. **Teste sem e-mail real:**
   - Para testar sem enviar e-mails, você pode:
   - Desabilitar confirmação de e-mail no Supabase (temporariamente)
   - Ou usar um serviço como MailHog para capturar e-mails localmente

2. **Teste com e-mail real:**
   - Cadastre um usuário com um e-mail válido
   - Solicite recuperação de senha
   - Verifique sua caixa de entrada
   - Clique no link recebido

### Observações:

- Durante o desenvolvimento com Expo Go, os deep links podem não funcionar perfeitamente
- Para testar completamente, você pode:
  1. Usar o Expo Dev Client
  2. Ou fazer build nativo da aplicação
  3. Ou testar o fluxo web primeiro

## Fluxo Alternativo (OTP por E-mail)

Se você preferir usar códigos OTP ao invés de links, seria necessário:

1. Implementar a geração de códigos manualmente
2. Criar uma tabela no banco para armazenar os códigos
3. Implementar validação dos códigos
4. Adicionar expiração dos códigos

**Porém, a abordagem com links é mais segura e é a recomendada pelo Supabase.**

## Segurança

- Os tokens de recuperação expiram automaticamente (configurável no Supabase)
- Cada token só pode ser usado uma vez
- O link é único por solicitação
- A senha antiga não é necessária para criar a nova

## Mensagens de Erro

As mensagens de erro são traduzidas automaticamente pela função `translateAuthError()` em `src/utils/errorMessages.ts`.

## Próximos Passos

1. ✅ Telas criadas
2. ✅ Integração com Supabase
3. ⚠️ Configurar Email Templates no Supabase Dashboard
4. ⚠️ Configurar Redirect URLs no Supabase Dashboard
5. ⚠️ Testar fluxo completo
6. 📋 Configurar deep linking para produção
7. 📋 Configurar provedor de e-mail para produção
