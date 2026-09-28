-- Supabase projects may grant new public tables broad default Data API privileges.
-- Keep read access public while restricting every catalogue write to authenticated admins.
revoke all on public.ranisa_products from public, anon, authenticated;
grant select on public.ranisa_products to anon, authenticated;
grant insert, update, delete on public.ranisa_products to authenticated;

revoke all on public.ranisa_site_media from public, anon, authenticated;
grant select on public.ranisa_site_media to anon, authenticated;
grant update on public.ranisa_site_media to authenticated;

revoke all on public.ranisa_admin_users from public, anon, authenticated;
grant select on public.ranisa_admin_users to authenticated;
