begin;

create table public.event_registrations (
 id uuid primary key default gen_random_uuid(),
 request_id uuid not null unique,
 submission_hash text not null unique check (submission_hash ~ '^[a-f0-9]{64}$'),
 full_name text not null check (char_length(full_name) between 5 and 120),
 email text not null check (email = lower(email) and char_length(email) <= 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
 phone text not null check (phone ~ '^\+55[1-9][0-9](9[0-9]{8}|[2-5][0-9]{7})$'),
 campaign text not null default 'fluxos2026_presencial' check (campaign = 'fluxos2026_presencial'),
 utm_source text check (char_length(utm_source) <= 150),
 utm_medium text check (char_length(utm_medium) <= 150),
 utm_campaign text check (char_length(utm_campaign) <= 150),
 utm_content text check (char_length(utm_content) <= 150),
 utm_term text check (char_length(utm_term) <= 150),
 event_contact_consent boolean not null check (event_contact_consent = true),
 privacy_notice_version text not null check (privacy_notice_version = '2026-10-19-v1'),
 consent_timestamp timestamptz not null default now(),
 future_communications_opt_in boolean not null default false,
 created_at timestamptz not null default now()
);
comment on table public.event_registrations is 'Inscrições privadas da campanha presencial; não comprova entrada no grupo. Dados potencialmente sensíveis pelo contexto religioso.';
create index event_registrations_created_at_idx on public.event_registrations(created_at desc);
create index event_registrations_campaign_utm_idx on public.event_registrations(campaign,utm_campaign);
alter table public.event_registrations enable row level security;
revoke all on public.event_registrations from public,anon,authenticated;
grant select,insert on public.event_registrations to service_role;

create table public.registration_rate_limits (
 key_hash text primary key check (key_hash ~ '^[a-f0-9]{64}$'),
 hits integer not null,
 expires_at timestamptz not null
);
alter table public.registration_rate_limits enable row level security;
revoke all on public.registration_rate_limits from public,anon,authenticated;

-- Atomic shared rate limits survive cold starts and concurrent Edge workers.
-- Only salted HMACs are persisted. No IP address is collected.
create function public.consume_registration_rate_limit(p_key text,p_limit integer,p_window_seconds integer)
returns boolean language plpgsql security definer set search_path = '' as $$
declare v_hits integer;
begin
 if p_key !~ '^[a-f0-9]{64}$' or p_limit < 1 or p_limit > 10000 or p_window_seconds < 60 or p_window_seconds > 86400 then
  raise exception 'Invalid limit configuration';
 end if;
 delete from public.registration_rate_limits where expires_at < now()-interval '1 day';
 insert into public.registration_rate_limits(key_hash,hits,expires_at)
 values(p_key,1,now()+p_window_seconds*interval '1 second')
 on conflict (key_hash) do update set
  hits=case when public.registration_rate_limits.expires_at <= now() then 1 else public.registration_rate_limits.hits+1 end,
  expires_at=case when public.registration_rate_limits.expires_at <= now() then now()+p_window_seconds*interval '1 second' else public.registration_rate_limits.expires_at end
 returning hits into v_hits;
 return v_hits <= p_limit;
end;
$$;
revoke all on function public.consume_registration_rate_limit(text,integer,integer) from public,anon,authenticated;
grant execute on function public.consume_registration_rate_limit(text,integer,integer) to service_role;

-- Idempotency handles a response lost AFTER the transaction commits.
-- An identical payload (including consent options/UTMs) is not inserted twice.
-- Never disclose to a public caller whether an email/phone already exists.
create function public.save_event_registration(p_request_id uuid,p_submission_hash text,p_payload jsonb)
returns uuid language plpgsql security definer set search_path = '' as $$
declare v_id uuid; v_hash text;
begin
 select id,submission_hash into v_id,v_hash from public.event_registrations where request_id=p_request_id;
 if v_id is not null then
  if v_hash <> p_submission_hash then raise exception 'Request conflict'; end if;
  return v_id;
 end if;
 insert into public.event_registrations (
  request_id,submission_hash,full_name,email,phone,campaign,
  utm_source,utm_medium,utm_campaign,utm_content,utm_term,
  event_contact_consent,privacy_notice_version,future_communications_opt_in
 ) values (
  p_request_id,p_submission_hash,p_payload->>'full_name',p_payload->>'email',p_payload->>'phone',p_payload->>'campaign',
  p_payload->>'utm_source',p_payload->>'utm_medium',p_payload->>'utm_campaign',p_payload->>'utm_content',p_payload->>'utm_term',
  (p_payload->>'event_contact_consent')::boolean,p_payload->>'privacy_notice_version',(p_payload->>'future_communications_opt_in')::boolean
 ) on conflict do nothing returning id into v_id;
 if v_id is null then
  select id into v_id from public.event_registrations where submission_hash=p_submission_hash;
 end if;
 if v_id is null then raise exception 'Registration not persisted'; end if;
 return v_id;
end;
$$;
revoke all on function public.save_event_registration(uuid,text,jsonb) from public,anon,authenticated;
grant execute on function public.save_event_registration(uuid,text,jsonb) to service_role;

-- Enable the optional Cron script only after the responsible person approves
-- the notice/retention policy. No existing data is deleted by this migration.
create function public.purge_expired_event_registrations()
returns integer language plpgsql security definer set search_path = '' as $$
declare removed integer;
begin
 delete from public.event_registrations
 where (future_communications_opt_in=false and now()>timestamptz '2026-10-24 20:00:00+00'+interval '90 days')
    or (future_communications_opt_in=true and created_at<now()-interval '1 year');
 get diagnostics removed = row_count;
 return removed;
end;
$$;
revoke all on function public.purge_expired_event_registrations() from public,anon,authenticated;
grant execute on function public.purge_expired_event_registrations() to service_role;
commit;
