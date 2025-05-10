-- Migration: Add payments table for generic payment integration (supports INR, USD, etc.)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS payments (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    cashfree_order_id text,
    cashfree_payment_id text,
    amount numeric NOT NULL,
    currency text NOT NULL,
    payment_status text NOT NULL CHECK (payment_status IN ('PENDING', 'SUCCESS', 'FAILED')),
    payment_date timestamp with time zone DEFAULT now(),
    customer_email text,
    user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
    payment_method text,
    country text
);

-- Index for faster lookup by user
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
-- Index for order/payment id
CREATE INDEX IF NOT EXISTS idx_payments_cashfree_order_id ON payments(cashfree_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_cashfree_payment_id ON payments(cashfree_payment_id);