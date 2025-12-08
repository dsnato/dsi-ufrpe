# Upload de Imagens para Clientes

## 📋 Visão Geral

O sistema agora suporta upload de fotos para clientes, permitindo adicionar uma foto durante o cadastro e editar/remover posteriormente.

## 🚀 Configuração Inicial

### 1. Executar Script SQL no Supabase

Execute o arquivo `SUPABASE_CLIENTES_STORAGE_SETUP.sql` no SQL Editor do Supabase:

```sql
-- O script irá:
-- ✅ Criar o bucket 'clientes-images' (público)
-- ✅ Configurar políticas de acesso (RLS)
-- ✅ Adicionar coluna 'imagem_url' na tabela 'clientes'
-- ✅ Configurar limite de 5MB por arquivo
-- ✅ Aceitar apenas imagens (JPEG, PNG, WebP)
```

### 2. Verificar Criação do Bucket

No painel do Supabase:
1. Vá em **Storage**
2. Verifique se o bucket `clientes-images` foi criado
3. Confirme que está marcado como **Public**

## 🎯 Funcionalidades Implementadas

### ✅ Cadastro de Cliente com Foto

**Tela:** `src/app/screens/Cliente/CriacaoCliente/index.tsx`

- Campo de upload de imagem acima do formulário
- Opções: Galeria ou Câmera
- Preview da imagem selecionada
- Upload automático após criar o cliente
- Tratamento de erros (não bloqueia a criação)

**Fluxo:**
1. Usuário seleciona uma foto (opcional)
2. Preenche os dados do cliente
3. Clica em "Criar Cliente"
4. Sistema cria o cliente primeiro
5. Se houver foto, faz o upload
6. Cliente é criado mesmo se upload falhar

### ✅ Edição de Foto do Cliente

**Tela:** `src/app/screens/Cliente/EdicaoCliente/index.tsx`

- Exibe foto atual (se existir)
- Permite alterar a foto
- Permite remover a foto
- Upload automático ao salvar

**Fluxo:**
1. Sistema carrega foto atual
2. Usuário pode:
   - Alterar a foto (seleciona nova)
   - Remover a foto (clica em "Remover")
   - Manter a foto (não faz nada)
3. Ao salvar:
   - Se nova foto: faz upload
   - Se removida: deleta do storage
   - Se mantida: não altera

## 📂 Estrutura de Arquivos no Storage

```
clientes-images/
└── {cliente_id}/
    └── {timestamp}.jpg
```

**Exemplo:**
```
clientes-images/
└── a1b2c3d4-e5f6-7890-abcd-ef1234567890/
    ├── 1700000001234.jpg  (primeira foto)
    └── 1700000005678.jpg  (foto atualizada)
```

## 🔧 Funções do Service

### `uploadImagemCliente(clienteId, uri, fileName?)`

Faz upload de uma imagem para o cliente.

