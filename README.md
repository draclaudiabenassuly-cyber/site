# Claudia Benassuly — Deputada Federal 23 23

Site institucional e eleitoral da Claudia Benassuly, preparado para publicação na Vercel com Next.js.

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
- `/agenda` — agenda
- `/noticias` — notícias
- `/santinho` — material eleitoral
- `/admin` — administração
- `/politica-de-privacidade` — política de privacidade
- `/termos-de-uso` — termos de uso
- `/cookies` — política de cookies

## Deploy

O repositório está configurado para o Vercel detectar o Next.js automaticamente. Não é necessário Vite, Vinext, Wrangler, Cloudflare Worker ou scripts especiais de build.
