# Roadmap do DataDemocracia

Este documento é o backlog estratégico do projeto. Cada etapa deve preservar a tese central: **não recomendar voto; organizar o que pode ser verificado**.

## Como priorizar

- **P0 — fundação:** bloqueia confiabilidade, segurança ou publicação.
- **P1 — próximo ciclo:** alto valor público e risco controlável.
- **P2 — evolução:** amplia cobertura e profundidade depois da base estar estável.
- **P3 — experimental:** só entra após metodologia, dados e revisão suficientes.

Cada item deve sair do backlog apenas quando houver código, fonte ou política correspondente, documentação atualizada e evidência de verificação.

## Marco 0 — Fundação pública e portfólio

**Estado: concluído ou em consolidação.**

- [x] Identidade DataDemocracia e direção visual Arquivo Cívico Editorial.
- [x] Home, busca, perfil, promessas, evidências, comparação, radar, monitoramento e metodologia.
- [x] Painel de votações nominais da Câmara (2025) com filtro cruzado, mapa por estado e dados oficiais.
- [x] Build estático para `dist/public` e fallback SPA.
- [x] Publicação no Cloudflare Workers Static Assets.
- [x] Schema inicial do Neon com RLS para leitura pública e monitoramento privado.
- [x] Catálogo público inicial conectado ao Neon.
- [x] Typecheck e build estático aprovados no checkpoint atual.
- [ ] Substituir todo texto demonstrativo de interface por estados claramente rotulados quando o registro vier do banco.
- [ ] Completar créditos de autoria e página institucional de apoio à continuidade do projeto.

## Marco 1 — Catálogo real e camada de acesso aos dados — P0/P1

- [ ] Criar uma camada de consultas tipadas para políticos, promessas e evidências, separada dos componentes de tela.
- [ ] Conectar o perfil do político ao registro do Neon por `slug`, com estados de carregamento, vazio, erro e registro não encontrado.
- [ ] Conectar a lista de promessas à tabela `public.promises` e calcular contagens a partir dos dados retornados, sem duplicar números em fixtures.
- [ ] Conectar a ficha de evidências à tabela `public.promise_evidence`, exibindo fonte, URL, documento, página, tipo, força e datas.
- [ ] Adicionar paginação ou carregamento incremental para catálogos maiores.
- [ ] Implementar filtros de cargo, UF, município, partido, período, situação e disponibilidade de fonte.
- [ ] Criar um adaptador explícito entre o modelo de banco e o modelo editorial da interface.
- [ ] Definir política de cache, timeout, retry e fallback para leitura pública.
- [ ] Criar contratos de dados e testes para registros incompletos, duplicados e desatualizados.

## Marco 2 — Ingestão oficial TSE — P0/P1

- [ ] Criar pipeline versionado para DivulgaCandContas e Propostas de Governo.
- [ ] Baixar documentos originais preservando URL, data de download, nome do arquivo, eleição e cargo.
- [ ] Extrair texto de PDFs sem descartar número da página ou estrutura de seções.
- [ ] Registrar `source_hash` somente quando o hash for realmente calculado e armazenado.
- [ ] Normalizar candidato, partido, cargo, município, UF, eleição e situação eleitoral.
- [ ] Associar cada compromisso ao documento original e à página de origem.
- [ ] Implementar idempotência por fonte, eleição, candidato e identificador externo.
- [ ] Criar fila de revisão para extrações ambíguas, OCR ruim e promessas que misturam objetivos.
- [ ] Publicar a data de última extração e a data de última revisão em cada registro.
- [ ] Documentar limites de licença, uso e disponibilidade de cada fonte.

## Marco 3 — Evidência, revisão e correções — P1

- [ ] Modelar cadeia de evidências com marcos: promessa, ato relacionado, execução identificável e resultado publicado.
- [ ] Permitir evidência parcial sem transformá-la em confirmação de cumprimento.
- [ ] Separar estados `Em andamento`, `Cumprida`, `Prazo crítico`, `Sem evidência suficiente` e `Fora da competência direta` com regras públicas.
- [ ] Criar histórico de versões para promessa, evidência e classificação.
- [ ] Criar protocolo de correção com fonte, trecho, conflito de interesse, autor, data e decisão editorial.
- [ ] Permitir que a contestação preserve a versão anterior e registre a justificativa da decisão.
- [ ] Definir papéis de revisão e trilha de auditoria para alterações sensíveis.
- [ ] Exportar ficha de evidências em JSON e PDF com fontes, regras, datas, limitações e histórico.
- [ ] Criar rotina de verificação de links quebrados e documentos indisponíveis.

## Marco 4 — Câmara dos Deputados e Senado — P1/P2

- [ ] Integrar identificação parlamentar, legislatura, cargo e período.
- [ ] Integrar presença, sessões, votações nominais, proposições, autoria, relatorias e comissões.
- [ ] Integrar despesas e emendas com categoria, período, fornecedor ou órgão quando a fonte oficial permitir.
- [ ] Exibir denominador, universo, período, fonte e o que cada métrica não mede.
- [ ] Tratar ausência, obstrução, sigilo, votação não nominal e dados não disponíveis sem inferência.
- [ ] Adaptar métricas para deputado, senador, prefeito, vereador e candidato sem reutilizar rótulos indevidos.
- [ ] Implementar atualização incremental por período, evitando reprocessar todo o histórico.
- [ ] Criar painel de saúde da ingestão: última execução, registros recebidos, falhas e pendências.

