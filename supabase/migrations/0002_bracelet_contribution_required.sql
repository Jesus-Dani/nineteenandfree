-- Correction to the Phase 0/1 migration: bracelet_requests.contribution_id
-- should never be null. Per TRD Section 3, every other field on this table
-- is explicitly marked (nullable) except contribution_id — bracelet requests
-- are only ever shown after a successful payment (Design doc Section 12),
-- so every row must be tied to one. Safe to apply now: no bracelet_requests
-- rows exist yet, since the feature doesn't exist in the app until Phase 3.

alter table bracelet_requests
  alter column contribution_id set not null;
