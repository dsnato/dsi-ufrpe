# 📧 Template de E-mail para Supabase

Use este template no Supabase Dashboard para enviar e-mails de recuperação de senha.

## Como Configurar

1. Acesse o Supabase Dashboard
2. Vá em **Authentication** → **Email Templates**
3. Selecione **Reset Password** (Redefinir Senha)
4. Cole o conteúdo abaixo

---

## Subject (Assunto)

```
Recuperação de Senha - Hostify
```

---

## HTML Template (Corpo do E-mail)

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperação de Senha - Hostify</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #132F3B 0%, #0162B3 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">🔑 Hostify</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px 0; color: #132F3B; font-size: 24px; font-weight: 600;">Recuperação de Senha</h2>
                            
                            <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                                Olá!
                            </p>
                            
                            <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                                Você solicitou a recuperação de senha para sua conta no <strong>Hostify</strong>.
                            </p>
                            
                            <p style="margin: 0 0 30px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                                Para criar uma nova senha, clique no botão abaixo:
                            </p>
                            
                            <!-- Button -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #0162B3; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(1, 98, 179, 0.3);">
                                            Redefinir Senha
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 30px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                Ou copie e cole este link no seu navegador:
                            </p>
                            
                            <p style="margin: 10px 0 0 0; padding: 15px; background-color: #f5f5f5; border-radius: 6px; word-break: break-all; font-size: 13px; color: #0162B3;">
                                {{ .ConfirmationURL }}
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Security Notice -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 6px;">
                                <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                                    ⚠️ <strong>Atenção:</strong> Se você não solicitou esta alteração, ignore este e-mail. Sua senha permanecerá a mesma.
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer Info -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; padding: 15px;">
                                <tr>
                                    <td style="text-align: center;">
                                        <p style="margin: 0; color: #666666; font-size: 13px;">
                                            🕒 Este link expira em <strong>1 hora</strong>
                                        </p>
                                        <p style="margin: 5px 0 0 0; color: #666666; font-size: 13px;">
                                            🔒 Por segurança, cada link só pode ser usado uma vez
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #e9ecef;">
                            <p style="margin: 0 0 10px 0; color: #999999; font-size: 14px;">
                                Esta é uma mensagem automática, por favor não responda.
                            </p>
                            <p style="margin: 0; color: #999999; font-size: 13px;">
                                © 2025 Hostify - Sistema de Gerenciamento Hoteleiro
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

---

## Plain Text Template (Texto Simples)

Para clientes de e-mail que não suportam HTML:

```
Recuperação de Senha - Hostify

Olá!

Você solicitou a recuperação de senha para sua conta no Hostify.

Para criar uma nova senha, clique no link abaixo ou copie e cole no seu navegador:

{{ .ConfirmationURL }}

ATENÇÃO: Se você não solicitou esta alteração, ignore este e-mail. Sua senha permanecerá a mesma.

Este link expira em 1 hora.
Por segurança, cada link só pode ser usado uma vez.

---
Esta é uma mensagem automática, por favor não responda.
© 2025 Hostify - Sistema de Gerenciamento Hoteleiro
```

---

## Variáveis Disponíveis

O Supabase fornece as seguintes variáveis que você pode usar no template:

- `{{ .ConfirmationURL }}` - Link de confirmação (OBRIGATÓRIO)
- `{{ .Token }}` - Token de recuperação
- `{{ .TokenHash }}` - Hash do token
- `{{ .SiteURL }}` - URL do site configurada
- `{{ .Email }}` - E-mail do usuário

---

## Configurações Adicionais

### Tempo de Expiração do Token

Para alterar o tempo de expiração (padrão: 1 hora):

1. Vá em **Authentication** → **Policies**
2. Procure por "Password Recovery Token"
3. Ajuste o tempo conforme necessário

### Customizar Site URL

1. Vá em **Project Settings** → **General**
2. Configure o **Site URL** (usado como fallback)
3. Configure o **Redirect URLs** (já configurado anteriormente)

---

## Teste do E-mail

Para testar se o e-mail está sendo enviado corretamente:

1. Use o app para solicitar recuperação de senha
2. Verifique sua caixa de entrada (e spam)
3. Verifique os logs no Supabase:
   - Vá em **Authentication** → **Logs**
   - Procure por eventos de "password_recovery"

---

## Dicas de Design

✅ Use cores do seu branding
✅ Mantenha o layout responsivo
✅ Teste em diferentes clientes de e-mail
✅ Inclua sempre o link em texto simples
✅ Adicione informações de segurança
✅ Mantenha mensagens claras e objetivas

---

## Problemas Comuns

### E-mail cai no spam
- Configure SPF, DKIM e DMARC no seu provedor
- Use um provedor SMTP profissional
- Evite palavras que acionam filtros de spam

### Link não funciona
- Verifique se as Redirect URLs estão configuradas
- Confirme que o token não expirou
- Verifique se o deep linking está funcionando

### E-mail não chega
- Verifique os logs do Supabase
- Confirme que o provedor SMTP está configurado
- Teste com diferentes provedores de e-mail (Gmail, Outlook, etc.)
