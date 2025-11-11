# Funcionalidade de Mapa de Clientes

## 📍 Visão Geral

A funcionalidade de Mapa de Clientes permite visualizar geograficamente a distribuição de clientes através de um sistema inteligente de clustering hierárquico com **três níveis de zoom**. O mapa se adapta automaticamente ao nível de zoom, mostrando **estados** (zoom afastado), **cidades** (zoom intermediário) ou **clientes individuais** (zoom muito próximo).

## ✨ Recursos Principais

### 🎯 Visualização Hierárquica em 3 Níveis

1. **Zoom Afastado - Estados** (latitudeDelta >= 1.0)
   - Polígonos coloridos representando estados com clientes
   - Marcadores centralizados mostrando total de clientes no estado
   - Lista de cidades dentro do estado ao clicar

2. **Zoom Intermediário - Cidades** (0.05 <= latitudeDelta < 1.0)
   - Polígonos coloridos representando cidades com clientes
   - Marcadores mostrando quantidade de clientes na cidade
   - Detalhes específicos da cidade ao clicar

3. **Zoom Muito Próximo - Clientes Individuais** (latitudeDelta < 0.05)
   - Pins individuais para cada cliente
   - Ícone de pessoa em cada marcador
   - Card com informações completas do cliente ao clicar
   - Botão para ver detalhes completos do cliente

### 🌈 Sistema de Cores
- Cada cidade/estado recebe uma cor única automaticamente
- Polígonos semitransparentes para visualizar sobreposições
- Bordas coloridas para delimitar áreas
- Marcadores com as mesmas cores das áreas correspondentes

### 📊 Clustering Inteligente
- Agrupamento automático de clientes por localização
- Apenas locais com clientes são exibidos no mapa
- Contadores dinâmicos em cada marcador
- Transição suave entre visualizações ao dar zoom

### 💡 Interatividade
- **Toque nos marcadores** para ver informações detalhadas
- **Card informativo** com:
  - Nome da cidade/estado
  - Quantidade total de clientes
  - Lista de cidades (quando visualizando estado)
  - Indicador visual de cor
- **Zoom automático** para enquadrar todas as localizações
- **Indicador de nível** mostrando se está visualizando cidades ou estados

## 🗺️ Como Usar

1. Navegue até a tela de **Listagem de Clientes**
2. Clique no botão **"Mapa de cliente"**
3. Aguarde o carregamento (agrupamento automático)
4. **Visualização inicial**: Estados (zoom afastado)
5. **Aproxime o zoom** para ver cidades individuais
6. **Toque nos marcadores** para ver detalhes
7. Use **"Ver Lista de Clientes"** para filtrar

## 🏗️ Arquitetura

### Novos Componentes

1. **MapaCliente** (`src/app/screens/Cliente/MapaCliente/index.tsx`)
   - Componente principal com lógica de clustering hierárquico
   - Gerencia transição entre visualizações de cidade/estado
   - Renderiza polígonos e marcadores dinamicamente
   - Card informativo interativo

2. **ClienteClusteringService** (`src/services/ClienteClusteringService.ts`)
   - Algoritmos de agrupamento por cidade e estado
   - Geração de coordenadas para polígonos circulares
   - Sistema de cores automático
   - Detecção de nível de zoom
   - Cálculo de raios proporcionais ao número de clientes

3. **GeocodingService** (`src/services/GeocodingService.ts`)
   - Mantido para compatibilidade futura
   - Pode ser usado para geocodificação precisa

### Estruturas de Dados

```typescript
interface CityCluster {
    city: string;
    state: string;
    count: number;
    coordinates: { latitude: number; longitude: number };
    color: string;
    clients: Cliente[];
}

interface StateCluster {
    state: string;
    count: number;
    coordinates: { latitude: number; longitude: number };
    color: string;
    cities: CityCluster[];
}
```

### Dependências Adicionadas

- `react-native-maps`: Biblioteca nativa para exibição de mapas
- `expo-location`: Utilitários de localização do Expo

## 🔧 Configuração

### Android

O app.json foi configurado com uma chave de API do Google Maps (dummy para desenvolvimento):

```json
{
  "android": {
    "config": {
      "googleMaps": {
        "apiKey": "AIzaSyDummyKeyForDevelopment"
      }
    }
  }
}
```

**⚠️ IMPORTANTE**: Para produção, você deve:

1. Obter uma chave de API real do Google Cloud Console
2. Ativar a API do Google Maps para Android
3. Substituir a chave dummy pela chave real

### iOS

Para iOS, adicione a chave de API no app.json:

```json
{
  "ios": {
    "config": {
      "googleMapsApiKey": "SUA_CHAVE_AQUI"
    }
  }
}
```

## � Sistema de Visualização

### Algoritmo de Clustering

