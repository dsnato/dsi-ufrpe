import { supabase } from '@/lib/supabase';
import {
  CheckInOutResponse,
  CheckInOutValidation,
  Reservation,
  Room
} from '@/src/types/reservation';

/**
 * 🧪 MODO DE TESTE
 * Defina como TRUE para usar dados mock sem banco
 * Defina como FALSE para usar Supabase
 */
const useMockData = true;

/**
 * 📦 Dados Mock para Desenvolvimento
 */
const mockReservations: Reservation[] = [
  {
    id: '1',
    room_id: '110',
    guest_id: 'guest1',
    check_in_date: '2025-10-10',
    check_out_date: '2025-10-20',
    status: 'Confirmada',
    total_amount: 1200.00,
    pending_amount: 0,
    created_at: '2025-09-15T10:00:00Z',
    updated_at: '2025-09-15T10:00:00Z',
  },
  {
    id: '2',
    room_id: '205',
    guest_id: 'guest2',
    check_in_date: '2025-11-01',
    check_out_date: '2025-11-05',
    status: 'Ativa',
    actual_check_in: '2025-11-01T14:30:00Z',
    total_amount: 800.00,
    pending_amount: 200.00,
    created_at: '2025-10-20T11:30:00Z',
    updated_at: '2025-11-01T14:30:00Z',
  },
  {
    id: '3',
    room_id: '301',
    guest_id: 'guest3',
    check_in_date: '2025-09-10',
    check_out_date: '2025-09-15',
    status: 'Finalizada',
    actual_check_in: '2025-09-10T15:00:00Z',
    actual_check_out: '2025-09-15T11:00:00Z',
    total_amount: 2250.00,
    pending_amount: 0,
    created_at: '2025-08-25T09:00:00Z',
    updated_at: '2025-09-15T11:00:00Z',
  },
];

export class ReservationService {
  private static instance: ReservationService;

  private constructor() { }

  static getInstance(): ReservationService {
    if (!ReservationService.instance) {
      ReservationService.instance = new ReservationService();
    }
    return ReservationService.instance;
  }

  /**
   * Busca uma reserva por ID
   */
  static async getById(id: string): Promise<Reservation | null> {
    if (useMockData) {
      console.log('🧪 [MOCK] ReservationService.getById:', id);
      await new Promise(resolve => setTimeout(resolve, 800));

      const reservation = mockReservations.find(r => r.id === id);
      return reservation || null;
    }

    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar reserva:', error);
      return null;
    }
  }

  /**
   * Busca todas as reservas
   */
  static async getAll(): Promise<Reservation[]> {
    if (useMockData) {
      console.log('🧪 [MOCK] ReservationService.getAll');
      await new Promise(resolve => setTimeout(resolve, 600));
      return mockReservations;
    }

    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('check_in_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
      return [];
    }
  }

  /**
   * Exclui uma reserva
   */
  static async delete(id: string): Promise<boolean> {
    if (useMockData) {
      console.log('🧪 [MOCK] ReservationService.delete:', id);
      await new Promise(resolve => setTimeout(resolve, 500));

      const index = mockReservations.findIndex(r => r.id === id);
      if (index !== -1) {
        mockReservations.splice(index, 1);
        return true;
      }
      return false;
    }

    try {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao excluir reserva:', error);
      return false;
    }
  }

  async validateCheckIn(reservationId: string): Promise<CheckInOutValidation> {
    try {
      const { data: reservation } = await supabase
        .from('reservations')
        .select('*')
        .eq('id', reservationId)
        .single();

      if (!reservation) {
        return { canProceed: false, message: 'Reserva não encontrada.' };
      }

      const today = new Date().toISOString().split('T')[0];
      if (today < reservation.check_in_date) {
        return {
          canProceed: false,
          message: 'Check-in não permitido antes da data reservada.'
        };
      }

      const { data: room } = await supabase
        .from('rooms')
        .select('status')
        .eq('id', reservation.room_id)
        .single();

      if (room?.status === 'Ocupado') {
        return {
          canProceed: false,
          message: 'Quarto já está ocupado.'
        };
      }

      return { canProceed: true };
    } catch (error) {
      console.error('Error validating check-in:', error);
      return {
        canProceed: false,
        message: 'Erro ao validar check-in. Tente novamente.'
      };
    }
  }

  async validateCheckOut(reservationId: string): Promise<CheckInOutValidation> {
    try {
      const { data: reservation } = await supabase
        .from('reservations')
        .select('*')
        .eq('id', reservationId)
        .single();

      if (!reservation) {
        return { canProceed: false, message: 'Reserva não encontrada.' };
      }

      if (reservation.pending_amount > 0) {
        return {
          canProceed: false,
          message: 'Existem débitos pendentes.'
        };
      }

      return { canProceed: true };
    } catch (error) {
      console.error('Error validating check-out:', error);
      return {
        canProceed: false,
        message: 'Erro ao validar check-out. Tente novamente.'
      };
    }
  }

  async performCheckIn(reservationId: string): Promise<CheckInOutResponse> {
    try {
      const validation = await this.validateCheckIn(reservationId);
      if (!validation.canProceed) {
        return { success: false, error: validation.message };
      }

      const timestamp = new Date().toISOString();

      const { data: reservation, error: reservationError } = await supabase
        .from('reservations')
        .update({
          status: 'Ativa',
          actual_check_in: timestamp,
          updated_at: timestamp
        })
        .eq('id', reservationId)
        .select()
        .single();

      if (reservationError) throw reservationError;

      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .update({
          status: 'Ocupado',
          updated_at: timestamp
        })
        .eq('id', reservation.room_id)
        .select()
        .single();

      if (roomError) throw roomError;

      return {
        success: true,
        reservation: reservation as Reservation,
        room: room as Room
      };
    } catch (error) {
      console.error('Error performing check-in:', error);
      return {
        success: false,
        error: 'Erro ao realizar check-in. Tente novamente.'
      };
    }
  }

  async performCheckOut(reservationId: string): Promise<CheckInOutResponse> {
    try {
      const validation = await this.validateCheckOut(reservationId);
      if (!validation.canProceed) {
        return { success: false, error: validation.message };
      }

      const timestamp = new Date().toISOString();

      const { data: reservation, error: reservationError } = await supabase
        .from('reservations')
        .update({
          status: 'Finalizada',
          actual_check_out: timestamp,
          updated_at: timestamp
        })
        .eq('id', reservationId)
        .select()
        .single();

      if (reservationError) throw reservationError;

      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .update({
          status: 'Disponível',
          updated_at: timestamp
        })
        .eq('id', reservation.room_id)
        .select()
        .single();

      if (roomError) throw roomError;

      return {
        success: true,
        reservation: reservation as Reservation,
        room: room as Room
      };
    } catch (error) {
      console.error('Error performing check-out:', error);
      return {
        success: false,
        error: 'Erro ao realizar check-out. Tente novamente.'
      };
    }
  }
}