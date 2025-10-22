# 📝 Sistema de Mensagens Amigáveis

## Visão Geral

Sistema completo de mensagens traduzidas e amigáveis em português para melhorar a experiência do usuário.

## 🎯 Características

- ✅ **Tradução automática** de erros do Supabase
- ✅ **Mensagens amigáveis** e compreensíveis
- ✅ **Validações padronizadas** para formulários
- ✅ **Mensagens de sucesso** com emojis
- ✅ **100% em português**

## 📦 Estrutura

### Arquivo: `src/utils/errorMessages.ts`

Contém três funções principais:

1. **`translateAuthError(errorMessage)`** - Traduz erros de autenticação
2. **`getSuccessMessage(action)`** - Retorna mensagens de sucesso
3. **`getValidationMessage(field, type)`** - Mensagens de validação

## 🔧 Como Usar

### Importar as funções

```typescript
import { 
  translateAuthError, 
  getSuccessMessage, 
  getValidationMessage 
} from '@/src/utils/errorMessages';
```

### 1. Traduzir Erros do Supabase

```typescript
// Login
const { error } = await supabase.auth.signInWithPassword({ email, password });

if (error) {
  // ❌ Antes: showError(error.message)
  // Exibia: "Invalid login credentials"
  
  // ✅ Agora: showError(translateAuthError(error.message))
  // Exibe: "E-mail ou senha incorretos. Verifique seus dados e tente novamente."
}
```

### 2. Mensagens de Sucesso

```typescript
// Após operação bem-sucedida
showSuccess(getSuccessMessage('login'));
// Exibe: "🎉 Bem-vindo de volta! Login realizado com sucesso."

showSuccess(getSuccessMessage('signup'));
// Exibe: "✨ Conta criada com sucesso! Bem-vindo ao sistema."

showSuccess(getSuccessMessage('update'));
// Exibe: "✅ Dados atualizados com sucesso!"
```

### 3. Validações de Formulário

```typescript
// Validar campo obrigatório
if (!email) {
  showError(getValidationMessage('email', 'required'));
  // Exibe: "Por favor, informe seu e-mail."
}

// Validar formato inválido
if (!isValidEmail(email)) {
  showError(getValidationMessage('email', 'invalid'));
  // Exibe: "O e-mail informado não é válido. Verifique e tente novamente."
}

// Validar senhas que não conferem
if (password !== confirmPassword) {
  showError(getValidationMessage('password', 'mismatch'));
  // Exibe: "As senhas não conferem. Digite novamente."
}
```

## 📋 Mensagens Disponíveis

### Erros de Login

| Erro Original (EN) | Mensagem Traduzida (PT-BR) |
|-------------------|---------------------------|
| Invalid login credentials | E-mail ou senha incorretos. Verifique seus dados e tente novamente. |
| Email not confirmed | Por favor, confirme seu e-mail antes de fazer login. |
| User not found | Usuário não encontrado. Verifique o e-mail digitado. |
| Invalid password | Senha incorreta. Tente novamente. |
| Email rate limit exceeded | Muitas tentativas. Aguarde alguns minutos antes de tentar novamente. |

### Erros de Cadastro

| Erro Original (EN) | Mensagem Traduzida (PT-BR) |
|-------------------|---------------------------|
| User already registered | Este e-mail já está cadastrado. Tente fazer login ou recuperar sua senha. |
| Password should be at least 6 characters | A senha deve ter pelo menos 6 caracteres. |
| Email address is invalid | O e-mail informado é inválido. |

### Erros de Rede

| Erro Original (EN) | Mensagem Traduzida (PT-BR) |
|-------------------|---------------------------|
| Failed to fetch | Não foi possível conectar ao servidor. Verifique sua conexão com a internet. |
| Network request failed | Falha na conexão. Verifique sua internet e tente novamente. |
| timeout | A conexão demorou muito para responder. Tente novamente. |

### Mensagens de Sucesso

| Ação | Mensagem |
|------|----------|
| login | 🎉 Bem-vindo de volta! Login realizado com sucesso. |
| signup | ✨ Conta criada com sucesso! Bem-vindo ao sistema. |
| logout | 👋 Até logo! Você foi desconectado com sucesso. |
| update | ✅ Dados atualizados com sucesso! |
| delete | 🗑️ Item removido com sucesso. |
| create | ✨ Item criado com sucesso! |
| save | 💾 Salvo com sucesso! |
| upload | 📤 Upload realizado com sucesso! |
| email_sent | 📧 E-mail enviado! Verifique sua caixa de entrada. |

