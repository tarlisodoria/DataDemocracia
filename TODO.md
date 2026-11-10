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
- [x] O catálogo no Neon ainda trazia essas fotos e as reexibia no site publicado; agora só são aceitas fotos de domínios oficiais (camara.leg.br, senado.leg.br).
- [x] Endereços inválidos (`/politico/qualquer-coisa`, `/promessa/x`) mostravam outro perfil; agora mostram 404.
- [x] `/politico/:id/atuacao` e `/integridade` abriam o topo do perfil; agora abrem na seção certa.
- [x] Todas as páginas tinham o mesmo título na aba do navegador.
- [x] Zoom bloqueado no celular (`maximum-scale=1`).
- [x] 75 tons de cinza de texto abaixo do contraste mínimo de 4,5:1.
- [x] Seletores sem rótulo, botão de busca sem nome e barras de progresso com ARIA inválido.
- [x] A home dizia "12 fontes conectadas" sem nenhuma fonte conectada; agora mostra os números reais do painel de votações.

### P0 — confiança

- [x] Remover o contador fixo "2" do sino de monitoramento e desativar "Entrar" até existir login (com aviso ao passar o mouse).
- [x] Revisar textos que afirmam funcionalidades inexistentes ("atualizações relevantes" virou aviso de que alertas dependem de contas).
- [x] Remover ou ligar botões sem ação encontrados por varredura automática: Salvar busca, Mais relevantes, Acompanhar tema, Mais filtros, Marcar como lidos, Mais recente; "Como comparar" e "Ver changelog" viraram links; "Compartilhar perfil" copia o link; "Abrir documento" fica desativado em registros demonstrativos.
- [x] Testes de navegação (Playwright) no CI: rotas principais sem erro e sem botões mortos, 404, busca de deputados e painel com filtro na URL.
- [x] Faixa única no topo de todas as telas separando dados demonstrativos de dados oficiais.
- [x] Retratos vazios trocados pelo avatar de iniciais; a comparação passou a usar deputados reais com foto oficial.

### P1 — produto

- [x] Home: bloco "Dados reais" com três achados do painel de votações e links para o recorte de cada um.
- [x] Busca: pesquisar também deputados reais do painel (551) e levar ao painel filtrado.
- [x] Página `/deputado/:id` para os 551 deputados: foto oficial, redes sociais, participação, distribuição dos votos, alinhamento com o partido e últimas votações.
- [ ] Páginas de perfil com título e descrição próprios para compartilhamento (Open Graph).
- [x] Bundle principal acima de 500 kB: rotas e SDK do Neon carregados sob demanda (520 → 344 kB).

### P2 — acabamento

- [x] Alvos de toque: links isolados, rodapé, trilha de navegação e menu do celular com pelo menos 28–40 px.
- [x] Página 404 em português, na identidade do site, com busca e atalhos (mantém o endereço digitado).
- [x] Tela de erro inesperado em português, com os detalhes técnicos recolhidos.
- [x] Promessas marcadas como "demo" no menu.
- [x] Painel de votações: botão de compartilhar o recorte atual (filtros na URL).

## Perfil de deputado — referência da página oficial da Câmara

A página `camara.leg.br/deputados/{id}` já mostra dados brutos do mandato. O DataDemocracia não deve repeti-la: deve trazer o que ela não faz (contexto, comparação, divergências, afinidade e cruzamento com outras fontes).

### Feito

- [x] Resumo em texto do ano, recalculado a cada coleta.
- [x] Voto por tema comparado ao partido e à Câmara.
- [x] Votações em que o deputado contrariou a maioria da sigla.
- [x] Deputados com maior afinidade de voto (mínimo de 100 votações em comum).

### Aproveitar da página oficial (via API de dados abertos)

- [x] Presença em Plenário e em comissões, com a mediana da Câmara ao lado (arquivos de eventos e presença; ver docs/ATUACAO.md).
- [x] Cota parlamentar por mês, por tipo e por fornecedor, comparada à mediana da UF (arquivo anual da CEAP; ver docs/COTA-PARLAMENTAR.md).
- [x] Proposições de autoria com situação de tramitação, separando primeiro autor de coautor.
- [ ] Relatorias em andamento (campo `ultimoStatus.uriRelator` do arquivo de proposições).
- [x] Comissões e cargos no ano (arquivo `orgaosDeputados`).
- [ ] Emendas ao orçamento autorizadas, empenhadas e pagas (Portal da Transparência).

### Diferenciais seguintes

- [x] Comparar dois deputados lado a lado com dados reais, com a taxa de votos iguais entre eles.
- [ ] Histórico eleitoral do TSE: candidaturas, votos recebidos e bens declarados.
- [ ] Mudanças de partido no ano refletidas nos cálculos (hoje vale a sigla do último voto).
- [x] Página `/gastos` com a cota da Câmara inteira: por tipo, por estado, por partido e tabela filtrável.

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
