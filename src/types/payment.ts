import { Json } from "./supabase";

export type PaymentStatus = 
  | 'created'
  | 'authorized'
  | 'captured'
  | 'failed'
  | 'refunded'
  | 'refund_pending'
  | 'refund_failed';

export interface PaymentRecord {
  id: string;
  payment_id: string;
  order_id: string;
  email: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method: string;
  created_at: string;
  refunded_at?: string | null;
  refund_id?: string | null;
  refund_amount?: number | null;
  refund_status?: string | null;
  refund_notes?: string | null;
  metadata?: Json | null;
  user_id: string;
}

export interface RefundRequest {
  payment_id: string;
  amount?: number;
  notes?: string;
}

export interface RefundResponse {
  message: string;
  refund_id: string;
  status: string;
  amount: number;
}

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'success' | 'warning';

export const getStatusBadgeVariant = (status: PaymentStatus): BadgeVariant => {
  switch (status.toLowerCase()) {
    case 'captured':
      return 'success';
    case 'refunded':
      return 'secondary';
    case 'refund_pending':
      return 'warning';
    case 'failed':
    case 'refund_failed':
      return 'destructive';
    default:
      return 'default';
  }
}; 