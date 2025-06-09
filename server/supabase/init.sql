-- Drop existing table if it exists
drop table if exists public.payments;

-- Create payments table
create table public.payments (
    id uuid default gen_random_uuid() primary key,
    order_id text not null,
    payment_id text not null unique,
    email text not null,
    amount integer not null,
    currency text not null,
    status text not null,
    payment_method text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    refunded_at timestamp with time zone,
    refund_id text unique,
    refund_amount integer,
    refund_status text,
    refund_notes text,
    metadata jsonb default '{}'::jsonb
);

-- Enable Row Level Security
alter table public.payments enable row level security;

-- Create indexes
create index payments_order_id_idx on public.payments(order_id);
create index payments_payment_id_idx on public.payments(payment_id);
create index payments_email_idx on public.payments(email);
create index payments_status_idx on public.payments(status);
create index payments_created_at_idx on public.payments(created_at desc);
create index payments_refund_id_idx on public.payments(refund_id);

-- RLS Policies

-- Allow service role to insert payments
create policy "Service role can insert payments"
    on public.payments
    for insert
    to service_role
    with check (true);

-- Allow authenticated users to read their own payments
create policy "Users can view their own payments"
    on public.payments
    for select
    to authenticated
    using (email = auth.jwt() ->> 'email');

-- Allow service role to update payment status
create policy "Service role can update payment status"
    on public.payments
    for update
    to service_role
    using (true)
    with check (true);

-- Create enum for payment status
create type payment_status as enum (
    'created',
    'authorized',
    'captured',
    'failed',
    'refunded',
    'refund_pending',
    'refund_failed'
);

-- Add status validation
alter table public.payments
    add constraint valid_status check (status::payment_status is not null);

-- Add comments for documentation
comment on table public.payments is 'Stores all payment transactions from Razorpay';
comment on column public.payments.id is 'UUID primary key for the payment record';
comment on column public.payments.order_id is 'Razorpay order ID';
comment on column public.payments.payment_id is 'Razorpay payment ID';
comment on column public.payments.email is 'Customer email address';
comment on column public.payments.amount is 'Payment amount in smallest currency unit (paise for INR)';
comment on column public.payments.currency is 'Payment currency code (e.g., INR)';
comment on column public.payments.status is 'Payment status (created, authorized, captured, failed, refunded, refund_pending, refund_failed)';
comment on column public.payments.payment_method is 'Payment method used (card, upi, netbanking, etc.)';
comment on column public.payments.created_at is 'Timestamp when the payment record was created';
comment on column public.payments.refunded_at is 'Timestamp when the payment was refunded';
comment on column public.payments.refund_id is 'Razorpay refund ID';
comment on column public.payments.refund_amount is 'Amount refunded in smallest currency unit';
comment on column public.payments.refund_status is 'Status of the refund request';
comment on column public.payments.refund_notes is 'Additional notes about the refund';
comment on column public.payments.metadata is 'Additional payment metadata in JSON format'; 