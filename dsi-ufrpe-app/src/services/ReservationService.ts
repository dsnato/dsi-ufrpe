import { supabase } from '@/lib/supabase';
import { 
  CheckInOutResponse, 
  CheckInOutValidation, 
  Reservation, 
  Room 
} from '@/src/types/reservation';

export class ReservationService {
  private static instance: ReservationService;

  private constructor() {}

  static getInstance(): ReservationService {
    if (!ReservationService.instance) {
      ReservationService.instance = new ReservationService();
    }
    return ReservationService.instance;
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