### Validações

**Campos obrigatórios (`required`):**
- email: "Por favor, informe seu e-mail."
- password: "Por favor, informe sua senha."
- name: "Por favor, informe seu nome."
- phone: "Por favor, informe seu telefone."
- cnpj: "Por favor, informe o CNPJ."
- hotel_name: "Por favor, informe o nome do hotel."

**Campos inválidos (`invalid`):**
- email: "O e-mail informado não é válido. Verifique e tente novamente."
- password: "A senha deve ter pelo menos 6 caracteres."
- phone: "O telefone informado não é válido."
- cnpj: "O CNPJ informado não é válido."

**Campos que não conferem (`mismatch`):**
- password: "As senhas não conferem. Digite novamente."

## 💡 Exemplos Completos

### Exemplo 1: Login com Validação

```typescript
async function signInWithEmail() {
  // Validação antes de enviar
  if (!email) {
    showError(getValidationMessage('email', 'required'));
    return;
  }

  if (!password) {
    showError(getValidationMessage('password', 'required'));
    return;
  }

  setLoading(true);
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    showError(translateAuthError(error.message));
  } else {
    showSuccess(getSuccessMessage('login'));
    setTimeout(() => router.replace('/dashboard'), 3000);
  }
  
  setLoading(false);
}
```

### Exemplo 2: Cadastro com Validações Completas

```typescript
const handleSubmit = () => {
  // Validar nome
  if (!form.name) {
    showError(getValidationMessage('name', 'required'));
    return;
  }

  // Validar e-mail
  if (!form.email) {
    showError(getValidationMessage('email', 'required'));
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    showError(getValidationMessage('email', 'invalid'));
    return;
  }

  // Validar senha
  if (!form.password) {
    showError(getValidationMessage('password', 'required'));
    return;
  }

  if (form.password.length < 6) {
    showError(getValidationMessage('password', 'invalid'));
    return;
  }

  // Validar confirmação
  if (form.password !== form.confirmPassword) {
    showError(getValidationMessage('password', 'mismatch'));
    return;
  }

  // Tudo ok, enviar
  signUp();
};
```

### Exemplo 3: Operações CRUD

```typescript
// Criar
const criarItem = async (data) => {
  const { error } = await supabase.from('items').insert(data);
  
  if (error) {
    showError(translateAuthError(error.message));
  } else {
    showSuccess(getSuccessMessage('create'));
  }
};

// Atualizar
const atualizarItem = async (id, data) => {
  const { error } = await supabase.from('items').update(data).eq('id', id);
  
  if (error) {
    showError(translateAuthError(error.message));
  } else {
    showSuccess(getSuccessMessage('update'));
  }
};

// Deletar
const deletarItem = async (id) => {
  const { error } = await supabase.from('items').delete().eq('id', id);
  
  if (error) {
    showError(translateAuthError(error.message));
  } else {
    showSuccess(getSuccessMessage('delete'));
  }
};
```

## 🎨 Personalização

### Adicionar Novos Erros

Edite `src/utils/errorMessages.ts` e adicione no `errorMap`:

```typescript
const errorMap: Record<string, string> = {
  // ... erros existentes
  'New error message': 'Nova mensagem traduzida e amigável',
};
```

### Adicionar Novas Mensagens de Sucesso

```typescript
const successMap: Record<string, string> = {
  // ... mensagens existentes
  'minha_acao': '🎉 Minha ação foi concluída!',
};
```

### Adicionar Novos Campos de Validação

```typescript
const messages: Record<string, Record<string, string>> = {
  'required': {
    // ... campos existentes
    'novo_campo': 'Por favor, informe o novo campo.',
  },
  'invalid': {
    // ... campos existentes
    'novo_campo': 'O novo campo informado não é válido.',
  },
};
```

## ✅ Benefícios

1. **UX Melhorada**: Usuários entendem exatamente o que aconteceu
2. **Profissionalismo**: Mensagens consistentes e bem escritas
3. **Manutenibilidade**: Centralizadas em um único arquivo
4. **Escalabilidade**: Fácil adicionar novos erros e mensagens
5. **I18n Ready**: Base para internacionalização futura

## 🚀 Resultado Final

### Antes ❌
```
Error: Invalid login credentials
```

### Agora ✅
```
E-mail ou senha incorretos. Verifique seus dados e tente novamente.
```

Com toast verde/vermelho, ícone apropriado e barra de progresso! 🎉
