# Configuração de Variáveis de Ambiente

## 📋 Pré-requisitos

Este projeto usa variáveis de ambiente para gerenciar configurações sensíveis como credenciais do Supabase.

## 🚀 Configuração Inicial

### 1. Criar arquivo .env

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

### 2. Obter credenciais do Supabase

1. Acesse [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **Settings** → **API**
4. Copie as seguintes informações:
   - **Project URL** (URL do projeto)
   - **anon/public key** (chave pública/anon)

### 3. Preencher o arquivo .env

Abra o arquivo `.env` e preencha com suas credenciais reais:

```env
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

> ⚠️ **IMPORTANTE**: O arquivo `.env` está no `.gitignore` e NÃO será commitado. Nunca compartilhe suas credenciais!

## 🔧 Como funciona

### Prefixo EXPO_PUBLIC_

O Expo requer que variáveis de ambiente acessíveis no client-side (código React Native) tenham o prefixo `EXPO_PUBLIC_`. Isso é uma medida de segurança para evitar exposição acidental de segredos do servidor.

### Acessando variáveis no código

```typescript
// ✅ Correto - com prefixo EXPO_PUBLIC_
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL

// ❌ Errado - sem prefixo (não funcionará)
const supabaseUrl = process.env.SUPABASE_URL
```

### TypeScript Support

Se quiser tipagem TypeScript para suas variáveis de ambiente, crie um arquivo `env.d.ts`:

```typescript
declare module '@env' {
  export const EXPO_PUBLIC_SUPABASE_URL: string;
  export const EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
}
```

## 🔄 Reiniciar o servidor

Após modificar o arquivo `.env`, você DEVE reiniciar o servidor Expo:

```bash
# Parar o servidor atual (Ctrl+C)
# Limpar cache e reiniciar
npx expo start -c
```

## 📝 Boas Práticas

1. ✅ **SEMPRE** use `.env.example` como template
2. ✅ **NUNCA** commite o arquivo `.env`
3. ✅ **SEMPRE** reinicie o servidor após mudanças no `.env`
4. ✅ Use `EXPO_PUBLIC_` apenas para dados que podem ser públicos
5. ❌ **NUNCA** coloque chaves secretas do servidor com prefixo `EXPO_PUBLIC_`

## 🐛 Troubleshooting

### Variáveis retornam undefined

1. Verifique se o arquivo `.env` está na raiz do projeto
2. Confirme que as variáveis têm o prefixo `EXPO_PUBLIC_`
3. Reinicie o servidor com cache limpo: `npx expo start -c`

### Erro "Faltam variáveis de ambiente do Supabase"

Você esqueceu de preencher o arquivo `.env` com suas credenciais reais. Siga os passos da seção "Configuração Inicial".

## 📚 Mais informações

- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [Supabase Documentation](https://supabase.com/docs)
