-- Campaign content corrections
--
-- The first CMS seed was applied before the final campaign copy and gallery
-- assets were approved. This migration is deliberately conservative: it only
-- replaces the known legacy values and the known placeholder image paths. It
-- does not overwrite an editor's unrelated custom copy.

begin;

update public.cms_content
set value = replace(replace(value, 'pré-candidatura', 'candidatura'), 'Pré-candidatura', 'Candidatura'), updated_at = now()
where value like '%pré-candidatura%' or value like '%Pré-candidatura%';

update public.cms_content
set value = replace(value, 'Claudia', 'Cláudia'), updated_at = now()
where value like '%Claudia%';

update public.cms_content
set value = 'Candidata a Deputada Federal', updated_at = now()
where key = 'topRibbonLabel' and (value ilike '%pré%' or value ilike '%pré-candid%');

update public.cms_content
set value = 'Esta candidatura não é minha.', updated_at = now()
where key = 'quote' and value in ('Esta pré-candidatura não é minha.', 'Esta pre-candidatura não é minha.');

update public.cms_content
set value = 'Cláudia Benassuly', updated_at = now()
where key = 'coalitionFederalDeputyName' and value in ('Claudia Benassuly', 'Cláudia Benassuly');

update public.cms_content
set value = '/campaign/gallery-principal.jpg', updated_at = now()
where key = 'galleryImage1' and value in ('/campaign/claudia-hero.jpeg', '/campaign/gallery-principal.jpg');

update public.cms_content
set value = '/campaign/gallery-identidade.png', updated_at = now()
where key = 'galleryImage2' and value in ('/campaign/logo-transparent-color.png', '/campaign/logo-name-color.png', '/campaign/gallery-identidade.png');

update public.cms_content
set value = '/campaign/gallery-saude.png', updated_at = now()
where key = 'galleryImage3' and value in ('/campaign/logo-transparent-footer.png', '/campaign/logo-transparent-color.png', '/campaign/gallery-saude.png');

update public.cms_content
set value = '/campaign/gallery-justica.png', updated_at = now()
where key = 'galleryImage4' and value in ('/campaign/logo-slogan-color.png', '/campaign/gallery-justica.png');

update public.cms_content
set value = '/campaign/gallery-autonomia.png', updated_at = now()
where key = 'galleryImage5' and value in ('/campaign/logo-slogan-color.png', '/campaign/gallery-autonomia.png');

insert into public.cms_content (key, value, updated_at)
select 'topRibbonLabel', 'Candidata a Deputada Federal', now()
where not exists (select 1 from public.cms_content where key = 'topRibbonLabel');

insert into public.cms_content (key, value, updated_at)
select 'ogImage', '/og.png', now()
where not exists (select 1 from public.cms_content where key = 'ogImage');

insert into public.cms_content (key, value, updated_at)
select 'proposalsJson', $$[{"number":"01","title":"Autonomia econômica","copy":"Creches, crédito, inclusão digital e oportunidades para que cada mulher possa escolher o próprio caminho.","tag":"Trabalho & renda","icon":"bank"},{"number":"02","title":"Segurança e justiça","copy":"Mais orçamento para proteger mulheres, combater a violência e fazer a justiça chegar mais rápido.","tag":"Proteção real","icon":"scales"},{"number":"03","title":"Saúde integral","copy":"Prevenção, atendimento humanizado, saúde mental e cuidado para todas as fases da vida.","tag":"SUS que acolhe","icon":"health"},{"number":"04","title":"Participação e inclusão","copy":"A política precisa refletir a vida de mulheres periféricas, negras, indígenas, ribeirinhas e rurais.","tag":"Voz & presença","icon":"community"}]$$, now()
where not exists (select 1 from public.cms_content where key = 'proposalsJson');

update public.news_posts
set image = '/campaign/gallery-autonomia.png', updated_at = now()
where id = 'creche-tempo-integral'
  and image in ('/campaign/claudia-hero.jpeg', '/campaign/logo-transparent-color.png', '/campaign/logo-transparent-footer.png');

update public.news_posts
set image = '/campaign/gallery-justica.png', updated_at = now()
where id = 'pensao-alimenticia'
  and image in ('/campaign/claudia-hero.jpeg', '/campaign/logo-transparent-color.png', '/campaign/logo-transparent-footer.png');

update public.news_posts
set image = '/campaign/gallery-saude.png', updated_at = now()
where id = 'saude-da-mulher'
  and image in ('/campaign/claudia-hero.jpeg', '/campaign/logo-transparent-color.png', '/campaign/logo-transparent-footer.png');

-- The public gallery is usable immediately after migration, while later
-- albums/photos remain fully manageable from the CMS.
insert into public.gallery_albums (id, title, slug, description, cover, published_at, featured, sort_order, updated_at)
select 'campanha-2026', 'Campanha 2026', 'campanha-2026', 'Identidade, propostas e registros da caminhada de Cláudia Benassuly.', '/campaign/gallery-principal.jpg', '2026-08-24', true, 0, now()
where not exists (select 1 from public.gallery_albums);

insert into public.gallery_photos (id, album_id, title, caption, image, alt, published_at, featured_on_home, sort_order, updated_at)
select * from (values
  ('galeria-principal', 'campanha-2026', 'Registro principal', 'Por ela. Por nós. Por todas.', '/campaign/gallery-principal.jpg', 'Cláudia Benassuly em registro principal da campanha', '2026-08-24', true, 0, now()),
  ('galeria-identidade', 'campanha-2026', 'Identidade visual', 'A presença que identifica esta candidatura.', '/campaign/gallery-identidade.png', 'Retrato de Cláudia Benassuly em PNG transparente', '2026-08-24', true, 1, now()),
  ('galeria-saude', 'campanha-2026', 'Saúde da mulher', 'Exame preventivo não pode esperar meses.', '/campaign/gallery-saude.png', 'Arte da campanha sobre saúde da mulher', '2026-08-24', true, 2, now()),
  ('galeria-justica', 'campanha-2026', 'Segurança e justiça', 'Pensão alimentícia no bolso, sem enrolação.', '/campaign/gallery-justica.png', 'Arte da campanha sobre pensão alimentícia', '2026-08-24', true, 3, now()),
  ('galeria-autonomia', 'campanha-2026', 'Autonomia econômica', 'Creche em tempo integral também é liberdade para trabalhar.', '/campaign/gallery-autonomia.png', 'Arte da campanha sobre creche em tempo integral', '2026-08-24', true, 4, now())
) as seed(id, album_id, title, caption, image, alt, published_at, featured_on_home, sort_order, updated_at)
where not exists (select 1 from public.gallery_photos);

commit;
