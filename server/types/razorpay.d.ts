declare module 'razorpay' {
  export interface RazorpayOptions {
    key_id: string;
    key_secret: string;
  }

  export interface RazorpayOrder {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    status: string;
    attempts: number;
    notes: Record<string, string>;
    created_at: number;
  }

  export interface RazorpayPayment {
    id: string;
    entity: string;
    amount: number;
    currency: string;
    status: string;
    order_id: string;
    invoice_id: string;
    international: boolean;
    method: string;
    amount_refunded: number;
    refund_status: string;
    captured: boolean;
    description: string;
    card_id: string;
    bank: string;
    wallet: string;
    vpa: string;
    email: string;
    contact: string;
    notes: Record<string, string>;
    fee: number;
    tax: number;
    error_code: string;
    error_description: string;
    created_at: number;
  }

  export interface RazorpayRefund {
    id: string;
    entity: string;
    amount: number;
    currency: string;
    payment_id: string;
    notes: Record<string, string>;
    receipt: string;
    acquirer_data: {
      arn: string;
    };
    created_at: number;
    batch_id: string;
    status: string;
    speed_processed: string;
    speed_requested: string;
  }

  export interface RazorpayInstance {
    orders: {
      create(options: {
        amount: number;
        currency?: string;
        receipt?: string;
        notes?: Record<string, string>;
      }): Promise<RazorpayOrder>;
      fetch(orderId: string): Promise<RazorpayOrder>;
      all(options?: { from?: number; to?: number; count?: number; skip?: number }): Promise<RazorpayOrder[]>;
    };
    payments: {
      fetch(paymentId: string): Promise<RazorpayPayment>;
      all(options?: { from?: number; to?: number; count?: number; skip?: number }): Promise<RazorpayPayment[]>;
      capture(paymentId: string, amount: number): Promise<RazorpayPayment>;
      refund(paymentId: string, options?: {
        amount?: number;
        speed?: 'normal' | 'optimum';
        notes?: Record<string, string>;
      }): Promise<RazorpayRefund>;
    };
    refunds: {
      fetch(refundId: string): Promise<RazorpayRefund>;
      all(options?: { from?: number; to?: number; count?: number; skip?: number }): Promise<RazorpayRefund[]>;
    };
  }

  export default class Razorpay {
    constructor(options: RazorpayOptions);
    orders: RazorpayInstance['orders'];
    payments: RazorpayInstance['payments'];
    refunds: RazorpayInstance['refunds'];
  }
} 