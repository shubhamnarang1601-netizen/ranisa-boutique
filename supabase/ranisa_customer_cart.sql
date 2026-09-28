-- Customer carts are accessed only through the Ranisa Edge Function after
-- verifying the signed OTPLESS identity token. Do not expose them via the Data API.
create table if not exists public.ranisa_cart_items (
  user_key text not null check (char_length(user_key) between 1 and 200),
  product_id integer not null references public.ranisa_products(id) on delete cascade,
  quantity integer not null check (quantity between 1 and 20),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_key, product_id)
);
create index if not exists ranisa_cart_items_product_id_idx on public.ranisa_cart_items(product_id);
alter table public.ranisa_cart_items enable row level security;
revoke all on public.ranisa_cart_items from public, anon, authenticated;
grant select, insert, update, delete on public.ranisa_cart_items to service_role;
