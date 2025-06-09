// This file will contain generated Supabase types. Replace this with actual types after running the Supabase CLI.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      payments: {
        Row: {
          id: string;
          payment_id: string;
          order_id: string;
          email: string;
          amount: number;
          currency: string;
          status: string;
          payment_method: string;
          created_at: string;
          refunded_at?: string;
          refund_id?: string;
          refund_amount?: number;
          refund_status?: string;
          refund_notes?: string;
          metadata?: Json;
          user_id: string;
        };
        Insert: {
          id?: string;
          payment_id: string;
          order_id: string;
          email: string;
          amount: number;
          currency: string;
          status: string;
          payment_method: string;
          created_at?: string;
          refunded_at?: string;
          refund_id?: string;
          refund_amount?: number;
          refund_status?: string;
          refund_notes?: string;
          metadata?: Json;
          user_id: string;
        };
        Update: {
          id?: string;
          payment_id?: string;
          order_id?: string;
          email?: string;
          amount?: number;
          currency?: string;
          status?: string;
          payment_method?: string;
          created_at?: string;
          refunded_at?: string;
          refund_id?: string;
          refund_amount?: number;
          refund_status?: string;
          refund_notes?: string;
          metadata?: Json;
          user_id?: string;
        };
      };
    };
  };
}