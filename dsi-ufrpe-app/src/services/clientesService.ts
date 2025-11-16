import { supabase } from '../../lib/supabase';
import { 
  validarStringObrigatoria, 
  validarFormatoCPF, 
  validarEmail, 
  validarTelefone,
  ValidationError
} from '../utils/validators';

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
  
  try {
    // Validações
    console.log('🔍 [clientesService] Iniciando validações...');
    
    validarStringObrigatoria(cliente.nome_completo, 'Nome completo');
    validarStringObrigatoria(cliente.cpf, 'CPF');
    validarFormatoCPF(cliente.cpf);
    
    if (cliente.email) {
      validarEmail(cliente.email);
    }
    
    if (cliente.telefone) {
      validarTelefone(cliente.telefone);
    }
    
    // Data de nascimento aceita qualquer string
    
    console.log('✅ [clientesService] Validações concluídas com sucesso');
    
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error('🔴 [clientesService] Erro de validação:', error.message);
      throw error;
    }
    throw error;
  }
  
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
    console.error('🔴 [clientesService] Erro Supabase:', error);
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
  console.log('🟢 [clientesService] atualizarCliente chamado');
  console.log('🟢 [clientesService] ID:', id);
  console.log('🟢 [clientesService] Dados recebidos:', JSON.stringify(cliente, null, 2));
  
  try {
    // Validações (apenas para campos presentes)
    console.log('🔍 [clientesService] Iniciando validações...');
    
    if (cliente.nome_completo !== undefined) {
      validarStringObrigatoria(cliente.nome_completo, 'Nome completo');
    }
    
    if (cliente.cpf !== undefined) {
      validarStringObrigatoria(cliente.cpf, 'CPF');
      validarFormatoCPF(cliente.cpf);
    }
    
    if (cliente.email) {
      validarEmail(cliente.email);
    }
    
    if (cliente.telefone) {
      validarTelefone(cliente.telefone);
    }
    
    // Data de nascimento aceita qualquer string (atualizarCliente)
    
    console.log('✅ [clientesService] Validações concluídas com sucesso');
    
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error('🔴 [clientesService] Erro de validação:', error.message);
      throw error;
    }
    throw error;
  }
  
  const { data, error } = await supabase
    .from('clientes')
    .update(cliente)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('🔴 [clientesService] Erro ao atualizar cliente:', error);
    console.error('🔴 [clientesService] Erro código:', error.code);
    console.error('🔴 [clientesService] Erro detalhes:', error.details);
    console.error('🔴 [clientesService] Dados enviados:', JSON.stringify(cliente, null, 2));
    throw new Error(error.message);
  }

  console.log('✅ [clientesService] Cliente atualizado:', JSON.stringify(data, null, 2));
  return data;
};

/**
 * Excluir cliente
 */
export const excluirCliente = async (id: string): Promise<void> => {
  console.log('🔴 [clientesService] excluirCliente chamado');
  console.log('🔴 [clientesService] ID:', id);
  
  const { error } = await supabase
    .from('clientes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('🔴 [clientesService] Erro ao excluir cliente:', error);
    console.error('🔴 [clientesService] Erro detalhes:', JSON.stringify(error, null, 2));
    throw new Error(error.message);
  }
  
  console.log('✅ [clientesService] Cliente excluído com sucesso');
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
