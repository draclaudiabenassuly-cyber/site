-- Restore the approved vertical portrait used by the home hero.
-- The previous CMS value was a landscape data URL, which replaced the
-- framed portrait after the public CMS request finished loading.

update public.cms_content
set value = '/campaign/claudia-portrait-clean.jpg', updated_at = now()
where key = 'heroImage'
  and (value like 'data:image/%' or value in ('/campaign/claudia-hero.jpeg', '/campaign/claudia-hero.jpg'));
