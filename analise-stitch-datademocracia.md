# Análise do material do Stitch — DataDemocracia

## Síntese executiva

O pacote do Stitch não deve ser incorporado como um bloco único. Ele mistura protótipos de interface, conceitos de produto e algumas ideias de alto risco metodológico. A melhor estratégia é preservar o MVP atual como camada pública simples e confiável, absorvendo do Stitch os padrões visuais e criando uma segunda camada de análise avançada para cidadãos interessados, imprensa, pesquisadores e organizações de controle.

O Stitch oferece quatro contribuições especialmente fortes: uma identidade visual mais definida para “arquivo cívico e evidência”; um perfil político em formato de dossiê factual; um rastreio forense de promessas com cadeia de custódia; e um radar analítico que cruza presença, produção legislativa, despesas, votação e temas. A calculadora de convergência cívica é promissora, mas deve ser tratada como ferramenta opcional de exploração de pautas, nunca como “match” eleitoral ou recomendação de voto.

## O que já está coberto pelo MVP atual

O MVP já possui home editorial, busca, perfil, promessas, detalhe de evidência, comparação factual, monitoramento, metodologia, trajetória e integridade. Ele também já adota vários princípios do Stitch: fonte e data, ausência de ranking geral, separação entre processo e condenação, visual sem cores partidárias, cartões documentais, baixa dependência de sombras e linguagem não eleitoral.

Por isso, não vale substituir o MVP pelo HTML exportado do Stitch. O código do Stitch é prototípico, usa layout e componentes próprios, repete estruturas em várias telas e não está conectado às rotas, tipos, estado e serviços do projeto WebDev. O valor está nas ideias, no desenho e nos padrões de interface, não em copiar os arquivos HTML literalmente.

## Melhorias visuais aproveitáveis imediatamente

### 1. Tipografia em três camadas

O Stitch define `Newsreader` para manchetes investigativas e citações, `Inter` para interface e dados e `Courier Prime` para identificadores, hashes e números de processo. Essa separação é excelente para a proposta do DataDemocracia. O MVP atual já usa uma serifada de sistema em alguns títulos; a próxima evolução deve adotar explicitamente essa hierarquia, preservando a legibilidade e evitando carregar a fonte monoespacial para textos comuns.

### 2. Azul republicano e superfícies azuladas

O sistema visual do Stitch usa azul profundo `#0F2A4A`, azul secundário `#2B6CB0`, superfícies muito claras azuladas e status em azul, verde, âmbar e vermelho factual. Isso dá ao produto uma aparência mais institucional e “forense” que a paleta atual, mais verde-petróleo. A recomendação não é apagar o azul-petróleo proprietário do DataDemocracia, mas usá-lo na marca e adotar o azul republicano do Stitch em headers de auditoria, documentos e análises avançadas.

### 3. Selos documentais retangulares

Os chips do Stitch não parecem tags de rede social: são pequenos selos com ponto factual, estado e borda discreta. Esse padrão deve ser absorvido em todos os estados do MVP, sobretudo em promessas, evidências, fontes, situação processual e estado de revisão.

### 4. Metadados no topo e proveniência no rodapé

As telas do Stitch reservam o topo dos cartões para categoria do órgão, data de extração, identificador e versão. O rodapé traz fontes auditáveis e link direto para o documento original. Esse padrão é mais forte que um simples “Fonte: TSE” e deve virar um componente global `ProvenancePanel` no próximo ciclo.

### 5. Identificador, versão e auditoria

A barra superior do Stitch apresenta versão do sistema, estado dos dados e filtros globais. A ideia pode virar uma “faixa de confiabilidade” discreta, contendo `última atualização`, `fontes consultadas`, `versão do registro` e `estado da ingestão`. Não devemos mostrar hash ou integridade criptográfica enquanto o sistema não gerar e armazenar esses valores de verdade.

## Ideias de produto que merecem entrar no roadmap

### A. Rastreio forense de promessas

