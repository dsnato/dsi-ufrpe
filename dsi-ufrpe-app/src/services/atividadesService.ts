import { supabase } from '../../lib/supabase';
import { 
  validarStringObrigatoria, 
  validarNumero,
  validarInteiro,
  ValidationError
} from '../utils/validators';

export interface AtividadeRecreativa {
  id?: string;
  nome: string;
  descricao?: string;
  data_hora: string;
  local?: string;
  capacidade_maxima?: number;
  preco?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Buscar todas as atividades
 */
export const listarAtividades = async (): Promise<AtividadeRecreativa[]> => {
  const { data, error } = await supabase
    .from('atividades_recreativas')
    .select('*')
    .order('data_hora', { ascending: true });

  if (error) {
    console.error('Erro ao listar atividades:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Buscar atividade por ID
 */
export const buscarAtividadePorId = async (id: string): Promise<AtividadeRecreativa | null> => {
  const { data, error } = await supabase
    .from('atividades_recreativas')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erro ao buscar atividade:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Criar nova atividade
 */
export const criarAtividade = async (atividade: Omit<AtividadeRecreativa, 'id' | 'created_at' | 'updated_at'>): Promise<AtividadeRecreativa> => {
  console.log('🟢 [atividadesService] criarAtividade chamado');
  console.log('🟢 [atividadesService] Dados recebidos:', JSON.stringify(atividade, null, 2));
  
  try {
    // Validações
    console.log('🔍 [atividadesService] Iniciando validações...');
    
    validarStringObrigatoria(atividade.nome, 'Nome da atividade');
    validarStringObrigatoria(atividade.data_hora, 'Data e hora');
    
    if (atividade.capacidade_maxima !== undefined) {
      validarInteiro(atividade.capacidade_maxima, 'Capacidade máxima', 1, 1000);
    }
    
    if (atividade.preco !== undefined) {
      validarNumero(atividade.preco, 'Preço', 0);
    }
    
    console.log('✅ [atividadesService] Validações concluídas com sucesso');
    
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error('🔴 [atividadesService] Erro de validação:', error.message);
      throw error;
    }
    throw error;
  }
  
  const { data, error } = await supabase
    .from('atividades_recreativas')
    .insert([{
      ...atividade,
      status: atividade.status || 'Agendada',
      preco: atividade.preco || 0
    }])
    .select()
    .single();

  if (error) {
    console.error('🔴 [atividadesService] Erro Supabase:', error);
    throw new Error(error.message);
  }

  console.log('✅ [atividadesService] Atividade criada:', JSON.stringify(data, null, 2));
  return data;
};

/**
 * Atualizar atividade existente
 */
export const atualizarAtividade = async (id: string, atividade: Partial<AtividadeRecreativa>): Promise<AtividadeRecreativa> => {
  const { data, error } = await supabase
    .from('atividades_recreativas')
    .update(atividade)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar atividade:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Excluir atividade
 */
/**
 * Excluir atividade
 */
export const excluirAtividade = async (id: string): Promise<void> => {
  console.log('🔴 [atividadesService] excluirAtividade chamado');
  console.log('🔴 [atividadesService] ID:', id);
  
  const { error } = await supabase
    .from('atividades_recreativas')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('🔴 [atividadesService] Erro ao excluir atividade:', error);
    console.error('🔴 [atividadesService] Erro detalhes:', JSON.stringify(error, null, 2));
    throw new Error(error.message);
  }
  
  console.log('✅ [atividadesService] Atividade excluída com sucesso');
};

/**
 * Buscar atividades agendadas (futuras)
 */
export const listarAtividadesAgendadas = async (): Promise<AtividadeRecreativa[]> => {
  const agora = new Date().toISOString();

  const { data, error } = await supabase
    .from('atividades_recreativas')
    .select('*')
    .eq('status', 'Agendada')
    .gte('data_hora', agora)
    .order('data_hora', { ascending: true });

  if (error) {
    console.error('Erro ao listar atividades agendadas:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Buscar atividades por período
 */
export const buscarAtividadesPorPeriodo = async (
  dataInicio: string,
  dataFim: string
): Promise<AtividadeRecreativa[]> => {
  const { data, error } = await supabase
    .from('atividades_recreativas')
    .select('*')
    .gte('data_hora', dataInicio)
    .lte('data_hora', dataFim)
    .order('data_hora', { ascending: true });

  if (error) {
    console.error('Erro ao buscar atividades por período:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Cancelar atividade
 */
export const cancelarAtividade = async (id: string): Promise<AtividadeRecreativa> => {
  const { data, error } = await supabase
    .from('atividades_recreativas')
    .update({ status: 'Cancelada' })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao cancelar atividade:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Finalizar atividade
 */
export const finalizarAtividade = async (id: string): Promise<AtividadeRecreativa> => {
  const { data, error } = await supabase
    .from('atividades_recreativas')
    .update({ status: 'Realizada' })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao finalizar atividade:', error);
    throw new Error(error.message);
  }

  return data;
};
