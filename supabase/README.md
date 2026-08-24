# CMS da campanha no Supabase

Este diretório contém a migração, os dados iniciais e a Edge Function usados
pela aplicação Next.js hospedada na Vercel.

## Ordem recomendada

1. Execute `migrations/20260822000000_cms_schema.sql` no SQL Editor do Supabase.
2. Execute `migrations/20260824000000_campaign_content_corrections.sql`. Esta
   migração corrige os valores legados que ainda apontavam para logos no lugar das
   artes da galeria, remove a palavra “pré” dos textos antigos, corrige acentos e
   cria os cinco registros iniciais da galeria quando ela estiver vazia.
3. Execute `seed/cms-source-seed.sql` somente em uma instalação nova ou quando
   quiser carregar/substituir o conteúdo editável pelos padrões do código-fonte.
4. Se houver um backup real exportado pelo painel, prefira importar esse backup
   depois do seed para substituir os valores padrão pelas alterações mais recentes.
5. Publique a função `functions/cms-api` e configure as variáveis de ambiente no
   projeto Vercel. A `service_role` nunca
   deve ser enviada ao navegador nem usada em variáveis `NEXT_PUBLIC_*`.

## Sobre os dados atuais

O Git guarda o código, não o banco remoto. O arquivo `cms-source-seed.sql` foi
gerado a partir de `lib/cms-defaults.ts`, isto é, contém os dados padrão versionados
no código. Ele não representa eventuais alterações feitas depois pelo painel.

Para transportar alterações feitas no CMS atual, use o backup JSON do painel
administrativo (`/api/cms?download=1`) e substitua/importе o conteúdo no Supabase.
As sessões de login não são exportadas por segurança; crie um novo usuário ou
configure o login do gestor na autenticação da aplicação de destino.

## Imagens

As imagens padrão usam caminhos `/campaign/...` e continuam no pacote do site.
Se o backup real contiver imagens como data URLs, migre-as para Supabase Storage
ou para os assets públicos da aplicação antes de trocar os links. A galeria usa
`gallery_albums` e `gallery_photos`; a página inicial exibe apenas fotos marcadas
como `featured_on_home`.

O formulário de participação usa `campaign_signups`, com acesso de leitura
bloqueado para o navegador. O destinatário editorial inicial é
`draclaudiabenassuly@gmail.com`; SMTP/Resend deve ser configurado separadamente
caso a equipe queira receber notificações automáticas.

## Verificação de publicação

Depois de aplicar a migração e publicar a função, confira o mesmo projeto
Supabase usado pela Vercel:

```bash
curl -sS "$NEXT_PUBLIC_SUPABASE_URL/functions/v1/cms-api?public=1" \
  -H "apikey: $CMS_PUBLIC_KEY"
```

O JSON deve retornar, entre outros, `galleryImage1` como
`/campaign/gallery-principal.jpg`, `galleryImage2` como
`/campaign/gallery-identidade.png`, `galleryImage3` como
`/campaign/gallery-saude.png`, `galleryImage4` como
`/campaign/gallery-justica.png` e `galleryImage5` como
`/campaign/gallery-autonomia.png`. Também deve retornar os ícones `bank`,
`scales`, `health` e `community` em `proposalsJson`.
