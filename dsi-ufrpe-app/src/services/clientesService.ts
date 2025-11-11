import { supabase } from '../../lib/supabase';

export interface Cliente {
  id?: string;
  nome_completo: string;
  cpf: string;
  email?: string;
  telefone?: string;
  data_nascimento?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  pais?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Buscar todos os clientes
 */
export const listarClientes = async (): Promise<Cliente[]> => {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('nome_completo', { ascending: true });

  if (error) {
    console.error('Erro ao listar clientes:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Buscar cliente por ID
 */
export const buscarClientePorId = async (id: string): Promise<Cliente | null> => {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erro ao buscar cliente:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Criar novo cliente
 */
export const criarCliente = async (cliente: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>): Promise<Cliente> => {
  console.log('🟢 [clientesService] criarCliente chamado');
  console.log('🟢 [clientesService] Dados recebidos:', JSON.stringify(cliente, null, 2));
  
  const dadosParaInserir = {
    ...cliente,
    pais: cliente.pais || 'Brasil'
  };
  
  console.log('🟢 [clientesService] Dados para inserir:', JSON.stringify(dadosParaInserir, null, 2));
  
  const { data, error } = await supabase
    .from('clientes')
    .insert([dadosParaInserir])
    .select()
    .single();

  if (error) {
    console.error('🔴 [clientesService] Erro ao criar cliente:', error);
    console.error('🔴 [clientesService] Detalhes:', JSON.stringify(error, null, 2));
    throw new Error(error.message);
  }

  console.log('✅ [clientesService] Cliente criado:', JSON.stringify(data, null, 2));
  return data;
};

/**
 * Atualizar cliente existente
 */
export const atualizarCliente = async (id: string, cliente: Partial<Cliente>): Promise<Cliente> => {
  const { data, error } = await supabase
    .from('clientes')
    .update(cliente)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar cliente:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Excluir cliente
 */
export const excluirCliente = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('clientes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao excluir cliente:', error);
    throw new Error(error.message);
  }
};

/**
 * Buscar cliente por CPF
 */
export const buscarClientePorCPF = async (cpf: string): Promise<Cliente | null> => {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('cpf', cpf)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = not found
    console.error('Erro ao buscar cliente por CPF:', error);
    throw new Error(error.message);
  }

  return data || null;
};

/**
 * Buscar clientes por nome (pesquisa parcial)
 */
export const buscarClientesPorNome = async (nome: string): Promise<Cliente[]> => {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .ilike('nome_completo', `%${nome}%`)
    .order('nome_completo', { ascending: true });

  if (error) {
    console.error('Erro ao buscar clientes por nome:', error);
    throw new Error(error.message);
  }

  return data || [];
};
