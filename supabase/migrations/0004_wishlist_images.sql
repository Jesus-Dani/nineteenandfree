-- Owner-requested addition (not in the original TRD Section 3 field list):
-- lets the admin attach a photo to each Wishlist item.

alter table wishlist_items add column if not exists image_url text;

-- Public bucket: uploads happen server-side via the service-role client
-- (bypasses RLS), and public reads need no policy at all since the bucket
-- itself is marked public.
insert into storage.buckets (id, name, public)
values ('wishlist-images', 'wishlist-images', true)
on conflict (id) do nothing;
