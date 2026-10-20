-- OPTIONAL. Review/approve the retention notice before running this script.
-- In Database > Extensions, enable pg_cron first. This job permanently deletes
-- expired registrations according to the policy. It does not run on preview.
select cron.schedule(
 'fluxos2026-retention',
 '17 6 * * *',
 'select public.purge_expired_event_registrations();'
);
