# Plano mestre — DataDemocracia

## Posicionamento

O DataDemocracia é um arquivo cívico editorial: uma plataforma independente criada por **Tarliso Doria** para organizar dados públicos, documentos oficiais e evidências sobre a política brasileira. Seu compromisso é mostrar o que pode ser verificado, não recomendar voto.

## Estado atual

O MVP navegável está publicado como frontend estático. Home e Explorar consultam o catálogo público no Neon e mantêm fallback demonstrativo. O schema PostgreSQL já possui políticos, promessas, evidências e monitoramento com RLS. As demais telas ainda usam o modelo tipado em `client/src/data/demo.ts` e serão migradas gradualmente.

## Arquitetura aprovada

- React + TypeScript + Vite no frontend;
- Wouter para rotas;
- Tailwind CSS e CSS editorial próprio;
- Neon Data API para leitura pública;
- Neon Auth para o futuro fluxo de conta e monitoramento;
- PostgreSQL com RLS;
- Cloudflare Workers Static Assets para publicação;
- `pnpm build` como build público;
- painéis analíticos estáticos em `client/public/explorar/`, alimentados por scripts de coleta.

## Direção visual

### Escolha: Arquivo Cívico Editorial

**Princípios:** clareza antes de densidade; evidência antes de julgamento; contexto persistente; leitura progressiva.

**Cores:** azul-petróleo profundo `#0F4C5C` para identidade e ação; azul profundo para estabilidade; papel claro para leitura; grafite para precisão; âmbar para atenção. Evitar cores partidárias e usar vermelho apenas quando houver significado factual indispensável.

**Layout:** composição editorial assimétrica controlada, com conteúdo principal e trilho lateral de fonte, período, escopo e limitações em telas amplas; no mobile, blocos empilhados.

**Elementos de assinatura:** linha vertical de trajetória; etiquetas documentais de fonte e data; bloco “o que significa / o que não significa”; ficha de evidências com marcos.

**Tipografia:** títulos com personalidade editorial e interface sans-serif de alta legibilidade; identificadores e referências podem usar estilo monoespacial com parcimônia.

**Voz:** direta, explicativa, serena e não partidária. Exemplos: “Veja o que está documentado.” e “Fonte, data e contexto em cada informação.”

**Marca:** wordmark DataDemocracia com símbolo de camadas conectadas representando fonte, contexto e evidência. Evitar urna, bandeira, estrela ou qualquer símbolo partidário como elemento central.

## Fluxo de produto

1. A pessoa busca um político, tema, cidade ou promessa.
2. A plataforma apresenta a identidade e o recorte temporal.
3. O perfil mostra trajetória, compromissos, atuação e integridade com limites.
4. Cada status abre sua fonte, regra e evidência.
5. A pessoa pode comparar fatos ou acompanhar atualizações.
6. Correções preservam o histórico e não alteram automaticamente o publicado.

## Ordem de implementação

1. Consultas tipadas para catálogo, promessas e evidências.
2. Integração TSE para candidaturas e propostas de governo.
3. Histórico de revisão, correções e exportação.
4. Neon Auth e monitoramento persistente.
5. Câmara e Senado para recorte parlamentar pequeno.
6. Radar analítico com métricas oficiais e tabelas acessíveis.
7. Exploração opcional de convergência em pautas, sem recomendação de voto.

## Regras de produto

- Nenhuma nota geral de “melhor político”.
- Nenhuma acusação sem estado jurídico, fonte e contexto.
- Nenhuma inferência a partir de ausência de registro.
- Nenhum hash, protocolo ou estado “em tempo real” fictício.
- Nenhuma métrica sem período, denominador e explicação.
- Nenhum dado real apresentado como demonstrativo ou o contrário.
- O acesso público à leitura não depende de login ou doação.

## Estrutura de projeto

Consulte `docs/ARQUITETURA.md` para o mapa técnico, `docs/MODELO-DE-DADOS.md` para a proveniência e `docs/OPERACAO.md` para execução e publicação. O backlog executável está em `TODO.md`; o roadmap completo está em `docs/ROADMAP.md`.
