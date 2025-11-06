export type ReservationStatus = 'Confirmada' | 'Ativa' | 'Finalizada' | 'Cancelada';

export type RoomStatus = 'Disponível' | 'Ocupado' | 'Manutenção';

export interface Reservation {
  id: string;
  room_id: string;
  guest_id: string;
  check_in_date: string;
  check_out_date: string;
  status: ReservationStatus;
  actual_check_in?: string;
  actual_check_out?: string;
  total_amount: number;
  pending_amount: number;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  number: string;
  type: string;
  status: RoomStatus;
  price_per_night: number;
  created_at: string;
  updated_at: string;
}

export interface CheckInOutResponse {
  success: boolean;
  error?: string;
  reservation?: Reservation;
  room?: Room;
}

export interface CheckInOutValidation {
  canProceed: boolean;
  message?: string;
}