A tela “Rastreio Forense de Promessas & Evidências” é a contribuição mais alinhada ao núcleo do produto. Ela organiza cada compromisso em uma cadeia de marcos, por exemplo:

1. texto registrado no documento eleitoral;
2. proposição, programa ou ato relacionado;
3. dotação, empenho ou execução identificável;
4. publicação final, entrega, decisão ou evidência de ausência.

Cada marco deve ter data, órgão, documento, página/endpoint, hash ou identificador real quando disponível e classificação de força da evidência. O modelo deve permitir divergência temporal: uma promessa pode ter uma ação relacionada, mas ainda não ter evidência de entrega.

Esse módulo deve substituir a ideia simplista de “cumpriu / não cumpriu” por estados como `evidência forte de avanço`, `evidência parcial`, `sem convergência encontrada`, `fora da competência direta`, `prazo não definido` e `aguardando revisão`.

### B. Certidão ou ficha de auditoria

O Stitch propõe uma “Certidão Forense Cívica” e um formulário de contestação. Isso pode ser adaptado para uma função pública chamada `Exportar ficha de evidências`, que gera um PDF/JSON com:

- ID do registro;
- texto original da promessa;
- fontes consultadas;
- documentos e páginas;
- datas de ingestão e revisão;
- status e regra aplicada;
- limitações;
- histórico de correções.

A exportação só deve ser chamada de certidão se houver uma política institucional clara. No MVP, “ficha de evidências” é um nome mais seguro.

### C. Radar analítico ou Mesa de Decisão Cívica

As telas “Radar Analítico” e “Mesa Analítica” apresentam um módulo de segundo nível muito interessante. Ele cruza:

- presença e assiduidade;
- produção legislativa direta;
- relatorias e comissões;
- despesas e cota parlamentar;
- aderência a pautas ou blocos de votação;
- cobertura de promessas por tema;
- resolutividade setorial.

Esse módulo não deve ser a home. Ele deve ser acessado por “Análise avançada” e possuir filtros por cargo, legislatura, período, órgão e denominador. Cada métrica precisa declarar o que mede, o que não mede, fonte e fórmula.

### D. Dossiê factual do político

A tela “Dossiê do político — Raio-X” sugere uma evolução natural do perfil atual. Além do overview, o dossiê pode reunir abas ou seções para:

- identificação eleitoral e candidaturas;
- patrimônio declarado, quando oficialmente disponível;
- histórico de mandatos;
- presença e sessões;
- despesas por categoria;
- cartografia de votos;
- dissidências e alinhamentos;
- registros processuais com estado jurídico preciso;
- limites de escopo.

A seção “O que este perfil não informa” do Stitch é especialmente valiosa e deve ser incorporada: não medir “qualidade ética”, não inferir articulação de bastidores e não tratar votos secretos não catalogados como ausência de atuação.

### E. Calculadora de Convergência Cívica

A calculadora propõe que o usuário escolha pautas e compare suas posições com votos nominais de parlamentares. A ideia pode ser válida se for renomeada para evitar o padrão de “site de namoro político”. A versão recomendada é `Explorar convergência em pautas`.

Regras obrigatórias:

- o usuário escolhe pautas e pode deixar qualquer uma sem resposta;
- cada voto parlamentar tem fonte, data, proposição, quórum e contexto;
- o cálculo mostra a fórmula e o denominador;
- posições sem voto nominal não entram como discordância;
- o resultado é uma distância factual, não recomendação de voto;
- não há “melhor candidato” nem ranking global;
- o cálculo pode ocorrer no navegador, sem enviar preferências pessoais;
- o usuário pode exportar o próprio laudo e apagar o recorte.

## O que deve ser evitado ou reescrito

### 1. “Índice de inércia institucional”

É uma expressão forte e editorialmente atraente, mas pode sugerir julgamento político. Só deve existir se houver fórmula pública, denominador, validação e linguagem de indicador, nunca como acusação de omissão.

### 2. “Grafo de afinidade real” e “qual parlamentar votou mais próximo de você?”

