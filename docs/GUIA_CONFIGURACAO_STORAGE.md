# 🖼️ Guia de Configuração do Storage de Imagens

## Problema

Erro "Network request failed" ao fazer upload de imagens das atividades.

## Causa

O erro ocorre porque:
1. O bucket `atividades-images2` não existe ou não está configurado corretamente
2. As políticas RLS (Row Level Security) do Storage não estão configuradas
3. O bucket não está marcado como público

## ✅ Solução Completa

### Passo 1: Criar o Bucket no Supabase

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. No menu lateral, vá em **Storage**
4. Clique em **Create a new bucket**
5. Configure o bucket:
   - **Name**: `atividades-images2`
   - **Public bucket**: ✅ **MARQUE ESTA OPÇÃO** (muito importante!)
   - **Allowed MIME types**: Deixe vazio ou adicione `image/jpeg, image/png, image/jpg`
   - **File size limit**: 5MB ou conforme necessário
6. Clique em **Create bucket**

### Passo 2: Configurar Políticas RLS

1. No Supabase Dashboard, vá em **SQL Editor**
2. Clique em **New Query**
3. Cole o conteúdo do arquivo `SUPABASE_STORAGE_SETUP.sql`
4. Clique em **Run** (Executar)

Ou execute manualmente cada política:

```sql
-- 1. Leitura pública
CREATE POLICY "Permitir leitura pública de imagens"
ON storage.objects FOR SELECT
USING (bucket_id = 'atividades-images2');

-- 2. Upload permitido
CREATE POLICY "Permitir upload de imagens"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'atividades-images2');

-- 3. Atualização permitida
CREATE POLICY "Permitir atualização de imagens"
ON storage.objects FOR UPDATE
USING (bucket_id = 'atividades-images2')
WITH CHECK (bucket_id = 'atividades-images2');

-- 4. Exclusão permitida
CREATE POLICY "Permitir exclusão de imagens"
ON storage.objects FOR DELETE
USING (bucket_id = 'atividades-images2');
```

### Passo 3: Verificar Configuração

1. Vá em **Storage** → **atividades-images2**
2. Tente fazer upload manual de uma imagem
3. Se funcionar, a configuração está correta!

### Passo 4: Testar no App

1. Reinicie o app React Native
2. Tente criar uma nova atividade com imagem
3. Verifique os logs no terminal

## 🔍 Verificando os Logs

Os logs agora são mais detalhados:

```
🔵 [atividadesService] Upload de imagem iniciado
🔵 [atividadesService] Atividade ID: xxx
🔵 [atividadesService] URI: file://...
🔵 [atividadesService] FilePath: atividades/xxx/timestamp.jpg
🔵 [atividadesService] Fazendo fetch da URI local...
🔵 [atividadesService] Fetch status: 200
🔵 [atividadesService] ArrayBuffer size: xxx bytes
🔵 [atividadesService] Enviando arquivo para storage...
🔵 [atividadesService] Tamanho do arquivo: xxx bytes
✅ [atividadesService] Upload concluído: atividades/xxx/timestamp.jpg
🔵 [atividadesService] URL pública: https://...
✅ [atividadesService] Atividade atualizada com URL da imagem
```

## ❌ Possíveis Erros e Soluções

### Erro: "Bucket not found"
**Solução**: Certifique-se de que o bucket `atividades-images2` existe e o nome está correto.

### Erro: "new row violates row-level security policy"
**Solução**: Execute as políticas RLS do Passo 2.

### Erro: "Network request failed" persiste
**Soluções**:
1. Verifique se o bucket está marcado como **Public**
2. Verifique sua conexão com a internet
3. Verifique se a URL do Supabase está correta no arquivo `.env`
4. Tente deletar e recriar o bucket

### Erro: "Invalid file"
**Solução**: Verifique se a URI da imagem está correta e se o arquivo existe.

## 🔧 Código Melhorado

O código de upload foi melhorado com:

1. **Logs mais detalhados** para debug
2. **Melhor tratamento de erros** com mensagens específicas
3. **Suporte a ArrayBuffer** para React Native
4. **Validação do tamanho do arquivo** antes do upload
5. **Verificação de fetch status** para detectar problemas cedo

## 📝 Estrutura de Pastas no Storage

```
atividades-images2/
└── atividades/
    └── {atividadeId}/
        └── {timestamp}.jpg
```

Exemplo:
```
atividades-images2/
└── atividades/
    └── ba0d3f6a-762d-44a2-be9e-e62b693f61a0/
        └── 1700265234567.jpg
```

## 🎯 Próximos Passos

Após a configuração:

1. ✅ Upload de imagens funcionando
2. ✅ Imagens sendo exibidas na listagem
3. ✅ Exclusão de imagens funcionando
4. ✅ URLs públicas sendo geradas corretamente

## 🔒 Segurança (Para Produção)

**IMPORTANTE**: As políticas atuais permitem acesso público para facilitar o desenvolvimento.

Para produção, considere adicionar autenticação:

```sql
-- Upload apenas para usuários autenticados
CREATE POLICY "Upload apenas autenticado"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'atividades-images2' 
  AND auth.role() = 'authenticated'
);
```

## 📞 Suporte

Se o erro persistir:
1. Verifique os logs completos no terminal
2. Teste o upload manual no Supabase Dashboard
3. Verifique se todas as políticas foram criadas corretamente
4. Certifique-se de que o bucket está público
