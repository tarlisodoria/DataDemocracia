# Produção — GitHub Pages + Supabase

## Arquitetura

O frontend do DataDemocracia é publicado como site estático no GitHub Pages. O build usa `VITE_BASE_PATH=/DataDemocracia/`, gera `dist/public` e copia `index.html` para `404.html` para preservar as rotas do aplicativo em navegação direta.

O cliente do Supabase fica em `client/src/lib/supabase.ts`. Sem as variáveis públicas, o aplicativo permanece no modo demonstrativo. Com as variáveis presentes, o cliente Supabase é inicializado no navegador:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

A chave anon/publishable pode aparecer no bundle do navegador; a proteção deve ser feita por RLS. Nunca use a service role key no frontend ou em secrets expostos ao build.

## Supabase

1. Crie ou selecione um projeto no Supabase.
2. Execute `supabase/schema.sql` no SQL Editor.
3. Revise as políticas RLS antes de inserir dados reais.
4. Ative autenticação para o fluxo de monitoramento quando o produto estiver pronto.
5. Cadastre os secrets `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no repositório do GitHub, em **Settings → Secrets and variables → Actions**.

O schema separa políticos, promessas, evidências e itens de monitoramento. Dados públicos podem ter leitura anônima; monitoramentos são vinculados a `auth.users` e só podem ser lidos/modificados pelo próprio usuário.

## GitHub Pages

O workflow `.github/workflows/deploy-pages.yml`:

1. instala Node e pnpm;
2. instala dependências com lockfile;
3. injeta as variáveis públicas do Supabase no build;
4. executa `pnpm build:static`;
5. cria `404.html` e `.nojekyll`;
6. publica o artefato no GitHub Pages.

No repositório, configure **Settings → Pages → Source: GitHub Actions**. Depois de um push em `main`, a URL esperada será:

`https://tarlisodoria.github.io/DataDemocracia/`

## Estado atual

O projeto já contém o workflow, o cliente opcional, o schema inicial e a configuração de base path. A publicação efetiva depende de duas autorizações externas que não estão disponíveis nesta sessão: acesso de escrita ao repositório `tarlisodoria/DataDemocracia` e as variáveis do projeto Supabase.
