# DataDemocracia

> **Não diga ao cidadão em quem votar. Mostre o que pode ser verificado.**

O DataDemocracia é uma plataforma cívica independente criada por **Tarliso Doria** para organizar dados públicos, documentos oficiais e evidências sobre candidatos, representantes e instituições políticas brasileiras.

O produto transforma registros dispersos em uma experiência de leitura clara: cada informação deve carregar fonte, data, escopo, contexto e limitações. A proposta não é criar um ranking de “melhores políticos”, publicar um fluxo de notícias ou substituir a decisão do eleitor. É oferecer um histórico verificável para que cada pessoa possa investigar, acompanhar e formar a própria opinião.

## Estado atual

O MVP está publicado e possui uma camada pública conectada ao Neon. A interface já entrega:

- home editorial com busca e apresentação da metodologia;
- exploração de políticos com filtros por cargo, estado e situação;
- perfis com overview, trajetória, promessas, atuação e integridade;
- cadeia visual de evidências e ficha exportável;
- radar analítico com dimensões independentes, fontes e explicações;
- comparação factual sem nota geral ou ranking partidário;
- área de monitoramento preparada para autenticação;
- catálogo público com 3 perfis e 9 promessas demonstrativas no Neon;
- fallback local para preservar a navegação durante indisponibilidade da API.

A versão publicada no ambiente gerenciado é o resultado do checkpoint `4bf4d0e`. A publicação em Cloudflare Workers Static Assets utiliza a mesma aplicação estática e o mesmo branch principal.

## Visão do produto

O DataDemocracia é organizado em quatro camadas:

1. **Leitura cidadã:** explicações progressivas, linguagem simples e contexto antes da métrica.
2. **Registro documental:** fonte original, documento, página, data de extração e data de revisão.
3. **Análise avançada:** indicadores com fórmula, denominador, período e limites explícitos.
4. **Acompanhamento:** monitoramento personalizado de políticos, promessas, temas, cidades e órgãos.

A plataforma deve permanecer não partidária. Não há cores de partidos, selo moral, placar esportivo ou recomendação de voto. Processos, investigações, denúncias, decisões, condenações, absolvições e arquivamentos devem ser tratados como estados jurídicos diferentes.

## Stack

- React 19 + TypeScript + Vite;
- Wouter para rotas do frontend;
- Tailwind CSS e CSS editorial próprio;
- Recharts para visualizações explicáveis;
- Lucide React para iconografia;
- Neon Data API para leitura pública e futura autenticação;
- PostgreSQL no Neon com RLS;
- Cloudflare Workers Static Assets para publicação;
- Vitest e TypeScript para verificação local.

## Desenvolvimento local

```bash
pnpm install
pnpm check
pnpm dev:static
```

O servidor de desenvolvimento utiliza a porta `3000` por padrão. Para a aplicação completa com o servidor Express:

```bash
pnpm dev
```

Comandos de qualidade e publicação:

```bash
pnpm check
pnpm test
pnpm build:static
pnpm deploy:cloudflare
```

A publicação estática exige as variáveis públicas de build:

- `VITE_NEON_DATA_API_URL`;
- `VITE_NEON_AUTH_URL`.

Use `.env.example` como referência. Nunca coloque connection string PostgreSQL, senha de banco ou credencial administrativa no frontend.

## Estrutura principal

```text
client/
  public/                 manifesto de rotas e arquivos públicos
  src/
    App.tsx               composição das rotas
    pages/                telas de produto
    components/datademocracia/ componentes editoriais e de evidência
    data/demo.ts          dados demonstrativos e tipos de domínio
    lib/neon.ts           cliente Neon e adaptação do catálogo público
    index.css             tokens visuais, layout e responsividade
server/
  _core/                  runtime HTTP e integrações do servidor
  routers.ts              procedimentos tRPC
  storage.ts              camada de persistência do servidor
neon/
  schema.sql              schema PostgreSQL, grants e políticas RLS
drizzle/
  schema.ts               tabela de usuários do runtime e migrações do servidor
docs/
  ROADMAP.md              backlog estratégico priorizado
  ARQUITETURA.md          mapa técnico e decisões de fronteira
  MODELO-DE-DADOS.md      entidades, proveniência e regras de integridade
  OPERACAO.md             desenvolvimento, dados, deploy e recuperação
  GUIA-DE-CONTINUIDADE.md guia para assumir o projeto sem perder contexto
  PRODUCAO-NEON.md        configuração publicada e checklist operacional
```

## Princípios de manutenção

- Fonte oficial antes de interpretação.
- Data e escopo em toda métrica.
- Ausência de registro não significa resultado zero.
- Toda classificação sensível deve ser revisável.
- Nenhum indicador deve ser convertido em nota geral de valor político.
- Dados demonstrativos devem ser rotulados como demonstrativos.
- Um perfil deve explicar também o que não mede.
- Alterações no schema precisam atualizar documentação, consultas e políticas RLS.

## Créditos

Projeto independente criado por **Tarliso Doria**. O DataDemocracia é desenvolvido como uma vitrine de engenharia cívica, design editorial de informação e transparência pública.
