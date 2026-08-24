# Cláudia Benassuly — Deputada Federal 2323

Site institucional e eleitoral da Cláudia Benassuly, preparado para publicação na Vercel com Next.js.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- APIs do Next.js para o CMS
- Supabase para o conteúdo dinâmico do site

## Desenvolvimento

Requer Node.js 22 ou superior.

```bash
npm ci
npm run dev
```

## Build de produção

O deploy da Vercel usa diretamente o build padrão do Next.js:

```bash
npm run build
npm start
```

A configuração de produção está em `vercel.json`. O código da aplicação fica em `app/` e os módulos auxiliares em `lib/`.

## Rotas principais

- `/` — página inicial
- `/historia` — A história
- `/propostas` — propostas
- `/compromissos` — compromissos e agenda pública
- `/agenda` — compatibilidade/agenda
- `/noticias` — notícias
- `/galeria` — álbuns e fotos da campanha
- `/santinho` — material eleitoral
- `/admin` — administração
- `/politica-de-privacidade` — política de privacidade
- `/termos-de-uso` — termos de uso
- `/cookies` — política de cookies

## Deploy

O repositório está configurado para o Vercel detectar o Next.js automaticamente. Não é necessário Vite, Vinext, Wrangler, Cloudflare Worker ou scripts especiais de build.

## Supabase e CMS

1. Rode `supabase/migrations/20260822000000_cms_schema.sql` no SQL Editor.
2. Rode `supabase/migrations/20260824000000_campaign_content_corrections.sql` para corrigir os valores legados que estavam impedindo o preview de refletir os ajustes aprovados e criar a galeria inicial quando as tabelas estiverem vazias.
3. Rode `supabase/seed/cms-source-seed.sql` apenas quando quiser restaurar integralmente os valores versionados no código; ele sobrescreve o conteúdo editável existente.
4. Publique `supabase/functions/cms-api` como Edge Function e configure `CMS_API_URL`, `CMS_PUBLIC_KEY` e `CMS_ADMIN_EMAIL`/`CMS_ADMIN_PASSWORD` na Vercel.
5. Acesse `/admin` para editar textos, números, logos, imagens, agenda, notícias e álbuns/fotos.

O CMS agora confirma a leitura pública depois de cada gravação. As páginas públicas fazem
requisições sem cache e acrescentam uma revisão às imagens, evitando que uma URL antiga
fique presa no navegador/CDN. Se o endpoint público ainda devolver valores antigos, a
migração acima não foi aplicada no projeto Supabase conectado à Vercel.

O login de demonstração existente é `admin@admin.com` / `admin12$`; altere essas credenciais nos secrets antes de colocar o site em produção.

O formulário “Quero participar” grava os e-mails na tabela `campaign_signups`. O endereço `draclaudiabenassuly@gmail.com` está salvo como destinatário editorial. Para enviar uma notificação automática, configure `RESEND_API_KEY` e `RESEND_FROM_EMAIL` nos secrets da Edge Function `cms-api` e publique a função novamente. A aba “E-mails” do CMS contém o passo a passo.
