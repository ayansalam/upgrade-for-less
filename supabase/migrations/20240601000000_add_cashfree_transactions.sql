-- Create cashfree_transactions table to store payment transaction data
create table if not exists public.cashfree_transactions (
  id uuid primary key default uuid_generate_v4(),
  order_id text not null unique,
  payment_link_id text,
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric not null,
  currency text not null default 'INR',
  status text not null check (status in ('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED')),
  payment_method text,
  reference_id text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  metadata jsonb
);

-- Add RLS policies for cashfree_transactions
alter table public.cashfree_transactions enable row level security;

-- Users can only view their own transactions
create policy "Users can view their own transactions"
  on public.cashfree_transactions for select
  using (auth.uid() = user_id);

-- Only authenticated users can insert transactions
create policy "Authenticated users can insert transactions"
  on public.cashfree_transactions for insert
  with check (auth.role() = 'authenticated');

-- Only service role can update transactions (for webhooks)
create policy "Service role can update transactions"
  on public.cashfree_transactions for update
  using (auth.role() = 'service_role');

-- Add indexes for better query performance
create index if not exists cashfree_transactions_user_id_idx on public.cashfree_transactions (user_id);
create index if not exists cashfree_transactions_status_idx on public.cashfree_transactions (status);
create index if not exists cashfree_transactions_created_at_idx on public.cashfree_transactions (created_at desc);