import { supabase } from '../../lib/supabase';

export interface Funcionario {
  id?: string;
  nome_completo: string;
  cpf: string;
  email: string;
  telefone?: string;
  cargo: string;
  salario?: number;
  data_admissao: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Buscar todos os funcionários
 */
export const listarFuncionarios = async (): Promise<Funcionario[]> => {
  const { data, error } = await supabase
    .from('funcionarios')
    .select('*')
    .order('nome_completo', { ascending: true });

  if (error) {
    console.error('Erro ao listar funcionários:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Buscar funcionário por ID
 */
export const buscarFuncionarioPorId = async (id: string): Promise<Funcionario | null> => {
  const { data, error } = await supabase
    .from('funcionarios')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erro ao buscar funcionário:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Criar novo funcionário
 */
export const criarFuncionario = async (funcionario: Omit<Funcionario, 'id' | 'created_at' | 'updated_at'>): Promise<Funcionario> => {
  const { data, error } = await supabase
    .from('funcionarios')
    .insert([{
      ...funcionario,
      status: funcionario.status || 'Ativo'
    }])
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar funcionário:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Atualizar funcionário existente
 */
export const atualizarFuncionario = async (id: string, funcionario: Partial<Funcionario>): Promise<Funcionario> => {
  const { data, error } = await supabase
    .from('funcionarios')
    .update(funcionario)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar funcionário:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Excluir funcionário
 */
export const excluirFuncionario = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('funcionarios')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao excluir funcionário:', error);
    throw new Error(error.message);
  }
};

/**
 * Buscar funcionários ativos
 */
export const listarFuncionariosAtivos = async (): Promise<Funcionario[]> => {
  const { data, error } = await supabase
    .from('funcionarios')
    .select('*')
    .eq('status', 'Ativo')
    .order('nome_completo', { ascending: true });

  if (error) {
    console.error('Erro ao listar funcionários ativos:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Buscar funcionários por cargo
 */
export const buscarFuncionariosPorCargo = async (cargo: string): Promise<Funcionario[]> => {
  const { data, error } = await supabase
    .from('funcionarios')
    .select('*')
    .eq('cargo', cargo)
    .order('nome_completo', { ascending: true });

  if (error) {
    console.error('Erro ao buscar funcionários por cargo:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Buscar funcionário por CPF
 */
export const buscarFuncionarioPorCPF = async (cpf: string): Promise<Funcionario | null> => {
  const { data, error } = await supabase
    .from('funcionarios')
    .select('*')
    .eq('cpf', cpf)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Erro ao buscar funcionário por CPF:', error);
    throw new Error(error.message);
  }

  return data || null;
};
