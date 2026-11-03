# Arquitetura do DataDemocracia

## Visão geral

O DataDemocracia é uma aplicação React/TypeScript publicada como frontend estático. O catálogo público é lido pela Neon Data API com autenticação anônima para respeitar as políticas de acesso do banco. O servidor Express e os procedimentos tRPC permanecem preparados para recursos que exigem sessão, exportação, tarefas de ingestão e operações administrativas.

```text
Navegador
   │
   ├── React + Wouter + CSS editorial
   │       ├── páginas de leitura cidadã
   │       ├── componentes de evidência
   │       └── consultas públicas tipadas
   │
   ├── Neon Data API
   │       ├── politicians
   │       ├── promises
   │       └── promise_evidence
   │
   └── Neon Auth / monitoring_items
           └── dados privados por usuário

Fontes oficiais → pipeline de ingestão → normalização → revisão → Neon → interface
```

## Frontend

`client/src/App.tsx` concentra o mapa de rotas. As páginas ficam em `client/src/pages/` e representam as áreas do produto:

- `/`: apresentação, busca e destaques;
- `/buscar`: exploração e filtros;
- `/politico/:id`: perfil e overview;
- `/politico/:id/dossie`: dossiê factual;
- `/politico/:id/promessas`: compromissos do político;
- `/politico/:id/radar`: radar analítico;
- `/politico/:id/atuacao`: atuação;
- `/politico/:id/integridade`: integridade e limites;
- `/promessas`: catálogo de promessas;
- `/promessa/:id`: ficha de evidências;
- `/comparar`: comparação factual;
- `/monitoramento`: rota personalizada;
- `/metodologia`: fontes, regras e correções.

`client/src/components/datademocracia/ui.tsx` contém os componentes editoriais compartilhados: cabeçalho, rodapé, proveniência, status, linha do tempo, evidência, métrica, busca e estrutura de página.

`client/src/data/demo.ts` é um recorte demonstrativo tipado. Ele deve continuar servindo como fallback visual, mas não deve ser usado para apresentar números reais.

`client/src/lib/neon.ts` contém o cliente público do Neon e o adaptador que combina registros do banco com o modelo editorial. O próximo ciclo deve mover as consultas de promessas e evidências para essa camada.

## Dados e proveniência

O banco oficial do produto é PostgreSQL no Neon. O arquivo de referência é `neon/schema.sql`.

As entidades atuais são:

- `politicians`: identidade pública, cargo, partido, território, período e fonte principal;
- `promises`: compromisso, tema, status, progresso, prazo, competência, trajetória e origem;
- `promise_evidence`: documento, página, tipo de evidência, descrição, força e datas;
- `monitoring_items`: preferências privadas de acompanhamento por usuário.

Toda entidade factual deve poder responder:

1. de onde veio;
2. quando foi extraída;
3. quando foi revisada;
4. qual regra foi aplicada;
5. o que o dado não permite concluir.

## Segurança e acesso

As três tabelas públicas têm leitura para perfis anônimos e autenticados. `monitoring_items` exige autenticação e políticas RLS baseadas no identificador do usuário.

Nunca usar credenciais privilegiadas no navegador. Nunca remover RLS para acelerar uma consulta. Toda nova tabela deve receber grants mínimos, política de leitura ou escrita e teste de isolamento.

## Publicação

O build de produção do frontend é:

```bash
pnpm build:static
```

O resultado fica em `dist/public`. `wrangler.jsonc` define esse diretório como origem de assets e usa fallback SPA para rotas do React.

O deploy público é feito com:

```bash
npx wrangler deploy
```

A publicação gerenciada usa o branch principal e o checkpoint aceito pelo projeto. A URL pública atual é informada no histórico de publicação; não gravar URLs temporárias em código ou documentação de produto.

## Fronteiras importantes

- Componentes React não devem conter SQL ou regra de ingestão.
- Ingestão não deve publicar diretamente sem validação e revisão.
- A interface não deve inventar fonte, hash, atualização em tempo real ou estado jurídico.
- O banco não deve receber texto editorial sem origem e sem estado de revisão.
- Métricas devem carregar período e denominador, mesmo quando a tela os resume.
- O fallback demonstrativo deve ser explícito para não confundir protótipo com dado oficial.
