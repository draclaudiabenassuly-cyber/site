# Handoff para o Codex

Este pacote é o código-fonte atual do site da Cláudia Benassuly. Ele está pronto
para ser revisado e publicado no projeto Vercel/Supabase da campanha.

## O que foi corrigido no código

- CMS público e painel usam leitura sem cache.
- Depois de salvar uma imagem ou texto, o painel relê o endpoint público para
  confirmar a publicação.
- Imagens públicas recebem uma revisão de CMS para evitar imagem antiga presa em
  cache do navegador ou da CDN.
- A migração `supabase/migrations/20260824000000_campaign_content_corrections.sql`
  corrige os dados legados que estavam no banco remoto: acentos, “pré”, quote,
  imagens da galeria, imagens das notícias, ícones e galeria inicial.
- A galeria da home tem tiles uniformes e a página `/galeria` continua preparada
  para álbuns, fotos, destaque na home e CRUD pelo painel.
- A seção “O que move esta candidatura” usa ícones SVG próprios: mulher + maleta
  + cifrão, balança, mãos/coração/cruz médica rosa e grupo de participação.
- O VLibras tem suporte para os dois formatos do widget oficial, ancoragem no
  canto inferior esquerdo e seleção inicial da intérprete Hosana. O CSS/JS fica
  no componente `app/components/VlibrasWidget.tsx` e no final de `app/globals.css`.
- O Open Graph está em `public/og.png`; o favicon quadrado está em
  `public/favicon.png` e é configurado em `app/layout.tsx`. A imagem de
  compartilhamento também aparece no CMS como `ogImage`; quando o valor é uma
  URL pública, `generateMetadata()` usa essa imagem nos cards do WhatsApp e das
  redes sociais. Data URLs continuam sendo usadas no site, mas caem para
  `/og.png` no crawler porque redes sociais não aceitam `data:` como OG image.
- O login e a barra lateral administrativa usam a logo branca
  `/campaign/logo-name-white.png`.

## Por que o preview antigo não refletia as alterações

Uma leitura direta do endpoint público do Supabase conectado ao preview retornou
valores legados do banco — por exemplo, `/campaign/claudia-hero.jpeg` nas imagens
da galeria e o texto “pré-candidatura”. Os defaults do código não substituem uma
linha que já existe em `cms_content`; por isso foi criada uma migração explícita.
Sem executar essa migração no mesmo projeto Supabase usado pela Vercel, o preview
continua exibindo o banco antigo mesmo com o código corrigido.

## Aplicação recomendada

```bash
npm ci
npm run build
```

No projeto Supabase:

1. Execute `supabase/migrations/20260822000000_cms_schema.sql`.
2. Execute `supabase/migrations/20260824000000_campaign_content_corrections.sql`.
3. Publique novamente `supabase/functions/cms-api`.

Na Vercel, confirme as variáveis do mesmo projeto Supabase:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` ou `CMS_PUBLIC_KEY`
- `CMS_API_URL`
- `CMS_ADMIN_EMAIL`
- `CMS_ADMIN_PASSWORD`

Para notificações do formulário, configure nos secrets da Edge Function `cms-api`:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL` com um remetente verificado no Resend

Os cadastros são salvos mesmo antes desses dois secrets existirem. Sem eles, a aba “E-mails” do CMS informa que o aviso automático ainda não foi configurado.

O login de demonstração permanece `admin@admin.com` / `admin12$`; troque antes
da publicação definitiva.

## Teste de sincronização

Após aplicar a migração, faça uma alteração pequena no `/admin`, salve, e então
recarregue a página pública em uma janela anônima. Se quiser testar pelo terminal:

```bash
curl -sS "$NEXT_PUBLIC_SUPABASE_URL/functions/v1/cms-api?public=1" \
  -H "apikey: $CMS_PUBLIC_KEY"
```

O retorno deve conter as cinco imagens da galeria, o `proposalsJson` com os quatro
ícones e o texto “Candidata a Deputada Federal”.

## Cuidados

- Não coloque `SUPABASE_SERVICE_ROLE_KEY` no frontend nem em variáveis
  `NEXT_PUBLIC_*`.
- Não rode o seed completo sobre um banco já editado sem fazer backup: ele
  restaura os padrões versionados.
- Para imagens muito grandes, use Supabase Storage ou reduza a imagem antes de
  salvar; a Edge Function limita data URLs a 900 KB.

## Estado da publicação em 24/08/2026

- O build local passou com `npm.cmd run build`, incluindo TypeScript e as 17
  páginas/rotas do Next.
- O deployment de produção da Vercel baseado no commit `39593f0` terminou como
  `Ready` no projeto `draclaudiabenassuly-cyber-site`, dentro da conta da
  Cláudia.
- Foram configuradas na Vercel, em Production, as variáveis públicas
  `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, seguidas
  de um redeploy concluído com sucesso.
- No projeto Supabase `ubzgxmxroeygdukjsinh`, as migrações de schema e de
  correção de conteúdo/galeria foram executadas com sucesso.
- A função existente `cms-api` respondeu no site publicado com o conteúdo do
  banco, incluindo 5 fotos da galeria, 3 compromissos e os textos corrigidos.
- Verificação no domínio `https://claudiabenassuly.com.br/`: home, galeria,
  agenda, notícias, VLibras e formulário estão presentes; `/admin` abriu o CMS
  autenticado e exibiu 91 campos, 5 fotos e 3 compromissos.
- O login demonstrativo `admin@admin.com` / `admin12$` ainda deve ser trocado
  pela equipe antes de divulgar o acesso administrativo.
- O cadastro de e-mails é salvo sem Resend. Para receber avisos automáticos,
  ainda é necessário configurar `RESEND_API_KEY` e `RESEND_FROM_EMAIL` nos
  secrets da função `cms-api`.
