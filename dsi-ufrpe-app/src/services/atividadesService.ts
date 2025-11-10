import { supabase } from '../../lib/supabase';

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
    console.error('Erro ao criar atividade:', error);
    throw new Error(error.message);
  }

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
export const excluirAtividade = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('atividades_recreativas')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao excluir atividade:', error);
    throw new Error(error.message);
  }
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
