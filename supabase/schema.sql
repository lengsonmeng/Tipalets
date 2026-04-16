create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  display_name text not null,
  email text,
  role text not null default 'client' check (role in ('client', 'admin')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.client_integrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  telegram_chat_id text,
  telegram_bot_token text,
  active_setting_id uuid,
  sync_enabled boolean not null default true,
  last_telegram_update_id bigint,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.alert_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  alert_type text not null default 'Donation',
  enabled boolean not null default true,
  layout text not null default 'image-above-text',
  logo_url text,
  sound_url text,
  message_template text not null default 'Thank you {name} for donated {amount}{currency}{newline}{message}',
  alert_duration numeric(5,2) not null default 10,
  text_delay numeric(5,2) not null default 3.5,
  sound_volume integer not null default 100,
  font_family text not null default 'Poppins',
  font_size integer not null default 36,
  font_weight text not null default '700',
  text_color text not null default '#FFFFFF',
  text_highlight_color text not null default '#32C3A6',
  background_color text not null default '#000000',
  alert_animation text not null default 'fade-pop',
  text_animation text not null default 'type-rise',
  is_default boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.donation_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  alert_setting_id uuid not null references public.alert_settings (id) on delete cascade,
  source_message_id text not null unique,
  donor_name text,
  amount numeric(12,2) not null default 0,
  currency text not null default 'USD',
  supporter_message text,
  raw_text text,
  paid_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.donation_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  style text not null default 'original-gamepad',
  color_theme text not null default 'light',
  currency text not null default 'USD',
  currency_symbol text not null default '$',
  goal_amount numeric(12,2) not null default 1,
  current_amount numeric(12,2) not null default 0,
  goal_type text not null default 'one-time' check (goal_type in ('one-time', 'daily')),
  progress_display text not null default '$0.00 / $1.00',
  set_end_date boolean not null default false,
  ends_on timestamptz,
  status text not null default 'pending' check (status in ('pending', 'active', 'completed', 'expired')),
  queue_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.donation_widget_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  title text not null default 'Donation Widget',
  theme text not null default 'sunset',
  layout text not null default 'stacked-cards',
  max_items integer not null default 4,
  show_currency boolean not null default true,
  show_message boolean not null default true,
  background_color text not null default '#120C09',
  accent_color text not null default '#FF8A3D',
  text_color text not null default '#FFF4EC',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.client_integrations
  add constraint client_integrations_active_setting_fk
  foreign key (active_setting_id) references public.alert_settings (id) on delete set null;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
begin
  base_username := lower(
    regexp_replace(
      coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1), 'user'),
      '[^a-zA-Z0-9_-]',
      '',
      'g'
    )
  );

  insert into public.profiles (id, username, display_name, email)
  values (
    new.id,
    left(base_username, 24) || substr(replace(new.id::text, '-', ''), 1, 6),
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1), 'Creator'),
    new.email
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.client_integrations enable row level security;
alter table public.alert_settings enable row level security;
alter table public.donation_events enable row level security;
alter table public.donation_goals enable row level security;
alter table public.donation_widget_settings enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles
for select
using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
on public.profiles
for update
using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

drop policy if exists "client_integrations_own_all" on public.client_integrations;
create policy "client_integrations_own_all"
on public.client_integrations
for all
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "alert_settings_owner_manage" on public.alert_settings;
create policy "alert_settings_owner_manage"
on public.alert_settings
for all
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "alert_settings_public_widget_read" on public.alert_settings;
create policy "alert_settings_public_widget_read"
on public.alert_settings
for select
using (enabled = true or auth.uid() = user_id or public.is_admin());

drop policy if exists "donation_events_owner_manage" on public.donation_events;
create policy "donation_events_owner_manage"
on public.donation_events
for all
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "donation_events_public_widget_read" on public.donation_events;
create policy "donation_events_public_widget_read"
on public.donation_events
for select
using (
  exists (
    select 1
    from public.alert_settings
    where alert_settings.id = donation_events.alert_setting_id
      and alert_settings.enabled = true
  )
  or auth.uid() = user_id
  or public.is_admin()
);

drop policy if exists "donation_goals_owner_manage" on public.donation_goals;
create policy "donation_goals_owner_manage"
on public.donation_goals
for all
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "donation_goals_public_widget_read" on public.donation_goals;
create policy "donation_goals_public_widget_read"
on public.donation_goals
for select
using (
  status in ('active', 'completed')
  or auth.uid() = user_id
  or public.is_admin()
);

drop policy if exists "donation_widget_settings_owner_manage" on public.donation_widget_settings;
create policy "donation_widget_settings_owner_manage"
on public.donation_widget_settings
for all
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "donation_widget_settings_public_read" on public.donation_widget_settings;
create policy "donation_widget_settings_public_read"
on public.donation_widget_settings
for select
using (true);

insert into storage.buckets (id, name, public)
values ('alert-assets', 'alert-assets', true)
on conflict (id) do nothing;

drop policy if exists "alert_assets_public_read" on storage.objects;
create policy "alert_assets_public_read"
on storage.objects
for select
using (bucket_id = 'alert-assets');

drop policy if exists "alert_assets_owner_insert" on storage.objects;
create policy "alert_assets_owner_insert"
on storage.objects
for insert
with check (
  bucket_id = 'alert-assets'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "alert_assets_owner_update" on storage.objects;
create policy "alert_assets_owner_update"
on storage.objects
for update
using (
  bucket_id = 'alert-assets'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'alert-assets'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "alert_assets_owner_delete" on storage.objects;
create policy "alert_assets_owner_delete"
on storage.objects
for delete
using (
  bucket_id = 'alert-assets'
  and auth.uid()::text = (storage.foldername(name))[1]
);
