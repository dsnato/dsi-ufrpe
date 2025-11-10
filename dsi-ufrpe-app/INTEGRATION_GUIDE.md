# 🔌 Guia de Integração - Services com Telas

Este guia mostra como integrar os services do Supabase com as telas do app.

---

## 📋 Índice

1. [Estrutura dos Services](#estrutura-dos-services)
2. [Padrão de Integração](#padrão-de-integração)
3. [Exemplo Completo - Quartos](#exemplo-completo---quartos)
4. [Exemplo Completo - Clientes](#exemplo-completo---clientes)
5. [Tratamento de Erros](#tratamento-de-erros)
6. [Loading States](#loading-states)
7. [Próximos Passos](#próximos-passos)

---

## 1. Estrutura dos Services

Os services estão organizados em:

```
src/services/
├── quartosService.ts          - CRUD de Quartos
├── clientesService.ts         - CRUD de Clientes
├── funcionariosService.ts     - CRUD de Funcionários
├── reservasService.ts         - CRUD de Reservas + Check-in/out
└── atividadesService.ts       - CRUD de Atividades
```

Cada service exporta funções para:
- ✅ **Listar** (GET all)
- ✅ **Buscar por ID** (GET one)
- ✅ **Criar** (POST)
- ✅ **Atualizar** (PUT)
- ✅ **Excluir** (DELETE)

---

## 2. Padrão de Integração

### 2.1. Imports Necessários

```typescript
import { useState, useEffect } from 'react';
import { 
  listarQuartos, 
  criarQuarto, 
  atualizarQuarto, 
  excluirQuarto 
} from '@/services/quartosService';
import type { Quarto } from '@/services/quartosService';
```

### 2.2. Estados para Controle

```typescript
const [dados, setDados] = useState<Quarto[]>([]);
const [loading, setLoading] = useState(true);
const [erro, setErro] = useState<string | null>(null);
```

### 2.3. Buscar Dados (useEffect)

```typescript
useEffect(() => {
  carregarDados();
}, []);

const carregarDados = async () => {
  try {
    setLoading(true);
    setErro(null);
    const resultado = await listarQuartos();
    setDados(resultado);
  } catch (error) {
    console.error('Erro ao carregar:', error);
    setErro(error instanceof Error ? error.message : 'Erro desconhecido');
  } finally {
    setLoading(false);
  }
};
```

### 2.4. Criar Novo Registro

```typescript
const handleCriar = async () => {
  try {
    setLoading(true);
    const novoQuarto = await criarQuarto({
      numero_quarto: numero,
      tipo,
      capacidade: parseInt(capacidade),
      preco_diario: parseFloat(preco)
    });
    
    Alert.alert('Sucesso', 'Quarto criado com sucesso!');
    router.back(); // Volta para a tela anterior
  } catch (error) {
    Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao criar quarto');
  } finally {
    setLoading(false);
  }
};
```

### 2.5. Atualizar Registro

```typescript
const handleAtualizar = async () => {
  try {
    setLoading(true);
    await atualizarQuarto(id, {
      numero_quarto: numero,
      tipo,
      capacidade: parseInt(capacidade),
      preco_diario: parseFloat(preco)
    });
    
    Alert.alert('Sucesso', 'Quarto atualizado!');
    router.back();
  } catch (error) {
    Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao atualizar');
  } finally {
    setLoading(false);
  }
};
```

### 2.6. Excluir Registro

```typescript
const handleExcluir = () => {
  Alert.alert(
    'Confirmar Exclusão',
    'Tem certeza que deseja excluir este quarto?',
    [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Excluir', 
        style: 'destructive',
        onPress: async () => {
          try {
            setLoading(true);
            await excluirQuarto(id);
            Alert.alert('Sucesso', 'Quarto excluído!');
            router.back();
          } catch (error) {
            Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao excluir');
          } finally {
            setLoading(false);
          }
        }
      }
    ]
  );
};
```

---

## 3. Exemplo Completo - Quartos

### 3.1. Tela de Listagem (`ListagemQuarto/index.tsx`)

```typescript
import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { listarQuartos } from '@/services/quartosService';
import type { Quarto } from '@/services/quartosService';

export default function ListagemQuarto() {
  const [quartos, setQuartos] = useState<Quarto[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    carregarQuartos();
  }, []);

  const carregarQuartos = async () => {
    try {
      setLoading(true);
      setErro(null);
      const dados = await listarQuartos();
      setQuartos(dados);
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Erro ao carregar quartos';
      setErro(mensagem);
      Alert.alert('Erro', mensagem);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    carregarQuartos();
  };

  if (loading && !refreshing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={quartos}
        keyExtractor={(item) => item.id!}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/screens/Quarto/InfoQuarto?id=${item.id}`)}
          >
            {/* Componente de item aqui */}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
```

### 3.2. Tela de Criação (`CriacaoQuarto/index.tsx`)

```typescript
import React, { useState } from 'react';
import { View, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { criarQuarto } from '@/services/quartosService';

export default function CriacaoQuarto() {
  const [numero, setNumero] = useState('');
  const [tipo, setTipo] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [preco, setPreco] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validarCampos = (): boolean => {
    if (!numero.trim()) {
      Alert.alert('Erro', 'Número do quarto é obrigatório');
      return false;
    }
    if (!tipo.trim()) {
      Alert.alert('Erro', 'Tipo do quarto é obrigatório');
      return false;
    }
    if (!capacidade || parseInt(capacidade) <= 0) {
      Alert.alert('Erro', 'Capacidade inválida');
      return false;
    }
    if (!preco || parseFloat(preco) <= 0) {
      Alert.alert('Erro', 'Preço inválido');
      return false;
    }
    return true;
  };

  const handleCriar = async () => {
    if (!validarCampos()) return;

    try {
      setLoading(true);
      await criarQuarto({
        numero_quarto: numero,
        tipo,
        capacidade: parseInt(capacidade),
        preco_diario: parseFloat(preco)
      });
      
      Alert.alert(
        'Sucesso', 
        'Quarto criado com sucesso!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Erro ao criar quarto';
      Alert.alert('Erro', mensagem);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Inputs aqui */}
      
      <TouchableOpacity 
        onPress={handleCriar}
        disabled={loading}
        style={{ backgroundColor: loading ? '#ccc' : '#007bff', padding: 15 }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: '#fff', textAlign: 'center' }}>Criar Quarto</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
```

### 3.3. Tela de Informações (`InfoQuarto/index.tsx`)

```typescript
import React, { useState, useEffect } from 'react';
import { View, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { buscarQuartoPorId, excluirQuarto } from '@/services/quartosService';
import type { Quarto } from '@/services/quartosService';

export default function InfoQuarto() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [quarto, setQuarto] = useState<Quarto | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      carregarQuarto();
    }
  }, [id]);

  const carregarQuarto = async () => {
    try {
      setLoading(true);
      const dados = await buscarQuartoPorId(id);
      setQuarto(dados);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados do quarto');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = () => {
    router.push(`/screens/Quarto/EdicaoQuarto?id=${id}`);
  };

  const handleExcluir = () => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir o quarto ${quarto?.numero_quarto}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await excluirQuarto(id);
              Alert.alert('Sucesso', 'Quarto excluído com sucesso!');
              router.back();
            } catch (error) {
              Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao excluir');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!quarto) {
    return <View><Text>Quarto não encontrado</Text></View>;
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Exibir dados do quarto */}
      
      <TouchableOpacity onPress={handleEditar}>
        <Text>Editar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={handleExcluir}>
        <Text style={{ color: 'red' }}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### 3.4. Tela de Edição (`EdicaoQuarto/index.tsx`)

```typescript
import React, { useState, useEffect } from 'react';
import { View, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { buscarQuartoPorId, atualizarQuarto } from '@/services/quartosService';

export default function EdicaoQuarto() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [numero, setNumero] = useState('');
  const [tipo, setTipo] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [preco, setPreco] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    carregarQuarto();
  }, []);

  const carregarQuarto = async () => {
    try {
      const dados = await buscarQuartoPorId(id);
      if (dados) {
        setNumero(dados.numero_quarto);
        setTipo(dados.tipo);
        setCapacidade(dados.capacidade.toString());
        setPreco(dados.preco_diario.toString());
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleAtualizar = async () => {
    try {
      setLoading(true);
      await atualizarQuarto(id, {
        numero_quarto: numero,
        tipo,
        capacidade: parseInt(capacidade),
        preco_diario: parseFloat(preco)
      });
      
      Alert.alert('Sucesso', 'Quarto atualizado com sucesso!');
      router.back();
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao atualizar');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Inputs pré-preenchidos */}
      
      <TouchableOpacity onPress={handleAtualizar} disabled={loading}>
        <Text>Salvar Alterações</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## 4. Exemplo Completo - Clientes

### 4.1. Imports e Tipagem

```typescript
import { 
  listarClientes, 
  criarCliente, 
  atualizarCliente, 
  excluirCliente,
  buscarClientePorCPF 
} from '@/services/clientesService';
import type { Cliente } from '@/services/clientesService';
```

### 4.2. Validação de CPF

```typescript
const validarCPF = (cpf: string): boolean => {
  const cpfLimpo = cpf.replace(/\D/g, '');
  return cpfLimpo.length === 11;
};

const handleCriar = async () => {
  // Verificar se CPF já existe
  try {
    const clienteExistente = await buscarClientePorCPF(cpf);
    if (clienteExistente) {
      Alert.alert('Erro', 'CPF já cadastrado');
      return;
    }
  } catch (error) {
    // Continua se não encontrou
  }
  
  // Criar cliente...
};
```

---

## 5. Tratamento de Erros

### 5.1. Erros Comuns do Supabase

```typescript
const tratarErro = (error: any): string => {
  if (error.code === '23505') {
    return 'Registro duplicado (CPF, email ou número já cadastrado)';
  }
  if (error.code === '23503') {
    return 'Não é possível excluir. Existem registros relacionados.';
  }
  if (error.message.includes('JWT')) {
    return 'Sessão expirada. Faça login novamente.';
  }
  return error.message || 'Erro desconhecido';
};

// Uso:
try {
  await criarCliente(dados);
} catch (error) {
  Alert.alert('Erro', tratarErro(error));
}
```

---

## 6. Loading States

### 6.1. Loading Global

```typescript
const [loading, setLoading] = useState(false);

// No JSX:
{loading && <ActivityIndicator />}
```

### 6.2. Loading por Botão

```typescript
const [salvando, setSalvando] = useState(false);
const [excluindo, setExcluindo] = useState(false);

<TouchableOpacity disabled={salvando} onPress={handleSalvar}>
  {salvando ? <ActivityIndicator /> : <Text>Salvar</Text>}
</TouchableOpacity>
```

### 6.3. Pull to Refresh

```typescript
<FlatList
  data={dados}
  onRefresh={() => {
    setRefreshing(true);
    carregarDados();
  }}
  refreshing={refreshing}
  renderItem={...}
/>
```

---

## 7. Próximos Passos

### 7.1. Ordem de Implementação

1. ✅ **Quartos** (já tem estrutura pronta)
   - Atualizar `ListagemQuarto` com `listarQuartos()`
   - Atualizar `CriacaoQuarto` com `criarQuarto()`
   - Atualizar `InfoQuarto` com `buscarQuartoPorId()` e `excluirQuarto()`
   - Atualizar `EdicaoQuarto` com `atualizarQuarto()`

2. **Clientes**
   - Seguir mesmo padrão de Quartos
   - Adicionar validação de CPF
   - Busca por nome

3. **Funcionários**
   - Mesma estrutura
   - Filtro por cargo
   - Controle de status (Ativo/Inativo)

4. **Reservas**
   - Integração com Clientes e Quartos
   - Check-in/Check-out
   - Validação de datas
   - Verificação de disponibilidade

5. **Atividades**
   - Listagem por data
   - Controle de capacidade
   - Status (Agendada/Realizada/Cancelada)

### 7.2. Melhorias Futuras

- [ ] Context API para cache de dados
- [ ] Busca/Filtros avançados
- [ ] Paginação
- [ ] Upload de imagens (foto_quarto)
- [ ] Sincronização offline
- [ ] Notificações push

---

## ✅ Checklist de Integração

Para cada entidade, verificar:

- [ ] Service criado e exportado
- [ ] Tipagem TypeScript definida
- [ ] Tela de Listagem integrada com `listar*()`
- [ ] Tela de Criação integrada com `criar*()`
- [ ] Tela de Info integrada com `buscar*PorId()` e `excluir*()`
- [ ] Tela de Edição integrada com `atualizar*()`
- [ ] Loading states implementados
- [ ] Tratamento de erros implementado
- [ ] Validações de campos
- [ ] Navegação funcionando (router.push/back)
- [ ] Testado no app

---

**Boa integração! 🚀**
