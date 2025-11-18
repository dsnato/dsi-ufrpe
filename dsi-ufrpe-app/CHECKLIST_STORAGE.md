# ✅ Checklist Rápido - Configuração de Upload de Imagens

Execute estes passos **na ordem** para resolver o erro "Network request failed":

## 1️⃣ Criar Bucket no Supabase (OBRIGATÓRIO)

- [ ] Acesse: https://app.supabase.com
- [ ] Vá em **Storage** → **Create a new bucket**
- [ ] Nome: `atividades-images2`
- [ ] ✅ **Marcar como PUBLIC** (muito importante!)
- [ ] Criar bucket

## 2️⃣ Configurar Políticas RLS (OBRIGATÓRIO)

- [ ] Vá em **SQL Editor** → **New Query**
- [ ] Cole o conteúdo de `SUPABASE_STORAGE_SETUP.sql`
- [ ] Execute (Run)
- [ ] Verifique se não há erros

## 3️⃣ Testar Upload Manual (RECOMENDADO)

- [ ] Vá em **Storage** → **atividades-images2**
- [ ] Clique em **Upload file**
- [ ] Faça upload de uma imagem qualquer
- [ ] Se funcionar = configuração OK! ✅

## 4️⃣ Testar no App

- [ ] Reinicie o app (recarregue)
- [ ] Crie uma nova atividade
- [ ] Adicione uma imagem
- [ ] Verifique os logs no terminal

## ⚠️ Se ainda não funcionar

Verifique:
- [ ] Bucket está marcado como **Public**?
- [ ] Políticas RLS foram criadas sem erros?
- [ ] URL do Supabase está correta no `.env`?
- [ ] Internet está funcionando?

## 📝 Referências

- Guia completo: `GUIA_CONFIGURACAO_STORAGE.md`
- Script SQL: `SUPABASE_STORAGE_SETUP.sql`
