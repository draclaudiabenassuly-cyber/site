-- Claudia Benassuly CMS — Supabase/Postgres schema
-- Generated from the current Cloudflare D1 CMS schema.
-- This file contains no passwords, admin sessions or secret keys.

create table if not exists public.cms_content (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.agenda_events (
  id text primary key,
  date text not null,
  day text not null,
  month text not null,
  title text not null,
  location text not null,
  detail text not null,
  tone text not null check (tone in ('teal', 'blue', 'gold')),
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.news_posts (
  id text primary key,
  category text not null,
  title text not null,
  excerpt text not null,
  read_time text not null,
  image text not null,
  published_at text not null default '',
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

-- Kept for compatibility with the existing custom CMS session flow.
-- The migration does not insert any session or password data.
create table if not exists public.cms_sessions (
  token text primary key,
  email text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists agenda_events_order_idx
  on public.agenda_events (sort_order, date);

create index if not exists news_posts_publish_idx
  on public.news_posts (published_at desc, sort_order);

alter table public.cms_content enable row level security;
alter table public.agenda_events enable row level security;
alter table public.news_posts enable row level security;
alter table public.cms_sessions enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.cms_content, public.agenda_events, public.news_posts
  to anon, authenticated;

drop policy if exists "Public can read CMS content" on public.cms_content;
create policy "Public can read CMS content"
  on public.cms_content for select
  to anon, authenticated
  using (true);

drop policy if exists "Public can read agenda" on public.agenda_events;
create policy "Public can read agenda"
  on public.agenda_events for select
  to anon, authenticated
  using (true);

drop policy if exists "Public can read news" on public.news_posts;
create policy "Public can read news"
  on public.news_posts for select
  to anon, authenticated
  using (true);

-- No public policy is created for cms_sessions.
-- Writes should happen only through a trusted server using the service role.
revoke all on public.cms_sessions from anon, authenticated;