## Marco 5 — Dossiê factual — P1/P2

- [ ] Consolidar candidaturas, resultados, mandatos e mudanças de cargo em linha do tempo.
- [ ] Integrar bens declarados apenas quando houver fonte oficial e contexto temporal.
- [ ] Integrar registros processuais com distinção obrigatória entre investigação, denúncia, decisão, condenação, absolvição e arquivamento.
- [ ] Exibir tribunal, número público, classe, estado processual, data da consulta e link oficial quando disponível.
- [ ] Evitar os rótulos genéricos “ficha limpa”, “escândalo” ou “envolvimento”.
- [ ] Criar bloco permanente “O que este perfil não informa”.
- [ ] Adicionar revisão editorial e jurídica para qualquer conteúdo potencialmente reputacional.

## Marco 6 — Monitoramento e conta — P1

- [ ] Conectar `monitoring_items` à autenticação do Neon Auth.
- [ ] Implementar login, logout, sessão, recuperação e estados de cookie para produção HTTPS.
- [ ] Permitir acompanhar político, promessa, tema, cidade e órgão.
- [ ] Permitir escolher frequência e tipos de atualização.
- [ ] Criar histórico de alertas enviados, falhas e preferências.
- [ ] Garantir RLS por usuário e testes de tentativa de acesso cruzado.
- [ ] Criar exportação e exclusão das preferências pessoais.
- [ ] Manter o produto útil sem login para leitura pública.

## Marco 7 — Radar e análise avançada — P2

- [ ] Trocar o radar demonstrativo por métricas calculadas a partir de tabelas oficiais.
- [ ] Exibir fórmula, denominador, escopo, período, fonte e incerteza para cada dimensão.
- [ ] Criar filtros por legislatura, órgão, cargo, tema e intervalo de datas.
- [ ] Oferecer tabela acessível equivalente ao gráfico.
- [ ] Separar modo de leitura cidadã e análise avançada.
- [ ] Criar comparação entre perfis somente quando período, cargo e universo forem comparáveis.
- [ ] Nunca agregar dimensões em uma nota geral de “melhor político”.

## Marco 8 — Convergência em pautas — P3

- [ ] Só iniciar após base confiável de votações nominais e taxonomia de temas.
- [ ] Permitir que a pessoa escolha pautas e deixe itens sem resposta.
- [ ] Mostrar proposição, fonte, data, quórum, contexto e voto de cada registro.
- [ ] Calcular distância factual com fórmula e denominador visíveis.
- [ ] Excluir votos ausentes do denominador quando a metodologia assim definir.
- [ ] Não recomendar voto, não criar “match” e não publicar ranking de afinidade.
- [ ] Permitir cálculo local, exportação e exclusão do recorte escolhido.

## Marco 9 — Sustentabilidade e comunidade — P2

- [ ] Criar página Apoie com autoria, independência, custos e uso das doações.
- [ ] Integrar doação recorrente ou avulsa sem condicionar acesso aos dados.
- [ ] Criar política de conflito de interesse e transparência financeira.
- [ ] Criar formulário de contribuição externa com critérios mínimos de qualidade.
- [ ] Criar fila pública de correções e estado de cada solicitação.
- [ ] Publicar changelog de dados e produto.
- [ ] Criar página institucional para Tarliso Doria com escopo, contato e créditos.

## Marco 10 — Qualidade, acessibilidade e observabilidade — P0/P1

- [ ] Cobrir rotas críticas com testes de unidade e integração.
- [ ] Validar navegação por teclado, foco visível, landmarks, labels e contraste.
- [ ] Garantir alternativa textual para radar, gráficos e status por cor.
- [ ] Medir performance de carregamento, tamanho do bundle e tempo de primeira renderização.
- [ ] Criar monitoramento de disponibilidade da API pública e do endpoint de publicação.
- [ ] Criar política de logs sem dados pessoais desnecessários.
- [ ] Adicionar CI com `pnpm check`, `pnpm test` e `pnpm build` a cada push.
- [ ] Manter dependências atualizadas e revisar permissões do banco em cada migração.

## Direção de arquitetura

- **Páginas públicas com HTML gerado no build** (Astro com ilhas React) para que perfis sejam indexados por buscadores, mantendo Neon e Cloudflare.
- **Coleta agendada em Python** (GitHub Actions), gravando no Neon e preservando os arquivos originais em armazenamento de objetos.
- **Arquivos Parquet + DuckDB-WASM** para painéis com filtro cruzado sobre volumes maiores que o do painel atual.
- O painel de votações em `client/explorar/` serve de referência visual e de interação para essa migração.

## Ordem recomendada para a próxima execução

1. Camada de consultas tipadas e conexão do perfil ao Neon.
2. Promessas e evidências reais com estados de carregamento e erro.
3. Pipeline TSE para candidaturas e propostas.
4. Histórico de revisão e exportação de ficha.
5. Autenticação e monitoramento persistente.
6. Câmara/Senado para um recorte parlamentar pequeno.
7. Radar com métricas calculadas e tabela acessível.

## Critérios para encerrar um ciclo

Um ciclo só é considerado concluído quando o código, o banco, a documentação e a experiência pública contam a mesma história. Registros sem fonte, números sem denominador, status sem regra ou telas que escondem falhas devem permanecer como pendência, não como acabamento.
