# Guia Rápido - Mapa de Clientes

## 🎯 Como Funciona

### Visualização por Nível de Zoom

```
┌─────────────────────────────────────────┐
│  ZOOM AFASTADO (Estados)                │
│                                         │
│  ╔══════════╗  ╔══════════╗            │
│  ║    PE    ║  ║    BA    ║            │
│  ║   125    ║  ║    48    ║            │
│  ╚══════════╝  ╚══════════╝            │
│                                         │
│  • Áreas grandes coloridas              │
│  • Marcadores com total do estado       │
│  • Melhor para visão geral              │
└─────────────────────────────────────────┘

        ⬇️ APROXIMAR ZOOM ⬇️

┌─────────────────────────────────────────┐
│  ZOOM APROXIMADO (Cidades)              │
│                                         │
│  ╔════╗  ╔════╗  ╔════╗               │
│  ║RCF ║  ║OLD ║  ║JAB ║               │
│  ║ 45 ║  ║ 23 ║  ║ 32 ║               │
│  ╚════╝  ╚════╝  ╚════╝               │
│                                         │
│  • Áreas menores coloridas              │
│  • Marcadores com total da cidade       │
│  • Melhor para análise detalhada        │
└─────────────────────────────────────────┘
```

## 🎨 Legenda de Cores

Cada localização recebe automaticamente uma cor única:

- 🔴 Vermelho (#FF6B6B)
- 🔵 Turquesa (#4ECDC4)
- 🟢 Verde (#52B788)
- 🟡 Amarelo (#F7DC6F)
- 🟣 Roxo (#BB8FCE)
- 🟠 Laranja (#F8B739)
- E mais 6 variações...

As cores se repetem caso haja mais de 12 localizações.

## 🖱️ Interações

### Navegação
- **Pinça**: Aproximar/Afastar zoom
- **Arrastar**: Mover o mapa
- **Toque duplo**: Zoom rápido

### Marcadores
1. **Toque no marcador** → Abre card informativo
2. **Card mostra**:
   - Nome da localização
   - Quantidade de clientes
   - Lista de cidades (se for estado)
3. **Botão "Ver Lista"** → Futura tela de clientes filtrados

## 📊 Card Informativo

### Visualização de Cidade
```
┌────────────────────────────────┐
│ 🔵 Recife                      │
│    PE                          │
├────────────────────────────────┤
│                                │
│    👥 45 Clientes              │
│                                │
│ [Ver Lista de Clientes] →      │
└────────────────────────────────┘
```

### Visualização de Estado
```
┌────────────────────────────────┐
│ 🔴 PE                          │
│    Estado                      │
├────────────────────────────────┤
│   👥 125       🏢 8            │
│   Clientes    Cidades          │
│                                │
│ Cidades com clientes:          │
│ • Recife (45)                  │
│ • Olinda (23)                  │
│ • Jaboatão (18)                │
│ • Caruaru (15)                 │
│ • Petrolina (12)               │
│ + 3 mais                       │
│                                │
│ [Ver Lista de Clientes] →      │
└────────────────────────────────┘
```

## 🎯 Casos de Uso

### 1. Análise Geográfica Rápida
**Objetivo**: Ver distribuição geral de clientes

1. Abra o mapa
2. Observe visão de estados (zoom afastado)
3. Identifique estados com mais clientes (números maiores)
4. Compare áreas coloridas

### 2. Análise Detalhada por Cidade
**Objetivo**: Entender concentração em cidades específicas

1. Abra o mapa
2. Aproxime zoom em um estado
3. Visualize cidades individualmente
4. Toque nos marcadores para ver detalhes

### 3. Planejamento de Expansão
**Objetivo**: Identificar oportunidades

1. Observe regiões sem clientes (sem cor)
2. Compare densidade entre cidades
3. Use informações para estratégia comercial

### 4. Suporte Regional
**Objetivo**: Organizar atendimento por região

1. Visualize distribuição por estado
2. Toque em estado para ver cidades
3. Planeje equipes baseado em concentração

## ⚙️ Configurações e Ajustes

### Alterar Threshold de Zoom
Arquivo: `ClienteClusteringService.ts`

```typescript
static shouldShowCities(latitudeDelta: number): boolean {
    return latitudeDelta < 1.0; // Ajuste este valor
}
```

- Valor menor (0.5): Mostra cidades só com zoom muito próximo
- Valor maior (2.0): Mostra cidades mesmo com zoom afastado

### Alterar Raio dos Polígonos
Arquivo: `ClienteClusteringService.ts`

```typescript
static calculateRadius(count: number, isCity: boolean): number {
    if (isCity) {
        return Math.min(5 + count * 0.5, 15); // Ajuste aqui
    } else {
        return Math.min(30 + count * 2, 100); // E aqui
    }
}
```

### Adicionar Mais Cores
Arquivo: `ClienteClusteringService.ts`

```typescript
private static readonly COLORS = [
    '#FF6B6B', // Suas cores...
    '#NOVACOLOR', // Adicione aqui
];
```

## 🐛 Solução de Problemas Comuns

### Mapa não muda de nível ao dar zoom
**Causa**: Threshold de zoom muito alto/baixo
**Solução**: Ajuste o valor em `shouldShowCities()`

### Polígonos muito grandes/pequenos
**Causa**: Raio de cálculo inadequado
**Solução**: Ajuste valores em `calculateRadius()`

### Cores repetindo muito
**Causa**: Poucas cores disponíveis
**Solução**: Adicione mais cores no array `COLORS`

### Cidade não aparece no mapa
**Causa**: Coordenadas não cadastradas
**Solução**: Adicione em `CITY_COORDINATES`

## 📚 Recursos Adicionais

- [React Native Maps Docs](https://github.com/react-native-maps/react-native-maps)
- [Expo Location Docs](https://docs.expo.dev/versions/latest/sdk/location/)
- [Clustering Algorithms](https://en.wikipedia.org/wiki/Cluster_analysis)

## 💡 Dicas de Performance

1. **Muitos clientes?** Considere implementar clustering real (não circular)
2. **Animações lentas?** Desative animações em dispositivos lentos
3. **Carregamento lento?** Implemente lazy loading por região
4. **Dados desatualizados?** Adicione refresh manual/automático

---

**Versão**: 2.0 (Clustering Hierárquico)  
**Última atualização**: Novembro 2025