**Parâmetros:**
- `clienteId`: ID do cliente
- `uri`: URI da imagem (file://, data:, ou http://)
- `fileName`: Nome do arquivo (opcional)

**Retorna:** URL pública da imagem

**Exemplo:**
```typescript
const imageUrl = await uploadImagemCliente(
  'cliente-uuid',
  'file:///path/to/image.jpg'
);
// Retorna: https://...supabase.co/storage/v1/object/public/clientes-images/...
```

### `removerImagemCliente(clienteId)`

Remove a imagem de um cliente.

**Parâmetros:**
- `clienteId`: ID do cliente

**Exemplo:**
```typescript
await removerImagemCliente('cliente-uuid');
// Remove do storage e limpa imagem_url no banco
```

## 🎨 Componente ImagePicker

O componente `ImagePicker` já existente foi reutilizado:

**Props:**
- `imageUri`: URI da imagem atual
- `onImageSelected`: Callback ao selecionar imagem
- `onImageRemoved`: Callback ao remover imagem
- `disabled`: Desabilita interação

**Recursos:**
- Aspect ratio 16:9
- Qualidade 0.8 (80%)
- Permissões automáticas
- Preview da imagem
- Botões de alterar/remover

## 📊 Dados do Banco

### Coluna Adicionada

```sql
-- Tabela: clientes
imagem_url TEXT  -- URL pública da foto no storage
```

**Exemplo de registro:**
```json
{
  "id": "uuid...",
  "nome_completo": "João Silva",
  "cpf": "12345678900",
  "imagem_url": "https://...supabase.co/storage/v1/object/public/clientes-images/uuid/timestamp.jpg",
  ...
}
```

## 🔒 Políticas de Segurança (RLS)

### Storage Policies

1. **INSERT**: Usuários autenticados podem fazer upload
2. **UPDATE**: Usuários autenticados podem atualizar
3. **DELETE**: Usuários autenticados podem deletar
4. **SELECT**: Acesso público para leitura (exibição)

### Limitações

- Tamanho máximo: 5MB por arquivo
- Tipos permitidos: JPEG, PNG, WebP
- Bucket público (imagens visíveis por URL)

## 🐛 Tratamento de Erros

### Logs Implementados

Todos os logs usam emojis para facilitar identificação:

- 🔵 `[clientesService]` - Operações gerais
- ✅ `[clientesService]` - Sucesso
- ❌ `[clientesService]` - Erros
- 🖼️ `[CriacaoCliente]` / `[EdicaoCliente]` - Upload de imagem

**Exemplo de log:**
```
🔵 [clientesService] Upload de imagem iniciado
🔵 [clientesService] Cliente ID: abc-123
🔵 [clientesService] URI: file:///...
🔵 [clientesService] Enviando arquivo para storage...
✅ [clientesService] Upload concluído
```

### Tratamento de Falhas

- **Upload falha**: Cliente é criado/atualizado normalmente, mostra aviso
- **Arquivo vazio**: Retorna erro específico
- **Fetch falha**: Captura e informa erro detalhado
- **Storage error**: Propaga mensagem do Supabase

## 📱 Interface do Usuário

### Tela de Criação

```
┌─────────────────────────────┐
│  Foto do Cliente            │
│  ┌───────────────────────┐  │
│  │   [Adicionar Imagem]  │  │ ← Placeholder
│  │   📷 ou Galeria       │  │
│  └───────────────────────┘  │
│                             │
│  Nome Completo *            │
│  [________________]         │
│                             │
│  ... outros campos ...      │
└─────────────────────────────┘
```

### Tela de Edição

```
┌─────────────────────────────┐
│  Foto do Cliente            │
│  ┌───────────────────────┐  │
│  │   [Imagem Atual]      │  │ ← Preview
│  └───────────────────────┘  │
│  [Alterar]  [Remover]       │ ← Botões de ação
│                             │
│  ... campos do formulário   │
└─────────────────────────────┘
```

## 🧪 Testando a Funcionalidade

### Teste de Criação

1. Abra a tela de cadastro de cliente
2. Toque no campo de imagem
3. Selecione "Galeria" ou "Câmera"
4. Escolha/tire uma foto
5. Preencha os dados obrigatórios
6. Clique em "Criar Cliente"
7. Verifique:
   - ✅ Cliente criado com sucesso
   - ✅ Foto aparece na listagem
   - ✅ Foto aparece na tela de detalhes

### Teste de Edição

1. Abra um cliente existente
2. Clique em "Editar"
3. Teste os cenários:
   - **Alterar foto**: Selecione nova foto → Salvar
   - **Remover foto**: Clique em "Remover" → Salvar
   - **Manter foto**: Não altere → Salvar
4. Verifique se as alterações foram aplicadas

### Teste de Permissões

1. **Sem autenticação**: Não deve permitir upload
2. **Com autenticação**: Deve permitir upload
3. **Visualização**: Deve funcionar sem autenticação

## 🔄 Comparação com Atividades

A implementação segue o mesmo padrão das atividades:

| Aspecto | Atividades | Clientes |
|---------|-----------|----------|
| Bucket | `atividades-images2` | `clientes-images` |
| Estrutura | `{id}/{timestamp}.jpg` | `{id}/{timestamp}.jpg` |
| Tamanho máx | 5MB | 5MB |
| Formatos | JPEG, PNG, WebP | JPEG, PNG, WebP |
| Acesso | Público | Público |
| Upload | `uploadImagemAtividade()` | `uploadImagemCliente()` |
| Remoção | `removerImagemAtividade()` | `removerImagemCliente()` |

## 📝 Próximos Passos (Opcional)

- [ ] Adicionar crop/rotação de imagem
- [ ] Compressão adicional para economizar storage
- [ ] Múltiplas fotos por cliente
- [ ] Galeria de fotos na tela de detalhes
- [ ] Sincronização com CDN
- [ ] Backup automático de imagens

## 🆘 Troubleshooting

### Erro: "Storage bucket not found"
**Solução:** Execute `SUPABASE_CLIENTES_STORAGE_SETUP.sql`

### Erro: "Permission denied"
**Solução:** Verifique se as políticas RLS foram criadas corretamente

### Erro: "File too large"
**Solução:** A imagem excede 5MB. Implemente compressão antes do upload

### Erro: "Invalid file type"
**Solução:** O arquivo não é JPEG, PNG ou WebP

### Imagem não aparece
**Solução:** 
1. Verifique se o bucket está público
2. Confirme que a URL está correta no banco
3. Teste a URL diretamente no navegador

## 📚 Referências

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
- [React Native Image Component](https://reactnative.dev/docs/image)
