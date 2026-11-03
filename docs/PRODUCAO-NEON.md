# Produção — Neon e Cloudflare

## Arquitetura publicada

O DataDemocracia é publicado como frontend estático em Cloudflare Workers Static Assets. O build gera `dist/public` e o Worker usa fallback SPA para que as rotas do React funcionem em navegação direta.

O banco PostgreSQL de produção está no projeto Neon `datademocracia`, branch `production`, banco `neondb`. A Neon Data API está ativa no schema `public` e o cliente fica em `client/src/lib/neon.ts`.

## Variáveis públicas de build

O frontend utiliza apenas endpoints públicos:

- `VITE_NEON_DATA_API_URL`;
- `VITE_NEON_AUTH_URL`.

Esses valores não substituem credenciais administrativas. Nunca colocar connection string PostgreSQL, senha ou token privilegiado no bundle.

## Banco e segurança

O schema contém:

- `public.politicians`;
- `public.promises`;
- `public.promise_evidence`;
- `public.monitoring_items`.

Políticos, promessas e evidências possuem leitura pública. Itens de monitoramento exigem autenticação e usam RLS para permitir acesso apenas ao próprio usuário.

Ao criar uma nova tabela, revisar obrigatoriamente grants, políticas RLS, índices, retenção, fonte e documentação do modelo de dados.

## Build e deploy

Configuração do Worker em `wrangler.jsonc`:

```json
{
  "assets": {
    "directory": "./dist/public",
    "not_found_handling": "single-page-application"
  }
}
```

Comandos:

```bash
pnpm build:static
npx wrangler deploy
```

A branch principal é a origem do código publicado. Antes de publicar, executar `pnpm check`, `pnpm test` e `pnpm build:static`.

## Verificação pós-publicação

Confirmar:

- home retornando HTTP 200;
- `/buscar` e uma rota dinâmica retornando a aplicação;
- `/manus-routes.json` retornando JSON estático;
- catálogo público carregando pelo cliente Neon;
- fallback demonstrativo funcionando quando a API não responder;
- nenhuma credencial privada presente no bundle.

## Dados atuais

O banco contém um pequeno recorte demonstrativo de 3 políticos e 9 promessas. Ele serve para validar o fluxo de produto e deve permanecer rotulado como demonstrativo até que a ingestão oficial e a revisão correspondente estejam concluídas.

A evolução recomendada é conectar as páginas de perfil, promessas e evidências às tabelas já existentes antes de ampliar o número de registros.
