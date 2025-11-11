# 📋 Backlog do Produto - Sistema de Gestão Hoteleira

## 🔄 TAREFAS MAPEADAS

---

### **TASK-01: Refatoração Design - Tela de Edição de Entidades**

**Detalhamento:**
Padronizar e melhorar a interface visual das telas de edição (Quarto, Cliente, Funcionário, Reserva, Atividade), aplicando design system consistente com cores, espaçamentos e componentes já utilizados no app.

**Telas Afetadas:**
- src/app/screens/Quarto/EdicaoQuarto
- src/app/screens/Cliente/EdicaoCliente
- src/app/screens/Funcionario/EdicaoFuncionario
- src/app/screens/Reserva/EdicaoReserva
- src/app/screens/Atividade/EdicaoAtividade

**Critérios de Aceitação - Design:**
- Layout consistente com a tela de criação
- Botão de voltar visível e funcional no canto superior esquerdo
- Campos de entrada com labels claras e asterisco vermelho para campos obrigatórios
- Botão de confirmação com tamanho adequado e posicionado na parte inferior
- Cores seguindo o padrão: fundo azul escuro (#132F3B) no topo e cinza claro (#EFEFF0) no formulário

**Critérios de Aceitação - Funcionalidade:**
- Formulário pré-preenchido com dados atuais da entidade
- Validação de campos obrigatórios ao salvar
- Mensagem de sucesso após atualização
- Retorno automático para tela anterior após confirmação
- Scroll habilitado quando formulário exceder altura da tela

---

### **TASK-02: Integração CRUD com Supabase**

**Detalhamento:**
Substituir armazenamento local por integração real com banco de dados Supabase para todas as entidades (Quartos, Clientes, Funcionários, Reservas, Atividades), implementando operações de Create, Read, Update e Delete.

**Telas Afetadas:**
- src/app/screens/Quarto/ListagemQuarto
- src/app/screens/Quarto/CriacaoQuarto
- src/app/screens/Quarto/EdicaoQuarto
- src/app/screens/Quarto/InfoQuarto
- src/app/screens/Cliente/ListagemCliente
- src/app/screens/Cliente/CriacaoCliente
- src/app/screens/Cliente/EdicaoCliente
- src/app/screens/Cliente/InfoCliente
- src/app/screens/Funcionario/ListagemFuncionario
- src/app/screens/Funcionario/CriacaoFuncionario
- src/app/screens/Funcionario/EdicaoFuncionario
- src/app/screens/Funcionario/InfoFuncionario
- src/app/screens/Reserva/ListagemReserva
- src/app/screens/Reserva/CriacaoReserva
- src/app/screens/Reserva/EdicaoReserva
- src/app/screens/Reserva/InfoReserva
- src/app/screens/Atividade/ListagemAtividade
- src/app/screens/Atividade/CriacaoAtividade
- src/app/screens/Atividade/EdicaoAtividade
- src/app/screens/Atividade/InfoAtividade
- lib/supabase

**Critérios de Aceitação - Design:**
- Indicador de loading visível durante requisições
- Mensagens de erro amigáveis em caso de falha
- Estado vazio com mensagem explicativa quando não houver dados

**Critérios de Aceitação - Funcionalidade:**
- CREATE: Inserir nova entidade no Supabase e retornar ID gerado
- READ: Buscar e exibir lista de entidades com atualização automática
- UPDATE: Atualizar entidade existente e refletir mudanças na listagem
- DELETE: Remover entidade com confirmação e atualização da lista
- Tratamento de erros de rede e timeout
- Validação de sessão de usuário antes de operações

---

### **TASK-03: Revisão de Navegação e Roteamento**

**Detalhamento:**
Auditar e corrigir todos os fluxos de navegação do aplicativo, garantindo que botões redirecionem para telas corretas, eliminar rotas quebradas e implementar navegação consistente entre todas as funcionalidades.

**Telas Afetadas:**
- src/app/_layout
- src/components/InfoCard
- src/app/screens/(tabs)/index
- src/app/screens/(tabs)/cliente
- src/app/screens/(tabs)/reservas
- src/app/screens/Login
- src/app/screens/register
- Todas as telas com botões de ação e navegação

**Critérios de Aceitação - Design:**
- Feedback visual ao clicar em botões (opacity/animação)
- Transições suaves entre telas
- Botão voltar sempre visível e posicionado consistentemente

**Critérios de Aceitação - Funcionalidade:**
- Todos os botões "Adicionar" redirecionam para tela de criação correta
- Clique em item da lista abre tela de informações com ID correto
- Botão "Editar" redireciona para tela de edição com dados carregados
- Botão voltar retorna para tela anterior (não reinicia navegação)
- Navegação por tabs funcional e mantém estado das telas
- Redirecionamento automático após login para tela principal

---

### **TASK-04: Tela de Mapa de Origem de Hóspedes**

**Detalhamento:**
Criar tela interativa com mapa mostrando distribuição geográfica de origem dos hóspedes que se hospedaram no hotel, com marcadores e estatísticas visuais.

**Telas Afetadas:**
- src/app/screens/Mapa (nova tela)
- src/components/MapView (novo componente)
- src/app/screens/(tabs)/_layout (adicionar acesso no menu)

**Critérios de Aceitação - Design:**
- Mapa ocupando 70% da tela
- Marcadores coloridos por região/frequência
- Card inferior com estatísticas: top 5 cidades/estados
- Loading durante carregamento de dados
- Legenda de cores visível

**Critérios de Aceitação - Funcionalidade:**
- Integração com biblioteca de mapas (react-native-maps)
- Buscar dados de origem dos clientes no Supabase
- Agrupar hóspedes por cidade/estado
- Exibir marcadores com quantidade de hóspedes
- Zoom e pan habilitados no mapa
- Clique no marcador mostra detalhes em modal
- Atualização automática quando novos hóspedes cadastrados

---

### **TASK-05: Tela de Recuperação de Senha**

**Detalhamento:**
Implementar fluxo completo de recuperação de senha integrado com Supabase Auth, incluindo tela de solicitação de reset, envio de email e tela de redefinição.

**Telas Afetadas:**
- src/app/screens/RecuperarSenha (nova tela)
- src/app/screens/RedefinirSenha (nova tela)
- src/app/screens/Login (adicionar link "Esqueci minha senha")

**Critérios de Aceitação - Design:**
- Link "Esqueci minha senha" visível na tela de login
- Campo de email com validação visual
- Botão de envio com loading durante requisição
- Mensagem de sucesso após envio do email
- Tela de redefinição com campos de nova senha e confirmação

**Critérios de Aceitação - Funcionalidade:**
- Validação de formato de email antes de enviar
- Integração com supabase.auth.resetPasswordForEmail()
- Envio de email com link de recuperação
- Link no email redireciona para app com token
- Validação: senha mínima 6 caracteres, confirmação deve coincidir
- Atualização de senha via supabase.auth.updateUser()
- Redirecionamento para login após sucesso
- Mensagens de erro claras (email não encontrado, token inválido, etc.)

---

### **TASK-06: Refatoração Design - Tela de Info de Entidades**

**Detalhamento:**
Padronizar e modernizar o layout das telas de visualização de detalhes (Info) de todas as entidades (Quarto, Cliente, Funcionário, Reserva, Atividade), criando componentes reutilizáveis e seguindo design system consistente com hierarquia visual clara.

**Telas Afetadas:**
- src/app/screens/Quarto/InfoQuarto
- src/app/screens/Cliente/InfoCliente
- src/app/screens/Funcionario/InfoFuncionario
- src/app/screens/Reserva/InfoReserva
- src/app/screens/Atividade/InfoAtividade
- src/components/InfoText (atualizar)
- src/components/InfoCard (atualizar)

**Critérios de Aceitação - Design:**
- Header com título centralizado e cor destaque (#FFE157) sobre fundo azul escuro (#132F3B)
- Botão de voltar sempre visível no canto superior esquerdo com ícone e cor branca
- Card branco com borda arredondada para agrupar informações relacionadas
- Labels dos campos em azul (#0162B3) e valores em preto com fonte legível
- Espaçamento consistente entre campos (16px vertical)
- Seção de ações (Editar/Excluir) separada visualmente na parte inferior
- Botões de ação com ícones descritivos e cores diferenciadas (azul para editar, vermelho para excluir)
- Scroll habilitado quando conteúdo exceder altura da tela
- Imagem/ícone da entidade no topo (quando aplicável)

**Critérios de Aceitação - Funcionalidade:**
- Carregamento dos dados da entidade ao abrir a tela usando ID da URL
- Exibição de loading durante busca dos dados
- Mensagem de erro amigável se entidade não encontrada
- Botão "Editar" redireciona para tela de edição com ID correto
- Botão "Excluir" abre modal de confirmação antes da ação
- Atualização automática dos dados após retornar da edição
- Formatação adequada de valores (datas, moedas, telefones)
- Tratamento de campos vazios/nulos com placeholder visual
- Breadcrumb ou indicador de navegação para contexto do usuário

---

### **TASK-07: Ajuste de Design e Integração Check-in/Check-out**

**Detalhamento:**
Reformular visualmente os botões de check-in e check-out nas telas de reserva, implementando estados visuais distintos e integração completa com Supabase para registrar entrada e saída de hóspedes com atualização de status.

**Telas Afetadas:**
- src/app/screens/Reserva/ListagemReserva
- src/app/screens/Reserva/InfoReserva
- src/components/ReservaListItem
- src/components/button (adicionar variantes)

**Critérios de Aceitação - Design:**
- Botão "Check-in" verde (#4CAF50) visível apenas em reservas com status "Confirmada" e data de entrada igual ao dia atual
- Botão "Check-out" azul (#2196F3) visível apenas em reservas com status "Ativa"
- Ícones diferenciados: entrada (arrow-down) e saída (arrow-up)
- Estados desabilitados com opacity 0.5 e mensagem explicativa
- Loading spinner no botão durante requisição
- Confirmação visual após ação (checkmark + fade out)

**Critérios de Aceitação - Funcionalidade:**
- Check-in: atualiza status da reserva de "Confirmada" para "Ativa" no Supabase
- Check-in: registra data e hora exata da entrada (timestamp)
- Check-in: atualiza status do quarto de "Disponível" para "Ocupado"
- Check-out: atualiza status da reserva de "Ativa" para "Finalizada"
- Check-out: registra data e hora exata da saída (timestamp)
- Check-out: atualiza status do quarto de "Ocupado" para "Disponível"
- Modal de confirmação antes de executar ação
- Tratamento de erro com mensagem específica (ex: quarto já ocupado)
- Atualização automática da lista após operação
- Validação: não permitir check-in antes da data de início da reserva
- Validação: não permitir check-out se houver débitos pendentes

---

## 🚀 TAREFAS SUGERIDAS PARA MVP

---

### **TASK-08: Dashboard Inicial com Indicadores**

**Detalhamento:**
Criar tela inicial (home) com cards de indicadores principais: total de quartos, ocupação atual, reservas do dia, receita do mês, permitindo visão geral do negócio.

**Telas Afetadas:**
- src/app/screens/(tabs)/index (reformular)
- src/components/DashboardCard (novo componente)
- src/components/ChartWidget (novo componente)

**Critérios de Aceitação - Design:**
- 4 cards superiores com métricas principais
- Gráfico de ocupação dos últimos 7 dias
- Lista das próximas 3 reservas do dia
- Cores diferenciadas por tipo de métrica (verde/positivo, vermelho/alerta)

**Critérios de Aceitação - Funcionalidade:**
- Buscar dados reais do Supabase
- Cálculo automático de ocupação (quartos ocupados/total)
- Atualização em tempo real ao entrar na tela
- Pull-to-refresh para atualizar dados
- Clique em card redireciona para tela detalhada

---

### **TASK-09: Sistema de Permissões por Perfil**

**Detalhamento:**
Implementar controle de acesso baseado em perfis (Admin, Recepcionista, Gerente), restringindo funcionalidades de criação, edição e exclusão conforme permissões.

**Telas Afetadas:**
- src/app/_layout (verificação de permissões)
- src/contexts/AuthContext (adicionar perfil do usuário)
- Todas as telas com operações CRUD
- Nova tabela Supabase: perfis e permissoes

**Critérios de Aceitação - Design:**
- Botões desabilitados (cinza) quando usuário não tem permissão
- Tooltip explicativo ao tentar ação não permitida

**Critérios de Aceitação - Funcionalidade:**
- Perfis: Admin (todas permissões), Gerente (visualizar + editar), Recepcionista (apenas visualizar)
- Verificação de perfil ao logar e armazenar em contexto
- Ocultar/desabilitar botões conforme perfil
- Validação no backend (RLS do Supabase)
- Mensagem de "Sem permissão" em tentativas não autorizadas

---

### **TASK-10: Busca e Filtros Avançados**

**Detalhamento:**
Implementar sistema de busca e filtros em todas as telas de listagem, permitindo busca por múltiplos campos e filtros por status, data, tipo, etc.

**Telas Afetadas:**
- Todas as telas de listagem (Quartos, Clientes, Funcionários, Reservas, Atividades)
- src/components/FilterModal (novo componente)
- src/components/TextInputRounded (atualizar)

**Critérios de Aceitação - Design:**
- Barra de busca no topo de todas as listagens
- Ícone de filtro ao lado da busca abrindo modal
- Chips selecionados visíveis após aplicar filtro
- Botão "Limpar filtros" quando filtros ativos

**Critérios de Aceitação - Funcionalidade:**
- Busca por múltiplos campos (nome, número, CPF, etc.)
- Filtros: status (Ativo/Inativo), tipo de quarto, datas, valor
- Aplicação de múltiplos filtros simultaneamente
- Busca com debounce (300ms)
- Contagem de resultados encontrados
- Manter filtros ao navegar e voltar

---

### **TASK-11: Notificações Push**

**Detalhamento:**
Implementar sistema de notificações para alertas importantes: reservas próximas, check-outs do dia, quartos para limpeza, manutenções pendentes.

**Telas Afetadas:**
- src/app/screens/Notificacoes (nova tela)
- src/app/_layout (adicionar ícone de sino no header)
- src/contexts/NotificationContext (novo contexto)
- app.json (configuração de push notifications)

**Critérios de Aceitação - Design:**
- Badge vermelho com número de notificações não lidas
- Lista de notificações com ícones por tipo
- Marcação visual de lidas vs não lidas
- Botão "Marcar todas como lidas"

**Critérios de Aceitação - Funcionalidade:**
- Notificação automática: 1 dia antes do check-in
- Notificação: check-outs programados para hoje
- Clique na notificação redireciona para entidade relacionada
- Permissões de notificação solicitadas no primeiro acesso
- Integração com Expo Notifications
- Histórico de notificações dos últimos 30 dias

---

### **TASK-12: Relatórios e Exportação**

**Detalhamento:**
Criar tela de relatórios gerenciais com opções de filtro por período e exportação em PDF/Excel de dados de reservas, receitas e ocupação.

**Telas Afetadas:**
- src/app/screens/Relatorios (nova tela)
- src/components/ReportCard (novo componente)
- src/utils/pdfGenerator (novo utilitário)
- src/app/screens/(tabs)/_layout (adicionar no menu)

**Critérios de Aceitação - Design:**
- Seletor de tipo de relatório (Ocupação, Receitas, Hóspedes)
- Date picker para período (de/até)
- Pré-visualização do relatório em cards/gráficos
- Botões de exportar (PDF e Excel)

**Critérios de Aceitação - Funcionalidade:**
- Relatório de ocupação: % ocupação por período
- Relatório de receitas: total por período com breakdown
- Relatório de hóspedes: lista com dados e origens
- Geração de PDF usando biblioteca react-native-pdf
- Exportação Excel via CSV
- Compartilhamento via WhatsApp/Email
- Cache de relatórios gerados recentemente

---

### **TASK-13: Validações e Feedback de Erros**

**Detalhamento:**
Padronizar e melhorar todas as validações de formulários e feedbacks de erro em todo o aplicativo, criando componente de Toast/Snackbar para mensagens.

**Telas Afetadas:**
- Todas as telas com formulários
- src/components/Toast (atualizar)
- src/components/ToastContext (atualizar)
- src/utils/validators (novo utilitário)

**Critérios de Aceitação - Design:**
- Toast colorido: verde (sucesso), vermelho (erro), azul (info)
- Mensagens claras e objetivas
- Auto-dismiss após 3 segundos
- Posicionamento consistente (topo da tela)

**Critérios de Aceitação - Funcionalidade:**
- Validação de CPF/CNPJ com cálculo de dígitos
- Validação de telefone com máscara
- Validação de email com regex
- Validação de datas: não permitir datas passadas em reservas
- Mensagens específicas por tipo de erro
- Prevenção de múltiplos submits (desabilitar botão após clique)

---

## 📊 PRIORIZAÇÃO SUGERIDA

### **Sprint 1 (Crítico)**
Objetivo: Estabilizar funcionalidades core e integração com backend

- **TASK-02**: Integração com Supabase
- **TASK-03**: Revisão de navegação
- **TASK-12**: Validações e feedback

**Entregável**: Sistema CRUD funcional com todas entidades integradas ao Supabase

---

### **Sprint 2 (Importante)**
Objetivo: Melhorar UX e adicionar funcionalidades de operação diária

- **TASK-01**: Refatoração design - Telas de Edição
- **TASK-06**: Refatoração design - Telas de Info
- **TASK-07**: Check-in/Check-out com integração
- **TASK-08**: Dashboard

**Entregável**: Interface padronizada em todas as telas e fluxo de check-in/out operacional

---

### **Sprint 3 (Complementar)**
Objetivo: Adicionar segurança e facilitar uso do sistema

- **TASK-05**: Recuperar senha
- **TASK-09**: Permissões
- **TASK-10**: Filtros avançados

**Entregável**: Sistema com controle de acesso e buscas eficientes

---

### **Sprint 4 (Melhorias)**
Objetivo: Funcionalidades avançadas e relatórios gerenciais

- **TASK-04**: Mapa de origem
- **TASK-11**: Notificações
- **TASK-12**: Relatórios
- **TASK-13**: Validações e feedback

**Entregável**: MVP completo com analytics e notificações

---

## 📈 Definição de Pronto (DoD)

Uma tarefa só é considerada concluída quando:

1. ✅ Todos os critérios de aceitação foram atendidos
2. ✅ Código revisado e aprovado
3. ✅ Testes manuais realizados em iOS e Android
4. ✅ Sem erros de console ou warnings críticos
5. ✅ Documentação atualizada (se aplicável)
6. ✅ Demonstração para o Product Owner aprovada

---

## 🎯 Métricas de Sucesso do MVP

- **Performance**: Tempo de carregamento < 2s em telas de listagem
- **Usabilidade**: Taxa de erro em formulários < 10%
- **Disponibilidade**: Uptime do sistema > 99%
- **Adoção**: 100% dos funcionários utilizando diariamente
- **Satisfação**: NPS > 8/10 após 2 semanas de uso
