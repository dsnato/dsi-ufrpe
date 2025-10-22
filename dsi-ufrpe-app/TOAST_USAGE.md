# 🎉 Sistema de Notificações Toast

## Visão Geral

Sistema de notificações moderno com modal deslizante animado que aparece no topo da tela, com:
- ✅ Ícone de sucesso (verde)
- ❌ Ícone de erro (vermelho)
- ℹ️ Ícone de informação (azul)
- ⏱️ Barra de progresso indicando tempo de exibição (3 segundos padrão)
- 🎨 Cores condizentes com o tipo de notificação
- ✨ Animações suaves de entrada e saída

## Como Usar

### Importar o hook useToast

```typescript
import { useToast } from '@/src/components/ToastContext';
```

### Usar no componente

```typescript
const MeuComponente = () => {
  const { showSuccess, showError, showInfo } = useToast();

  const handleAcao = async () => {
    try {
      // Sua lógica aqui
      const resultado = await minhaFuncao();
      
      // Mostrar sucesso
      showSuccess('Operação realizada com sucesso!');
      
    } catch (error) {
      // Mostrar erro
      showError('Ocorreu um erro ao processar a solicitação');
    }
  };

  return (
    <View>
      <Button title="Testar" onPress={handleAcao} />
    </View>
  );
};
```

## API do useToast

### `showSuccess(message, duration?)`
Exibe uma notificação de sucesso (verde)
```typescript
showSuccess('Usuário cadastrado com sucesso!');
showSuccess('Dados salvos!', 5000); // 5 segundos
```

### `showError(message, duration?)`
Exibe uma notificação de erro (vermelho)
```typescript
showError('Erro ao conectar com o servidor');
showError('Credenciais inválidas', 4000); // 4 segundos
```

### `showInfo(message, duration?)`
Exibe uma notificação informativa (azul)
```typescript
showInfo('Verifique seu e-mail');
showInfo('Processando...', 2000); // 2 segundos
```

### `showToast(config)`
Método genérico para personalizar totalmente
```typescript
showToast({
  message: 'Minha mensagem',
  type: 'success', // 'success' | 'error' | 'info'
  duration: 3000  // ms
});
```

## Exemplos Práticos

### Validação de Formulário
```typescript
const handleSubmit = () => {
  if (!email) {
    showError('Por favor, preencha o e-mail');
    return;
  }
  
  if (!isValidEmail(email)) {
    showError('E-mail inválido');
    return;
  }
  
  showSuccess('Formulário enviado!');
};
```

### Requisição Assíncrona
```typescript
const deletarItem = async (id: string) => {
  try {
    await api.delete(`/items/${id}`);
    showSuccess('Item deletado com sucesso!');
    
    // Redirecionar após 3 segundos
    setTimeout(() => {
      router.back();
    }, 3000);
    
  } catch (error) {
    showError('Erro ao deletar item');
  }
};
```

### Atualização de Dados
```typescript
const salvarPerfil = async () => {
  setLoading(true);
  
  try {
    await supabase
      .from('profiles')
      .update({ name, phone })
      .eq('id', userId);
      
    showSuccess('Perfil atualizado!');
    
  } catch (error) {
    showError('Erro ao salvar perfil');
  } finally {
    setLoading(false);
  }
};
```

### Upload de Arquivo
```typescript
const uploadImagem = async (file: File) => {
  showInfo('Fazendo upload...', 5000);
  
  try {
    const { error } = await supabase.storage
      .from('avatars')
      .upload(`${userId}/${file.name}`, file);
    
    if (error) throw error;
    
    showSuccess('Imagem enviada com sucesso!');
    
  } catch (error) {
    showError('Erro no upload da imagem');
  }
};
```

## Personalização

### Duração Personalizada
```typescript
// Toast rápido (1 segundo)
showError('Campo obrigatório', 1000);

// Toast longo (5 segundos)
showSuccess('Processamento concluído!', 5000);

// Padrão: 3 segundos
showInfo('Aguarde...');
```

### Com Redirecionamento
```typescript
const handleLogin = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    showError(error.message);
  } else {
    showSuccess('Login realizado com sucesso!');
    
    // Aguardar o toast ser exibido antes de redirecionar
    setTimeout(() => {
      router.replace('/dashboard');
    }, 3000);
  }
};
```

## Características Técnicas

### Animações
- **Entrada**: Spring animation (suave e natural)
- **Saída**: Timing animation (300ms)
- **Barra de Progresso**: Animação linear sincronizada com duração

### Ícones
- ✅ **Sucesso**: `checkmark-circle` (Ionicons)
- ❌ **Erro**: `close-circle` (Ionicons)
- ℹ️ **Info**: `information-circle` (Ionicons)

### Cores
- **Sucesso**: Verde (#10B981 / #059669)
- **Erro**: Vermelho (#EF4444 / #DC2626)
- **Info**: Azul (#3B82F6 / #2563EB)

### Posicionamento
- Z-index: 9999 (sempre no topo)
- Padding superior: 50px (abaixo da status bar)
- Largura: 100% da tela
- Sombra: Elevação para destacar

## Boas Práticas

### ✅ Fazer
- Usar mensagens curtas e claras
- Aguardar a exibição do toast antes de redirecionar
- Usar o tipo apropriado (success/error/info)
- Personalizar duração para mensagens longas

### ❌ Evitar
- Mensagens muito longas (máx. 2 linhas)
- Múltiplos toasts simultâneos
- Toast em loops ou muita frequência
- Redirecionamento imediato (sem setTimeout)

## Troubleshooting

### Toast não aparece
- Verifique se o `ToastProvider` está no `_layout.tsx`
- Confirme que está usando o hook dentro de um componente filho do Provider

### Mensagem cortada
- Reduza o tamanho da mensagem
- Use `numberOfLines={2}` já está configurado no componente

### Animação lenta
- Verifique se o dispositivo está em modo de economia de energia
- Confirme que `useNativeDriver: true` está habilitado

## Integração com Supabase

Exemplos específicos para integração com Supabase:

### Auth
```typescript
// Login
const { error } = await supabase.auth.signInWithPassword({ email, password });
if (error) showError(error.message);
else showSuccess('Bem-vindo de volta!');

// Cadastro
const { error } = await supabase.auth.signUp({ email, password });
if (error) showError(error.message);
else showInfo('Verifique seu e-mail!');

// Logout
await supabase.auth.signOut();
showSuccess('Até logo!');
```

### Database
```typescript
// Insert
const { error } = await supabase.from('items').insert(data);
if (error) showError('Erro ao criar item');
else showSuccess('Item criado!');

// Update
const { error } = await supabase.from('items').update(data).eq('id', id);
if (error) showError('Erro ao atualizar');
else showSuccess('Atualizado com sucesso!');

// Delete
const { error } = await supabase.from('items').delete().eq('id', id);
if (error) showError('Erro ao deletar');
else showSuccess('Item removido!');
```

## Conclusão

O sistema de Toast está totalmente integrado e pronto para uso em toda a aplicação. Substitui completamente os Alerts nativos com uma experiência visual muito mais moderna e agradável! 🎉
