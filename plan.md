# Plano de implementação — DataDemocracia MVP

## Escopo desta entrega

Construir um protótipo web navegável e visualmente consistente do DataDemocracia, usando dados demonstrativos seguros. A entrega terá home, busca/exploração, perfil de político, trajetória, promessas, atuação, integridade, comparação, monitoramento e metodologia. A integração com fontes oficiais e persistência de dados reais ficam preparadas como próxima etapa, mas não serão simuladas com afirmações reais nesta primeira versão.

## Abordagem de implementação

- React + TypeScript + Wouter para rotas navegáveis.
- Dados demonstrativos locais em módulos TypeScript, com IDs estáveis e campos que refletem o modelo futuro.
- Componentes reutilizáveis para cabeçalho, perfil, evidência, status, linha do tempo, gráficos e tabelas.
- Recharts para visualizações simples e explicáveis.
- Lucide para ícones lineares e consistentes.
- Banco e servidor permanecem habilitados no projeto para a próxima etapa, mas o MVP visual não depende de chamadas externas.
- `public/manus-routes.json` com todas as rotas de página.
- Linguagem em português brasileiro e design responsivo.

## Direção de design

### Alternativas consideradas

1. **Arquivo Cívico Editorial — 0,06:** linha do tempo, divisórias, documentos, evidências e tipografia editorial para transformar dados em contexto.
2. **Painel Institucional Modular — 0,05:** navegação de dados, indicadores e tabelas com foco operacional.
3. **Mapa de Evidências — 0,04:** relações visuais entre pessoa, cargo, promessa, documento e status.

### Escolha: Arquivo Cívico Editorial

**Design Movement:** editorial information design aplicado a civic tech, com sobriedade institucional e ritmo de arquivo documental.

**Princípios:** clareza antes de densidade; evidência antes de julgamento; contexto persistente; leitura progressiva.

**Filosofia de cor:** azul profundo para confiança e estabilidade, papel claro para leitura, grafite para precisão, azul-petróleo para ações e âmbar para atenção. Vermelho não será usado como julgamento moral.

**Paradigma de layout:** composição editorial assimétrica controlada, com coluna principal de conteúdo e trilho lateral de metadados/evidências em desktop; no mobile, o trilho vira blocos empilhados.

**Elementos assinatura:** linha vertical de trajetória com marcadores categorizados; etiquetas de fonte/data embutidas em cada bloco; barra de contexto “o que significa / o que não significa”.

**Interação:** filtros e tabs alteram o recorte sem perder o contexto do político; detalhes aparecem progressivamente; cada número abre sua explicação e fonte.

**Animação:** transições curtas e discretas entre seções, skeletons no carregamento e confirmação sutil ao acompanhar. Sem confetes, pódios ou gamificação.

**Tipografia:** sans-serif legível para interface e números; títulos com peso forte e escala editorial. Evitar estética futurista ou condensada.

**Essência da marca:** histórico verificável do político brasileiro para cidadãos que querem entender antes de julgar. Personalidade: serena, rigorosa, acessível.

**Voz:** direta, explicativa e não partidária. Exemplos: “Veja o que está documentado.” / “Sem achismo: fonte, data e contexto em cada informação.”

**Marca:** wordmark “DataDemocracia” com destaque tipográfico em “Data” e um pequeno símbolo de três camadas/fichas conectadas representando fonte, contexto e evidência; não usar urna, bandeira ou estrela partidária como ícone principal.

**Cor proprietária:** azul-petróleo profundo `#0F4C5C`, usado em ações principais e detalhes de identidade.

## Estrutura de projeto

- `client/src/App.tsx`: rotas e composição global.
- `client/src/pages/`: Home, Search, PoliticianProfile, Promises, PromiseDetail, Compare, Monitoring, Methodology.
- `client/src/components/datademocracia/`: componentes de marca e dados.
- `client/src/data/`: fixtures demonstrativas e tipos futuros.
- `client/src/index.css`: tokens, tipografia, responsividade e componentes visuais.
- `public/manus-routes.json`: manifesto de rotas.
- `server/` e `drizzle/`: infraestrutura preparada para a fase de dados reais; não ampliar nesta entrega salvo necessidade.

## Critérios de aceitação da implementação

- A home explica a proposta e permite iniciar busca.
- A busca apresenta resultados demonstrativos por categoria e filtros.
- O perfil possui overview, cards, trajetória, promessas, atuação e integridade.
- A promessa possui detalhe com fonte, status, competência e evidências.
- A comparação não usa ranking geral nem cores partidárias.
- O monitoramento possui ações reais no protótipo e feedback visual.
- Metodologia exibe fonte, data, cadeia de evidência e limitações.
- Todas as rotas funcionam com navegação interna.
- Desktop e mobile possuem layouts utilizáveis.
- Status são comunicados por texto e não apenas por cor.
- Não há nomes reais associados a acusações ou processos no conteúdo demonstrativo.
- TypeScript e build passam sem erros.
