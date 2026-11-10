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

Cada um dos 551 deputados tem uma página própria em `/deputado/:id`, com foto oficial, redes sociais, distribuição dos votos, participação comparada à média da Câmara e alinhamento com a maioria do partido. A busca do site leva a essas páginas.

O que a página oficial da Câmara não mostra e o DataDemocracia calcula:

- **Contexto:** participação comparada à média da Câmara e voto por tema comparado ao partido e à Câmara.
- **Divergências:** a lista de votações em que o deputado votou contra a maioria da própria sigla.
- **Afinidade de voto:** quem mais votou igual a ele, inclusive de outros partidos.
- **Resumo em texto** que se recalcula com os dados de cada coleta.
- **Atuação com contexto:** presença em sessões e reuniões, comissões e cargos e projetos como primeiro autor, sempre com a mediana da Câmara ao lado.
- **Cota parlamentar com contexto:** gastos por mês, por tipo e maiores fornecedores, com a média mensal comparada à mediana dos deputados do mesmo estado.

A página [`/gastos`](client/src/pages/Gastos.tsx) mostra a cota parlamentar da Câmara inteira: gastos por tipo, mediana mensal por estado e por partido e uma tabela filtrável deputado a deputado.

Detalhes de método e formato dos dados em [docs/PAINEL-VOTACOES.md](docs/PAINEL-VOTACOES.md).

## Estado atual

- Home com a última votação do Plenário, temas mais votados e deputados reais em destaque.
- Busca entre os 551 deputados com filtros por estado e partido.
- Comparação lado a lado de dois deputados, com a taxa de votos iguais entre eles.
- Monitoramento de deputados acompanhados, salvo no navegador.
- Perfis com visão geral, trajetória, promessas, atuação e integridade.
- Cadeia visual de evidências e ficha exportável.
- Radar analítico com dimensões independentes e explicações.
- Painel de votações nominais da Câmara com dados oficiais de 2025.
- Catálogo público no Neon (3 perfis e 9 promessas **demonstrativos**), com fallback local se a API não responder.

Deputados, votações, comparação e monitoramento usam dados oficiais. Promessas, dossiês, radares e os perfis em `/politico/*` ainda são demonstrativos e estão rotulados assim na interface.

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
pnpm e2e          # Playwright: navegação, 404, busca e painel
pnpm build        # gera dist/public
pnpm deploy       # build + wrangler deploy
pnpm dados:votacoes 2025   # recoleta os dados do painel na API da Câmara
pnpm dados:cota 2025       # resume a cota parlamentar do ano
pnpm dados:atuacao 2025    # presença, comissões e proposições do ano
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
  coletar-cota-camara.mjs      resumo da cota parlamentar por deputado
  coletar-atuacao-camara.mjs   presença, comissões e proposições por deputado
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
| [Cota parlamentar](docs/COTA-PARLAMENTAR.md)         | Fonte, formato e decisões do resumo de gastos    |
| [Atuação](docs/ATUACAO.md)                           | Presença, comissões e proposições                |
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

Mapa do Brasil no painel de votações: [@svg-maps/brazil](https://github.com/VictorCazanave/svg-maps), de Victor Cazanave, sob CC BY 4.0. Dados de votações e da cota parlamentar: Câmara dos Deputados, API Dados Abertos e arquivos anuais da CEAP.

## Licença

Código sob [MIT License](LICENSE). Dados, documentos e marcas de fontes públicas de terceiros seguem as condições de uso de cada fonte.
