# 🔑 Guia Rápido - Configuração de Recuperação de Senha

## ⚡ Ações Necessárias no Supabase Dashboard

### 1️⃣ Configurar Redirect URLs

**Caminho:** `Authentication` → `URL Configuration` → `Redirect URLs`

Adicione as seguintes URLs:

```
dsiufrpeapp://screens/RecuperacaoSenha/nova-senha
http://localhost:19000/screens/RecuperacaoSenha/nova-senha
exp://localhost:19000/screens/RecuperacaoSenha/nova-senha
```

### 2️⃣ Configurar Template de E-mail

**Caminho:** `Authentication` → `Email Templates` → `Reset Password`

Template sugerido:

**Subject:** `Recuperação de Senha - Hostify`

**Body (HTML):**
```html
<h2>Recuperação de Senha</h2>
<p>Você solicitou a recuperação de senha para sua conta no Hostify.</p>
<p>Clique no botão abaixo para criar uma nova senha:</p>
<p><a href="{{ .ConfirmationURL }}" style="background-color: #0162B3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Redefinir Senha</a></p>
<p>Se você não solicitou esta alteração, ignore este e-mail.</p>
<p>Este link expira em 1 hora.</p>
```

**IMPORTANTE:** O template deve conter `{{ .ConfirmationURL }}` que o Supabase substitui automaticamente pelo link de recuperação.

### 3️⃣ Verificar Configurações de E-mail

**Caminho:** `Project Settings` → `Authentication` → `SMTP Settings`

Para **desenvolvimento**: O Supabase oferece um provedor padrão.

Para **produção**: Configure um provedor SMTP:
- SendGrid
- AWS SES
- Mailgun
- Outros

## 🧪 Como Testar

### Durante o Desenvolvimento:

1. Execute o app: `npx expo start`
2. Na tela de login, clique em "Recuperar"
3. Digite um e-mail válido cadastrado no sistema
4. Verifique a caixa de entrada do e-mail
5. Clique no link recebido
6. Crie a nova senha

### Problemas Comuns:

**❌ E-mail não chega:**
- Verifique a pasta de spam
- Confirme que o provedor de e-mail está configurado
- Verifique os logs no Supabase Dashboard

**❌ Link não abre o app:**
- Durante desenvolvimento com Expo Go, deep links podem não funcionar
- Use Expo Dev Client ou build nativo para testar
- Verifique se as redirect URLs estão configuradas

**❌ Erro ao atualizar senha:**
- Verifique se o token não expirou (padrão: 1 hora)
- Confirme que o usuário está autenticado via link

## 📱 Deep Linking para Produção

### app.json

Certifique-se de que o `scheme` está configurado:

```json
{
  "expo": {
    "scheme": "dsi-ufrpe-app",
    "name": "Hostify",
    "slug": "dsi-ufrpe-app"
  }
}
```

### Android (app.json)

```json
{
  "android": {
    "package": "com.seudominio.dsiufrpeapp",
    "intentFilters": [
      {
        "action": "VIEW",
        "data": [
          {
            "scheme": "dsi-ufrpe-app"
          }
        ],
        "category": ["BROWSABLE", "DEFAULT"]
      }
    ]
  }
}
```

### iOS (app.json)

```json
{
  "ios": {
    "bundleIdentifier": "com.seudominio.dsiufrpeapp",
    "associatedDomains": ["applinks:dsi-ufrpe-app"]
  }
}
```

## 🔒 Segurança

- ✅ Tokens expiram automaticamente (configurável)
- ✅ Cada token é de uso único
- ✅ Não requer senha antiga
- ✅ Link é único por solicitação
- ✅ Supabase gerencia toda a segurança

## 📋 Checklist de Implementação

- [x] Telas criadas
- [x] Integração com Supabase Auth
- [x] Botão na tela de login
- [x] Fluxo de navegação
- [ ] Configurar Redirect URLs no Supabase
- [ ] Configurar Email Templates no Supabase
- [ ] Testar fluxo completo
- [ ] Configurar deep linking para produção
- [ ] Configurar provedor SMTP para produção

## 🎨 Telas Implementadas

1. **RecuperacaoSenha/index.tsx** - Entrada de e-mail
2. **RecuperacaoSenha/confirmacao.tsx** - Confirmação de envio
3. **RecuperacaoSenha/nova-senha.tsx** - Criação de nova senha
4. **RecuperacaoSenha/sucesso.tsx** - Confirmação de sucesso

## 🚀 Próximos Passos

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Configure as Redirect URLs
3. Configure o Email Template
4. Teste o fluxo completo
5. Para produção, configure um provedor SMTP profissional
