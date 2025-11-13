import { supabase } from '../../lib/supabase';
import { 
  validarStringObrigatoria, 
  validarNumero,
  validarInteiro,
  validarCasasDecimais,
  ValidationError
} from '../utils/validators';

export interface Quarto {
  id?: string;
  numero_quarto: string;
  tipo: string;
  capacidade_pessoas: number;
  preco_diario: number;
  status?: string;
  descricao?: string;
  foto_quarto?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Buscar todos os quartos
 */
export const listarQuartos = async (): Promise<Quarto[]> => {
  const { data, error } = await supabase
    .from('quartos')
    .select('*')
    .order('numero_quarto', { ascending: true });

  if (error) {
    console.error('Erro ao listar quartos:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Buscar quarto por ID
 */
export const buscarQuartoPorId = async (id: string): Promise<Quarto | null> => {
  const { data, error } = await supabase
    .from('quartos')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erro ao buscar quarto:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Criar novo quarto
 */
export const criarQuarto = async (quarto: Omit<Quarto, 'id' | 'created_at' | 'updated_at'>): Promise<Quarto> => {
  console.log('🟢 [quartosService] criarQuarto chamado');
  console.log('🟢 [quartosService] Dados recebidos:', JSON.stringify(quarto, null, 2));
  
  try {
    // Validações
    console.log('🔍 [quartosService] Iniciando validações...');
    
    validarStringObrigatoria(quarto.numero_quarto, 'Número do quarto');
    validarStringObrigatoria(quarto.tipo, 'Tipo do quarto');
    
    validarInteiro(quarto.capacidade_pessoas, 'Capacidade de pessoas', 1, 20);
    validarNumero(quarto.preco_diario, 'Preço diário', 0.01);
    validarCasasDecimais(quarto.preco_diario, 'Preço diário', 2);
    
    console.log('✅ [quartosService] Validações concluídas com sucesso');
    
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error('🔴 [quartosService] Erro de validação:', error.message);
      throw error;
    }
    throw error;
  }
  
  const dadosParaInserir = {
    ...quarto,
    status: quarto.status || 'Disponível'
  };
  
  console.log('🟢 [quartosService] Dados para inserir:', JSON.stringify(dadosParaInserir, null, 2));
  
  const { data, error } = await supabase
    .from('quartos')
    .insert([dadosParaInserir])
    .select()
    .single();

  if (error) {
    console.error('🔴 [quartosService] Erro Supabase:', error);
    console.error('🔴 [quartosService] Detalhes:', JSON.stringify(error, null, 2));
    throw new Error(error.message);
  }

  console.log('✅ [quartosService] Quarto criado com sucesso:', JSON.stringify(data, null, 2));
  return data;
};

/**
 * Atualizar quarto existente
 */
export const atualizarQuarto = async (id: string, quarto: Partial<Quarto>): Promise<Quarto> => {
  const { data, error } = await supabase
    .from('quartos')
    .update(quarto)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar quarto:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Excluir quarto
 */
export const excluirQuarto = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('quartos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao excluir quarto:', error);
    throw new Error(error.message);
  }
};

/**
 * Buscar quartos disponíveis
 */
export const listarQuartosDisponiveis = async (): Promise<Quarto[]> => {
  const { data, error } = await supabase
    .from('quartos')
    .select('*')
    .eq('status', 'Disponível')
    .order('numero_quarto', { ascending: true });

  if (error) {
    console.error('Erro ao listar quartos disponíveis:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Buscar quartos com filtros
 */
export const buscarQuartos = async (filtros: {
  tipo?: string;
  capacidadeMinima?: number;
  precoMaximo?: number;
  status?: string;
}): Promise<Quarto[]> => {
  let query = supabase.from('quartos').select('*');

  if (filtros.tipo) {
    query = query.eq('tipo', filtros.tipo);
  }
  if (filtros.capacidadeMinima) {
    query = query.gte('capacidade', filtros.capacidadeMinima);
  }
  if (filtros.precoMaximo) {
    query = query.lte('preco_diario', filtros.precoMaximo);
  }
  if (filtros.status) {
    query = query.eq('status', filtros.status);
  }

  const { data, error } = await query.order('numero_quarto', { ascending: true });

  if (error) {
    console.error('Erro ao buscar quartos com filtros:', error);
    throw new Error(error.message);
  }

  return data || [];
};
