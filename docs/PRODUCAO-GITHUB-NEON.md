# Produção — GitHub Pages + Neon

## Arquitetura

O frontend do DataDemocracia é publicado como site estático no GitHub Pages. O build usa `VITE_BASE_PATH=/DataDemocracia/`, gera `dist/public` e copia `index.html` para `404.html` para preservar as rotas do aplicativo em navegação direta.

O banco PostgreSQL de produção está no projeto Neon `datademocracia`, região AWS South America 1 — São Paulo, branch `production`, banco `neondb`.

A Neon Data API está ativa no schema `public` e usa o Better Auth do Neon para autenticação. O cliente do frontend fica em `client/src/lib/neon.ts`.

## Variáveis públicas do build

O workflow já contém os dois endpoints públicos do Neon:

- `VITE_NEON_DATA_API_URL`
- `VITE_NEON_AUTH_URL`

Valores atuais do ambiente Neon:

```text
VITE_NEON_DATA_API_URL=https://ep-crimson-king-b6e827kq.apirest.c-2.sa-east-1.aws.neon.tech/neondb/rest/v1
VITE_NEON_AUTH_URL=https://ep-crimson-king-b6e827kq.neonauth.c-2.sa-east-1.aws.neon.tech/neondb/auth
```

Esses endpoints podem ser usados no navegador. Não coloque no frontend a connection string PostgreSQL nem senha privilegiada. Se preferir, eles podem ser movidos posteriormente para **Actions Variables**; não são secrets porque não carregam credenciais.

## Banco e segurança

A branch `production` contém:

- `public.politicians`;
- `public.promises`;
- `public.promise_evidence`;
- `public.monitoring_items`.

Políticos, promessas e evidências têm leitura pública. Itens de monitoramento exigem autenticação e usam RLS para permitir acesso apenas ao próprio usuário. A Data API não deve receber tabelas novas sem grants mínimos e políticas RLS revisadas.

## Cloudflare Workers Static Assets

O repositório agora contém `wrangler.jsonc`, que declara `dist/public` como diretório de assets estáticos e usa fallback SPA para as rotas do React. No formulário **Workers & Pages → Create application → Connect to GitHub**, use:

```text
Build command: pnpm build:static
Deploy command: npx wrangler deploy
Production branch: main
```

Em **Configurações avançadas**, defina `VITE_BASE_PATH=/` e os dois endpoints públicos do Neon. Não use `pnpm run build`, pois esse comando também compila o servidor Express do starter; para este deploy, o produto é o frontend estático em `dist/public`.

O antigo workflow `.github/workflows/deploy-pages.yml` pode permanecer no repositório, mas não é necessário para o deploy Cloudflare.

A URL esperada é:

`https://tarlisodoria.github.io/DataDemocracia/`

## Estado da integração

A base Neon e o schema estão prontos. O frontend agora contém o cliente Neon e uma função pública inicial para listar políticos. As telas ainda usam dados demonstrativos; o próximo passo é conectar Home, Search, Profile e Promises a consultas reais e criar o fluxo visual de login Better Auth.