1. **Agrupamento por Cidade**
   - Clientes são agrupados por cidade + estado
   - Cada grupo recebe uma cor única
   - Coordenadas centrais baseadas em banco de dados de cidades
   - Raio proporcional ao número de clientes (5-15 km)

2. **Agrupamento por Estado**
   - Clientes são agrupados por estado
   - Agrupa todas as cidades do estado
   - Coordenadas centrais do estado
   - Raio maior proporcional à quantidade (30-100 km)

### Detecção de Zoom

- **Threshold**: `latitudeDelta < 1.0`
- **Zoom aproximado** (delta < 1.0): Mostra cidades
- **Zoom afastado** (delta >= 1.0): Mostra estados
- Transição automática ao movimentar o mapa

### Polígonos Coloridos

- Gerados como círculos de 32 pontos
- Cor semitransparente (25% opacity) para o preenchimento
- Borda sólida na cor do cluster
- Tamanho proporcional ao número de clientes

### Marcadores com Contador

- Círculos coloridos com número de clientes
- Mesma cor do polígono correspondente
- Borda branca para contraste
- Posicionados no centro do cluster

## 🌐 Coordenadas e Localização

### Cidades Suportadas (Pernambuco)

O sistema possui coordenadas pré-configuradas para as principais cidades de PE:
- Recife, Olinda, Jaboatão dos Guararapes
- Caruaru, Petrolina, Garanhuns
- E outras 25+ cidades

### Estados Suportados

Coordenadas para todos os estados do Nordeste e principais estados do Brasil:
- PE, BA, CE, RN, PB, SE, AL, MA, PI
- SP, RJ, MG, RS, PR, SC
- E outros

### Fallback Automático

Se uma cidade não estiver no banco:
- Usa coordenadas do estado com variação aleatória
- Evita sobreposição de múltiplas cidades desconhecidas
- Mantém visualização funcional mesmo com dados incompletos

## 📱 Interface

### Elementos da Tela

1. **Header**
   - Botão de voltar
   - Título "Mapa de Clientes"
   - Botão home

2. **Barra de Informações**
   - Ícone de localização
   - Contador de clientes localizados

3. **Mapa**
   - Marcadores customizados (pins azuis com ícone de pessoa)
   - Zoom e pan interativos
   - Botão de localização do usuário

4. **Card de Informações** (ao selecionar um marcador)
   - Nome do cliente
   - CPF
   - Endereço completo
   - Telefone
   - Email
   - Botão para ver detalhes completos

## 🎨 Estilização

- **Cores principais**: #4BBAED (azul), #132F3B (azul escuro)
- **Marcadores**: Pins azuis circulares com borda branca
- **Card**: Fundo branco com sombra e cantos arredondados
- **Responsivo**: Adapta-se a diferentes tamanhos de tela

## 🚀 Melhorias Futuras

### Funcionalidades Planejadas

- [ ] **Tela de lista filtrada**: Implementar navegação para lista de clientes do cluster selecionado
- [ ] **Níveis adicionais**: Adicionar visualização por bairro (zoom muito próximo)
- [ ] **Filtros avançados**: Filtrar por período de cadastro, status, etc.
- [ ] **Mapas de calor**: Visualização alternativa de densidade de clientes
- [ ] **Exportação de dados**: Exportar estatísticas por região
- [ ] **Animações**: Transições suaves entre níveis de zoom
- [ ] **Modo comparativo**: Comparar períodos diferentes

### Otimizações Técnicas

- [ ] **Cache de polígonos**: Evitar recálculo a cada renderização
- [ ] **Lazy loading**: Carregar dados sob demanda baseado na região visível
- [ ] **WebWorkers**: Processar clustering em background
- [ ] **Memoization**: Cachear resultados de agrupamento
- [ ] **Debouncing**: Otimizar detecção de mudança de zoom

### Dados e Integração

- [ ] **Banco de coordenadas completo**: Adicionar todas as cidades brasileiras
- [ ] **API de geocoding**: Integrar com serviço de geocodificação real
- [ ] **Sincronização**: Atualizar mapa em tempo real quando clientes mudarem
- [ ] **Histórico**: Visualizar evolução da base de clientes ao longo do tempo

## 🐛 Troubleshooting

### Mapa não aparece no Android
- Verifique se a chave de API do Google Maps está configurada
- Certifique-se de que a API está ativada no Google Cloud Console
- Verifique o SHA-1 do app no console do Google

### Marcadores não aparecem
- Verifique o console para erros de geocodificação
- Confirme que os endereços dos clientes estão completos
- Teste o serviço de geocodificação isoladamente

### Performance lenta
- Considere implementar cache de coordenadas
- Use clustering para muitos marcadores
- Implemente carregamento lazy dos marcadores

## 📄 Licença

Este componente faz parte do projeto DSI-UFRPE e segue a mesma licença do projeto principal.
