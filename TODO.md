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

## Revisão completa do site — novembro de 2026

Navegação por todas as rotas em desktop (1440 px) e celular (390 px), com verificação automática de acessibilidade (axe, WCAG 2.1 AA).

### Corrigido nesta revisão

- [x] Perfis demonstrativos usavam fotos de banco de imagens de pessoas reais; agora usam iniciais.
- [x] Endereços inválidos (`/politico/qualquer-coisa`, `/promessa/x`) mostravam outro perfil; agora mostram 404.
- [x] `/politico/:id/atuacao` e `/integridade` abriam o topo do perfil; agora abrem na seção certa.
- [x] Todas as páginas tinham o mesmo título na aba do navegador.
- [x] Zoom bloqueado no celular (`maximum-scale=1`).
- [x] 75 tons de cinza de texto abaixo do contraste mínimo de 4,5:1.
- [x] Seletores sem rótulo, botão de busca sem nome e barras de progresso com ARIA inválido.
- [x] A home dizia "12 fontes conectadas" sem nenhuma fonte conectada; agora mostra os números reais do painel de votações.

### P0 — confiança

- [x] Remover o contador fixo "2" do sino de monitoramento e desativar "Entrar" até existir login (com aviso ao passar o mouse).
- [ ] Revisar textos que afirmam funcionalidades inexistentes ("rastreabilidade por registro", "atualizações relevantes").
- [ ] Mostrar a faixa "dados demonstrativos" de forma consistente no topo de perfis, promessas, dossiê e radar.
- [ ] Trocar o retrato vazio do radar e da comparação pelo mesmo avatar de iniciais.

### P1 — produto

- [x] Home: bloco "Dados reais" com três achados do painel de votações e links para o recorte de cada um.
- [x] Busca: pesquisar também deputados reais do painel (551) e levar ao painel filtrado.
- [ ] Perfil: para deputados do painel, mostrar votos reais (participação, distribuição por tipo) com link para o painel.
- [ ] Páginas de perfil com título e descrição próprios para compartilhamento (Open Graph).
- [x] Bundle principal acima de 500 kB: rotas e SDK do Neon carregados sob demanda (520 → 344 kB).

### P2 — acabamento

- [ ] Alvos de toque menores que 32 px em chips e links de rodapé (média de 10 por página).
- [ ] Página 404 com busca e links úteis em vez de só voltar ao início.
- [x] Painel de votações: botão de compartilhar o recorte atual (filtros na URL).

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
