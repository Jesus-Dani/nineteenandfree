-- Nineteenandfree — initial schema
-- Mirrors TRD Section 3 exactly. Run this once in the Supabase SQL editor
-- (or via the Supabase CLI) against the project at NEXT_PUBLIC_SUPABASE_URL.

create extension if not exists "pgcrypto";

-- wishlist_items
-- quantity_funded is intentionally NOT a column here: per the locked rolling-unit
-- funding rule (PRD 5.1 / TRD 3), it is always derived live from contributions
-- summed per item divided by unit_cost, never stored/reset.
create table if not exists wishlist_items (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  name text not null,
  description text,
  unit_cost numeric(12, 2) not null check (unit_cost > 0),
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- contributions
create table if not exists contributions (
  id uuid primary key default gen_random_uuid(),
  contributor_name text,
  contributor_contact text,
  amount numeric(12, 2) not null check (amount > 0),
  currency text not null default 'NGN',
  target_type text not null check (target_type in ('item', 'general')),
  target_item_id uuid references wishlist_items(id),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed')),
  payment_reference text not null unique,
  created_at timestamptz not null default now(),
  constraint target_item_only_when_item_type
    check (
      (target_type = 'item' and target_item_id is not null)
      or (target_type = 'general' and target_item_id is null)
    )
);

-- messages ("Letters of Love")
-- No include_in_keepsake column — per the locked product decision, approval_status
-- alone governs both digital display and physical keepsake inclusion.
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  contribution_id uuid references contributions(id),
  display_name text,
  message_text text not null,
  is_anonymous boolean not null default false,
  approval_status text not null default 'pending' check (approval_status in ('pending', 'approved', 'rejected')),
  submitted_ip inet,
  created_at timestamptz not null default now()
);

-- bracelet_requests
-- name/phone/whatsapp/size/gender are only populated when interested = true.
-- No delivery address or email field — distributed in person on campus.
create table if not exists bracelet_requests (
  id uuid primary key default gen_random_uuid(),
  contribution_id uuid references contributions(id),
  interested boolean not null,
  name text,
  phone text,
  whatsapp text,
  size text check (size in ('Small', 'Medium', 'Large')),
  gender text check (gender in ('Male', 'Female')),
  fulfillment_status text not null default 'pending',
  created_at timestamptz not null default now(),
  constraint bracelet_fields_only_when_interested
    check (
      interested = true
      or (name is null and phone is null and whatsapp is null and size is null and gender is null)
    )
);

-- outreach_fund_ledger
create table if not exists outreach_fund_ledger (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('income', 'expense')),
  amount numeric(12, 2) not null check (amount > 0),
  category text,
  description text,
  date date not null default current_date
);

-- Indexes supporting live progress-bar aggregation (TRD Section 4) and dedup lookups.
create index if not exists idx_contributions_target_item on contributions(target_item_id);
create index if not exists idx_contributions_payment_status on contributions(payment_status);
create index if not exists idx_messages_approval_status on messages(approval_status);
create index if not exists idx_wishlist_items_status on wishlist_items(status);
