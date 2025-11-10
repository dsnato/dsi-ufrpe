import { supabase } from '../../lib/supabase';

export interface Reserva {
  id?: string;
  id_cliente: string;
  id_quarto: string;
  data_checkin: string;
  data_checkout: string;
  numero_hospedes: number;
  valor_total?: number;
  status?: string;
  observacoes?: string;
  checkin_realizado_em?: string;
  checkout_realizado_em?: string;
  created_at?: string;
  updated_at?: string;
  // Relacionamentos (quando usar .select com join)
  clientes?: {
    id: string;
    nome_completo: string;
    cpf: string;
    telefone?: string;
  };
  quartos?: {
    id: string;
    numero_quarto: string;
    tipo: string;
    preco_diario: number;
  };
}

/**
 * Buscar todas as reservas (com dados de cliente e quarto)
 */
export const listarReservas = async (): Promise<Reserva[]> => {
  const { data, error } = await supabase
    .from('reservas')
    .select(`
      *,
      clientes(id, nome_completo, cpf, telefone),
      quartos(id, numero_quarto, tipo, preco_diario)
    `)
    .order('data_checkin', { ascending: false });

  if (error) {
    console.error('Erro ao listar reservas:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Buscar reserva por ID
 */
export const buscarReservaPorId = async (id: string): Promise<Reserva | null> => {
  const { data, error } = await supabase
    .from('reservas')
    .select(`
      *,
      clientes(*),
      quartos(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erro ao buscar reserva:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Criar nova reserva
 */
export const criarReserva = async (reserva: Omit<Reserva, 'id' | 'created_at' | 'updated_at'>): Promise<Reserva> => {
  const { data, error } = await supabase
    .from('reservas')
    .insert([{
      ...reserva,
      status: reserva.status || 'Confirmada'
    }])
    .select(`
      *,
      clientes(id, nome_completo, cpf, telefone),
      quartos(id, numero_quarto, tipo, preco_diario)
    `)
    .single();

  if (error) {
    console.error('Erro ao criar reserva:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Atualizar reserva existente
 */
export const atualizarReserva = async (id: string, reserva: Partial<Reserva>): Promise<Reserva> => {
  const { data, error } = await supabase
    .from('reservas')
    .update(reserva)
    .eq('id', id)
    .select(`
      *,
      clientes(id, nome_completo, cpf, telefone),
      quartos(id, numero_quarto, tipo, preco_diario)
    `)
    .single();

  if (error) {
    console.error('Erro ao atualizar reserva:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Excluir reserva
 */
export const excluirReserva = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('reservas')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao excluir reserva:', error);
    throw new Error(error.message);
  }
};

/**
 * Realizar check-in
 */
export const realizarCheckin = async (id: string, quartoId: string): Promise<Reserva> => {
  // Atualizar reserva
  const { data, error } = await supabase
    .from('reservas')
    .update({
      status: 'Ativa',
      checkin_realizado_em: new Date().toISOString()
    })
    .eq('id', id)
    .select(`
      *,
      clientes(id, nome_completo, cpf, telefone),
      quartos(id, numero_quarto, tipo, preco_diario)
    `)
    .single();

  if (error) {
    console.error('Erro ao realizar check-in:', error);
    throw new Error(error.message);
  }

  // Atualizar status do quarto
  const { error: quartoError } = await supabase
    .from('quartos')
    .update({ status: 'Ocupado' })
    .eq('id', quartoId);

  if (quartoError) {
    console.error('Erro ao atualizar status do quarto:', quartoError);
  }

  return data;
};

/**
 * Realizar check-out
 */
export const realizarCheckout = async (id: string, quartoId: string): Promise<Reserva> => {
  // Atualizar reserva
  const { data, error } = await supabase
    .from('reservas')
    .update({
      status: 'Finalizada',
      checkout_realizado_em: new Date().toISOString()
    })
    .eq('id', id)
    .select(`
      *,
      clientes(id, nome_completo, cpf, telefone),
      quartos(id, numero_quarto, tipo, preco_diario)
    `)
    .single();

  if (error) {
    console.error('Erro ao realizar check-out:', error);
    throw new Error(error.message);
  }

  // Atualizar status do quarto
  const { error: quartoError } = await supabase
    .from('quartos')
    .update({ status: 'Disponível' })
    .eq('id', quartoId);

  if (quartoError) {
    console.error('Erro ao atualizar status do quarto:', quartoError);
  }

  return data;
};

/**
 * Buscar reservas ativas
 */
export const listarReservasAtivas = async (): Promise<Reserva[]> => {
  const { data, error } = await supabase
    .from('reservas')
    .select(`
      *,
      clientes(id, nome_completo, cpf, telefone),
      quartos(id, numero_quarto, tipo, preco_diario)
    `)
    .eq('status', 'Ativa')
    .order('data_checkin', { ascending: false });

  if (error) {
    console.error('Erro ao listar reservas ativas:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Buscar reservas por cliente
 */
export const buscarReservasPorCliente = async (clienteId: string): Promise<Reserva[]> => {
  const { data, error } = await supabase
    .from('reservas')
    .select(`
      *,
      clientes(id, nome_completo, cpf, telefone),
      quartos(id, numero_quarto, tipo, preco_diario)
    `)
    .eq('id_cliente', clienteId)
    .order('data_checkin', { ascending: false });

  if (error) {
    console.error('Erro ao buscar reservas por cliente:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Verificar disponibilidade de quarto em período
 */
export const verificarDisponibilidadeQuarto = async (
  quartoId: string,
  dataCheckin: string,
  dataCheckout: string,
  reservaIdExcluir?: string
): Promise<boolean> => {
  let query = supabase
    .from('reservas')
    .select('id')
    .eq('id_quarto', quartoId)
    .neq('status', 'Cancelada')
    .neq('status', 'Finalizada')
    .or(`and(data_checkin.lte.${dataCheckout},data_checkout.gte.${dataCheckin})`);

  // Excluir reserva atual (útil para edição)
  if (reservaIdExcluir) {
    query = query.neq('id', reservaIdExcluir);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao verificar disponibilidade:', error);
    throw new Error(error.message);
  }

  // Se não encontrou nenhuma reserva conflitante, está disponível
  return !data || data.length === 0;
};
