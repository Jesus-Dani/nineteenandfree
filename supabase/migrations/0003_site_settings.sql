-- Single-row settings table added in Phase 4, confirmed with the project
-- owner, to back the Give-flow shutdown toggle required by TRD Section 4
-- ("must be able to be disabled/closed post-event... without needing a
-- full redeploy or code change"). Not part of the TRD's original 5 tables.

create table if not exists site_settings (
  id boolean primary key default true,
  give_flow_enabled boolean not null default true,
  constraint site_settings_singleton check (id)
);

insert into site_settings (id, give_flow_enabled)
values (true, true)
on conflict (id) do nothing;
