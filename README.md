# DataDemocracia

[![CI](https://github.com/tarlisodoria/DataDemocracia/actions/workflows/ci.yml/badge.svg)](https://github.com/tarlisodoria/DataDemocracia/actions/workflows/ci.yml)

> **Não diga ao cidadão em quem votar. Mostre o que pode ser verificado.**

O DataDemocracia é uma plataforma cívica independente criada por **Tarliso Doria** para organizar dados públicos, documentos oficiais e evidências sobre candidatos, representantes e instituições políticas brasileiras.

Cada informação carrega fonte, data, escopo, contexto e limitações. O projeto não publica ranking de "melhores políticos", não agrega notícias e não substitui a decisão do eleitor: oferece um histórico verificável para que cada pessoa investigue e forme a própria opinião.

## Destaque: painel de votações da Câmara

[`/explorar/votacoes-2025.html`](client/explorar/votacoes-2025.html) reúne as **429 votações nominais do Plenário da Câmara em 2025**, com o voto de cada um dos 551 deputados, coletadas da API oficial de dados abertos.

- Filtro cruzado em todos os visuais: mapa do Brasil por estado e região, tipo de voto, mês, partido, tema, votação e deputado. Ctrl/Shift soma seleções.
- Títulos que descrevem o achado do recorte atual, recalculados a cada clique.
- Universo de cálculo visível em cada número e fonte em cada card.
- Modo auditoria com link para cada votação na API da Câmara.

Detalhes de método e formato dos dados em [docs/PAINEL-VOTACOES.md](docs/PAINEL-VOTACOES.md).

## Estado atual

- Home editorial com busca e apresentação da metodologia.
- Exploração de políticos com filtros por cargo, estado e situação.
- Perfis com visão geral, trajetória, promessas, atuação e integridade.
- Cadeia visual de evidências e ficha exportável.
- Radar analítico com dimensões independentes e explicações.
- Comparação factual sem nota geral.
- Painel de votações nominais da Câmara com dados oficiais de 2025.
- Catálogo público no Neon (3 perfis e 9 promessas **demonstrativos**), com fallback local se a API não responder.

Perfis, promessas e evidências ainda são demonstrativos e estão rotulados assim na interface. O painel de votações usa dados reais.

## Stack

- React 19, TypeScript e Vite
- Wouter para rotas
- Tailwind CSS 4 e CSS editorial próprio
- Neon (PostgreSQL com RLS e Data API) para leitura pública
- ECharts no painel de votações
- Cloudflare Workers Static Assets para publicação
- Vitest e TypeScript estrito para verificação

## Desenvolvimento

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm check        # TypeScript
pnpm test         # Vitest
pnpm build        # gera dist/public
pnpm deploy       # build + wrangler deploy
pnpm dados:votacoes 2025   # recoleta os dados do painel na API da Câmara
```

Variáveis públicas de build (veja `.env.example`):

- `VITE_NEON_DATA_API_URL`
- `VITE_NEON_AUTH_URL`

Nunca coloque connection string, senha de banco ou credencial administrativa no frontend.

## Estrutura

```text
client/
  explorar/               painéis analíticos (votacoes-2025.html), entradas próprias do Vite
  public/explorar/dados/  dados dos painéis, gerados por scripts/
  src/
    App.tsx               rotas
    pages/                telas do produto
    components/datademocracia/  componentes editoriais e de evidência
    components/ui/        primitivas de interface
    data/demo.ts          dados demonstrativos e tipos de domínio
    lib/neon.ts           cliente Neon e adaptação do catálogo público
    index.css             tokens visuais e layout
scripts/
  coletar-votacoes-camara.mjs  coleta das votações na API da Câmara
neon/
  schema.sql              schema PostgreSQL, grants e políticas RLS
docs/                     arquitetura, dados, operação e roadmap
```

## Documentação

| Documento                                            | Conteúdo                                         |
| ---------------------------------------------------- | ------------------------------------------------ |
| [Roadmap](docs/ROADMAP.md)                           | Evolução do produto, dados, segurança e operação |
| [Arquitetura](docs/ARQUITETURA.md)                   | Fronteiras entre frontend, banco e publicação    |
| [Modelo de dados](docs/MODELO-DE-DADOS.md)           | Entidades, proveniência e regras de ausência     |
| [Painel de votações](docs/PAINEL-VOTACOES.md)        | Método, formato e limitações do painel           |
| [Operação](docs/OPERACAO.md)                         | Verificações, deploy e recuperação               |
| [Produção](docs/PRODUCAO-NEON.md)                    | Configuração publicada e checklist               |
| [Guia de continuidade](docs/GUIA-DE-CONTINUIDADE.md) | Como assumir o projeto sem perder contexto       |

## Princípios

- Fonte oficial antes de interpretação.
- Data e escopo em toda métrica.
- Ausência de registro não significa resultado zero.
- Toda classificação sensível deve ser revisável.
- Nenhum indicador vira nota geral de valor político.
- Dado demonstrativo é rotulado como demonstrativo.

## Créditos

Projeto independente criado por **Tarliso Doria** ([LinkedIn](https://www.linkedin.com/in/tarlisodoria/)).

Mapa do Brasil no painel de votações: [@svg-maps/brazil](https://github.com/VictorCazanave/svg-maps), de Victor Cazanave, sob CC BY 4.0. Dados de votações: Câmara dos Deputados, API Dados Abertos.

## Licença

Código sob [MIT License](LICENSE). Dados, documentos e marcas de fontes públicas de terceiros seguem as condições de uso de cada fonte.
