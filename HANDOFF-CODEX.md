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

## Correções de interface em 25/08/2026

- O componente `app/components/VlibrasWidget.tsx` deixou de renderizar o
  contêiner legado `[vw]`. O player oficial já cria seus próprios hosts; manter
  os dois criava um segundo botão e uma camada invisível que bloqueava os
  cliques do CMS.
- O painel do VLibras foi reposicionado para abrir ao lado do botão, no canto
  inferior esquerdo, preservando Hosana como avatar inicial.
- O texto sobreposto `Vote 2323` da abertura foi removido de `app/page.tsx`.
- A migração `supabase/migrations/20260824100000_hero_image_correction.sql`
  restaura a foto vertical aprovada `/campaign/claudia-portrait-clean.jpg` no
  campo `heroImage`. A correção também foi aplicada no projeto Supabase
  `ubzgxmxroeygdukjsinh`.
- Antes da publicação desta correção, o DOM da home tinha simultaneamente um
  contêiner `[vw]` e o host oficial `#vlibras-access-wrapper`; o primeiro
  confirmadamente interceptava os cliques da barra lateral do `/admin`.

## Registro completo da retomada em 25/08/2026

### Pedidos relatados pela equipe

- Recuperar o contexto perdido quando a sessÃ£o do Codex foi encerrada duas vezes.
- Trabalhar sempre na conta/perfil autenticado da ClÃ¡udia no GitHub, Vercel e
  Supabase, sem alterar o perfil pessoal do Douglas.
- Colocar o site prÃ³prio online em `https://claudiabenassuly.com.br/` com Vercel
  e Supabase.
- Manter o CMS funcional, com cadastro, agenda, notÃ­cias, galeria e campos
  editoriais sincronizados.
- Corrigir o VLibras duplicado, o painel abrindo no topo/cortado e o avatar
  inicial; o combinado Ã© um Ãºnico botÃ£o no canto inferior esquerdo, painel ao
  lado e avatar feminino Hosana.
- Corrigir a foto inicial da home para o retrato vertical emoldurado, sem o
  pisca-pisca entre a foto correta e a paisagem antiga.
- Remover o texto `Vote 2323` que aparecia sobre a imagem da seÃ§Ã£o do santinho.
- Corrigir botÃµes que apareciam como nÃ£o clicÃ¡veis: CMS, abrir santinho, cards
  de notÃ­cias e cards da galeria.
- Corrigir a galeria da home e a pÃ¡gina completa `/galeria`: abertura lenta,
  cards que demoravam a responder ao hover/clique e os dois filtros que
  alternavam entre clicÃ¡veis e nÃ£o clicÃ¡veis.
- Corrigir menus da home e das pÃ¡ginas internas que alternavam entre clicÃ¡veis
  e nÃ£o clicÃ¡veis.
- Em todos os menus, a logo deve levar para a pÃ¡gina inicial `/`; na home, ela
  retorna ao topo da prÃ³pria pÃ¡gina.
- Registrar este histÃ³rico no projeto para que o contexto nÃ£o seja perdido de
  novo.

### CorreÃ§Ãµes feitas nesta retomada

- Removido o contÃªiner JSX legado `[vw]` do `VlibrasWidget`; ele criava o segundo
  botÃ£o e uma Ã¡rea invisÃ­vel sobre a pÃ¡gina. O widget oficial permanece como a
  Ãºnica instÃ¢ncia.
- Reposicionado o painel oficial do VLibras para `left: 76px` e `bottom: 16px`,
  com dimensÃµes responsivas ao lado do botÃ£o inferior esquerdo.
- Removido o chip visual `Vote 2323` da arte da seÃ§Ã£o do santinho em
  `app/page.tsx`. A numeraÃ§Ã£o continua nos locais oficiais do site, como faixa,
  FAQ, rodapÃ© e a prÃ³pria arte quando jÃ¡ fizer parte da imagem.
- Mantida a migraÃ§Ã£o `20260824100000_hero_image_correction.sql`, que troca o
  valor legado de `heroImage` pela foto aprovada
  `/campaign/claudia-portrait-clean.jpg`; a instruÃ§Ã£o SQL jÃ¡ foi executada no
  Supabase da ClÃ¡udia.
- A chave de cache das imagens deixou de usar `Date.now()` em cada foco/intervalo.
  Agora ela Ã© determinÃ­stica pelo conjunto de imagens, impedindo que a galeria
  seja recarregada enquanto a pessoa passa o mouse ou abre uma foto.
- Os cards da galeria da home, os filtros da `/galeria` e os cards de fotos da
  pÃ¡gina completa usam `type="button"`; as camadas internas nÃ£o capturam mais o
  ponteiro antes do elemento clicÃ¡vel.
- Os cards de notÃ­cias da home continuam abrindo o modal pelo clique e agora
  tambÃ©m respondem a Enter/EspaÃ§o; imagem e texto interno nÃ£o bloqueiam o evento.
- O ajuste do overlay legado corrige por consequÃªncia o painel CMS, o link
  `Abrir santinho digital`, os menus, os filtros e os cards localizados na regiÃ£o
  inferior da janela.

### VerificaÃ§Ã£o e estado de publicaÃ§Ã£o

- `npm.cmd run build` passou apÃ³s as correÃ§Ãµes: TypeScript passou, 17 rotas
  foram geradas e nÃ£o houve erro de compilaÃ§Ã£o.
- `git diff --check` passou; os avisos restantes sÃ£o apenas sobre a conversÃ£o
  de fim de linha CRLF do Windows.
- Antes do novo deploy, o site pÃºblico ainda mostra a versÃ£o anterior. O texto
  `Vote 2323` continuarÃ¡ visÃ­vel no navegador atÃ© a nova implantaÃ§Ã£o entrar no ar.
- Depois do push/deploy, validar na conta da ClÃ¡udia: home, `/galeria`,
  `/noticias`, `/santinho`, `/admin`, um card de foto, cada filtro, um card de
  notÃ­cia, `Abrir santinho digital`, menus e o VLibras.