Essas frases podem ser interpretadas como recomendação eleitoral e aproximam o produto de um match político. O conceito deve ser reescrito para “distância de votação nas pautas selecionadas” e sempre apresentar divergências, votos ausentes e incertezas.

### 3. “Tempo real”

O Stitch usa “terminal de provas em tempo real”. Isso só deve ser usado depois de existir uma ingestão com SLA e timestamp real. Enquanto o pipeline for periódico, usar `última atualização`, `última extração` ou `última revisão`.

### 4. Hashes, protocolos e carimbos fictícios

Hashes, IDs de protocolo e “integridade criptográfica” só agregam confiança quando são gerados pelo sistema e verificáveis. Não devem aparecer apenas como decoração visual.

### 5. Densidade excessiva como padrão público

As telas avançadas são excelentes para usuários especialistas, mas densas demais para a home e para o primeiro contato. O produto deve ter dois modos: leitura cidadã, com explicação progressiva; e análise avançada, com tabelas, gráficos, filtros e identificadores.

### 6. Dados processuais e patrimônio

O Stitch sugere mostrar patrimônio, tribunais e registros jurídicos em profundidade. Isso é possível apenas com identificação correta, fonte oficial, atualização, estado processual e revisão jurídica/editorial. Nunca apresentar “ficha limpa”, “envolvimento” ou “escândalo” como selo genérico.

## Componentes novos recomendados

1. `ProvenancePanel`: órgão, fonte original, data de extração, data de revisão, licença e link.
2. `AuditStamp`: ID, versão e estado de auditoria, sem hash fictício.
3. `EvidenceChain`: linha de marcos documentais para promessas.
4. `CivicMetricCard`: métrica com denominador, período, escopo e “o que não mede”.
5. `AdvancedFilterBar`: cargo, legislatura, período, órgão, tema e fonte.
6. `LimitationsBox`: o que o indicador não informa.
7. `CorrectionProtocol`: formulário e histórico de contestação.
8. `AnalystModeToggle`: alternância entre leitura cidadã e análise avançada.
9. `CivicConvergenceExplorer`: ferramenta opcional de distância de votação, sem recomendação.
10. `EvidenceExport`: exportação de ficha auditável.

## Priorização recomendada

### Próxima entrega: alto valor e baixo risco

Incorporar Newsreader/Inter/Courier Prime, a faixa de proveniência, selos documentais, IDs de registro, limites de escopo e um componente de cadeia de evidências. Também vale evoluir o detalhe de promessa para quatro marcos documentais e adicionar “força da evidência”.

### Segunda entrega: alto valor e complexidade média

Criar o Dossiê factual do político e a ficha exportável de evidências. Conectar primeiro TSE, Câmara e Senado para um recorte parlamentar pequeno, com atualização e fontes reais.

### Terceira entrega: alto valor e complexidade alta

Criar o Radar Analítico/Mesa de Decisão com filtros e denominadores explícitos. Começar com presença, proposições, relatorias, despesas e votações, sem produzir uma nota agregada de “melhor político”.

### Quarta entrega: opcional e sensível

Construir a Calculadora de Convergência Cívica como exploração de pautas. Só liberar depois de existir uma base sólida de votações nominais, taxonomia de temas, tratamento para abstenções e ausências e texto jurídico/metodológico claro.

## Conclusão

O Stitch não invalida o MVP; ele mostra a próxima camada de maturidade do DataDemocracia. A melhor leitura é: manter o produto público simples, humano e confiável; adicionar uma camada de auditoria documental; e, por trás dela, uma mesa analítica para quem precisa investigar profundamente.

A direção mais forte para a marca é continuar dizendo: **“Não diga ao cidadão em quem votar. Mostre o que pode ser verificado.”** O Stitch reforça essa tese quando usa fontes, marcos, períodos, fórmulas, limitações e exportação de evidências. Ele se afasta dela quando transforma distância de voto em afinidade, usa rótulos acusatórios sem metodologia ou simula hashes e tempo real sem infraestrutura correspondente.
