# DataDemocracia — backlog executável

Este arquivo é o recorte operacional do [roadmap completo](docs/ROADMAP.md). Itens concluídos permanecem registrados para preservar contexto; novos ciclos devem atualizar critérios e evidências.

## Concluído — fundação do MVP

- [x] Interface editorial cívica com paleta não partidária, navegação responsiva e componentes de evidência.
- [x] Home com proposta, busca, método em três passos e destaques de políticos.
- [x] Explorar com busca textual e filtros de cargo, estado e situação.
- [x] Perfil com overview, trajetória, promessas, atuação, integridade e limites.
- [x] Lista e detalhe de promessas com status, competência, prazo e cadeia de evidências.
- [x] Comparação factual sem nota geral ou ranking.
- [x] Radar analítico demonstrativo com dimensões independentes, fontes e alternativa textual.
- [x] Monitoramento demonstrativo com feedback visual.
- [x] Metodologia com fontes, camadas de leitura, correções e independência.
- [x] Painel de votações nominais da Câmara em 2025 com filtro cruzado e dados oficiais.
- [x] Projeto reduzido a frontend estático, sem servidor de aplicação.
- [x] Schema Neon com RLS para tabelas públicas e itens privados de monitoramento.
- [x] Home e Explorar conectados ao catálogo público do Neon, com fallback demonstrativo.
- [x] Build estático, typecheck e publicação em Cloudflare Workers Static Assets.

## Próximo ciclo — dados públicos conectados

### Catálogo e perfil

- [ ] Criar camada de consultas tipadas para políticos, promessas e evidências.
- [ ] Conectar o perfil do político ao Neon por `slug`.
- [ ] Implementar estados de carregamento, vazio, erro e registro não encontrado.
- [ ] Exibir fonte, data de atualização e estado do registro vindo do banco.

### Promessas e evidências

- [ ] Conectar `Promises.tsx` a `public.promises`.
- [ ] Calcular contagens e filtros a partir dos dados retornados.
- [ ] Conectar `PromiseDetail.tsx` a `public.promise_evidence`.
- [ ] Implementar histórico de revisão e exportação de ficha baseada em registros reais.

### TSE

- [ ] Definir pipeline para DivulgaCandContas e Propostas de Governo.
- [ ] Preservar PDFs, páginas, URLs, datas e identificadores externos.
- [ ] Extrair propostas com revisão de ambiguidade e idempotência.
- [ ] Documentar licença, cobertura e limitações de cada origem.

## Ciclo seguinte — confiança e acompanhamento

- [ ] Criar histórico de versões e protocolo de correções.
- [ ] Criar fila de revisão para contribuições externas.
- [ ] Integrar Neon Auth ao fluxo de monitoramento.
- [ ] Persistir políticos, promessas, temas, cidades e órgãos acompanhados.
- [ ] Implementar preferências de frequência e tipos de atualização.
- [ ] Cobrir RLS com testes de isolamento por usuário.

## Evolução analítica

- [ ] Integrar Câmara dos Deputados e Senado para recorte parlamentar pequeno.
- [ ] Calcular presença, votações, proposições, relatorias, comissões e despesas com denominadores.
- [ ] Substituir o radar demonstrativo por dados oficiais revisados.
- [ ] Criar modo de análise avançada sem prejudicar a leitura cidadã.
- [ ] Adicionar tabelas acessíveis equivalentes aos gráficos.
- [ ] Avaliar exploração de convergência em pautas somente após base de votações confiável.

## Institucional e sustentabilidade

- [ ] Criar página Sobre/Apoie com autoria de Tarliso Doria, independência e transparência financeira.
- [ ] Integrar doações sem restringir o acesso público.
- [ ] Publicar changelog de produto e dados.
- [ ] Criar política de conflito de interesse.

## Qualidade contínua

- [ ] Manter `pnpm check`, `pnpm test` e `pnpm build` aprovados.
- [ ] Testar teclado, foco, contraste e alternativas textuais.
- [ ] Verificar rotas, fallback SPA e páginas de `/explorar` após mudanças.
- [ ] Monitorar disponibilidade do Neon e do deploy.
- [ ] Atualizar README, roadmap, modelo de dados e operação a cada mudança estrutural.
