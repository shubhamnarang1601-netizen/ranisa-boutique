-- Ranisa Boutique custom-order enquiries. Separate from the existing Nile tables.
create table if not exists public.ranisa_enquiries (
  id uuid primary key,
  created_at timestamptz not null default now(),
  customer_name text not null check (char_length(customer_name) between 1 and 120),
  requested_style text not null check (char_length(requested_style) between 1 and 160),
  description text not null check (char_length(description) between 1 and 3000),
  reference_paths text[] not null default '{}',
  status text not null default 'new' check (status in ('new', 'contacted', 'closed'))
);
alter table public.ranisa_enquiries enable row level security;
revoke all on table public.ranisa_enquiries from anon, authenticated;

-- Keep uploads private. Only the server-side function can write/read these files.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('ranisa-references', 'ranisa-references', false, 10485760,
        array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- A narrow abuse counter, accessible only with a server secret.
create table if not exists public.ranisa_enquiry_attempts (
  id bigint generated always as identity primary key,
  ip_digest text not null,
  created_at timestamptz not null default now()
);
create index if not exists ranisa_enquiry_attempts_recent
  on public.ranisa_enquiry_attempts (ip_digest, created_at desc);
alter table public.ranisa_enquiry_attempts enable row level security;
revoke all on table public.ranisa_enquiry_attempts from anon, authenticated;
