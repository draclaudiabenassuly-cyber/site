# Migração do CMS para Supabase

Este diretório prepara o banco do CMS atual, que hoje usa Cloudflare D1,
para uma futura adaptação da aplicação para Supabase/Postgres.

## Ordem recomendada

1. Execute `migrations/20260822000000_cms_schema.sql` no SQL Editor do Supabase.
2. Execute `seed/cms-source-seed.sql` para carregar o conteúdo padrão presente
   no código-fonte atual.
3. Se houver um backup real exportado pelo painel, prefira importar esse backup
   depois do seed para substituir os valores padrão pelas alterações mais recentes.
4. Peça ao Codex para trocar as rotas D1 (`cloudflare:workers`) pelas consultas
   Supabase no servidor da Vercel.
5. Configure as variáveis de ambiente no projeto Vercel. A `service_role` nunca
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
Se o backup real contiver imagens como data URLs, o Codex deve migrá-las para
Supabase Storage ou para os assets públicos da aplicação antes de trocar os links.

