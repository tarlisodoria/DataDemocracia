# Guia de continuidade

Este documento é o ponto de entrada para quem assumir o DataDemocracia em andamento.

## Primeiro contato

Leia nesta ordem:

1. `README.md` para entender a proposta e os comandos;
2. `docs/ROADMAP.md` para saber o que está pronto e o que vem depois;
3. `docs/ARQUITETURA.md` para localizar cada responsabilidade;
4. `docs/MODELO-DE-DADOS.md` para compreender proveniência e estados;
5. `docs/OPERACAO.md` antes de alterar dados ou publicação;
6. `plan.md` para decisões de design e linguagem;
7. `TODO.md` para o recorte executável atual.

## Estado de partida

O produto tem uma interface navegável com dados demonstrativos e um catálogo inicial no Neon. Home e Explorar já consultam `public.politicians`; as demais telas ainda dependem principalmente de `client/src/data/demo.ts`.

A próxima mudança recomendada é criar consultas tipadas para `politicians`, `promises` e `promise_evidence`, conectando primeiro o perfil e a lista de promessas. Não começar pela ampliação visual: a prioridade é fazer fonte, data e estado atravessarem o caminho inteiro do banco até a tela.

## Regras de decisão

Quando houver dúvida entre uma tela mais chamativa e uma evidência mais verificável, escolher a evidência. Quando um dado não puder ser confirmado, exibir a limitação. Quando duas fontes divergirem, preservar as duas, registrar a divergência e evitar conclusão automática.

O produto é uma plataforma pública, não um portal partidário, um ranking, um fluxo de opinião ou um agregador de notícias. Comparações devem ser factuais e contextualizadas. Nenhuma tela pode sugerir em quem votar.

## Como adicionar uma funcionalidade

1. Descrever o resultado no `docs/ROADMAP.md`.
2. Registrar a decisão de produto e arquitetura em `plan.md` se a mudança for estrutural.
3. Atualizar `TODO.md` com critérios concretos.
4. Definir fonte, entidade, período, regra e limitação antes da interface.
5. Implementar tipos e consultas antes dos componentes visuais.
6. Criar estado de carregamento, vazio, erro e fallback.
7. Atualizar manifesto de rotas se necessário.
8. Executar `pnpm check`, `pnpm test` e `pnpm build:static`.
9. Atualizar documentação de dados e operação.
10. Fazer commit pequeno, com mensagem que descreva o resultado entregue.

## Convenções de código

- TypeScript estrito e nomes de domínio em inglês apenas quando já definidos pelo schema;
- textos de interface em português brasileiro;
- componentes editoriais reutilizáveis em `components/datademocracia`;
- consultas externas em `lib/` ou uma futura camada `services/`;
- nada de regra de banco dentro de página React;
- nenhum dado real em fixture sem fonte verificável;
- nenhum valor de aparência de auditoria sem geração real.

## Critérios de pronto

Uma entrega está pronta quando pode ser compreendida por uma pessoa cidadã, conferida por uma pessoa pesquisadora e mantida por outra pessoa desenvolvedora. Isso significa fonte aberta, estado explícito, limites visíveis, código verificável e documentação sincronizada.

## Autoria

O projeto foi criado por **Tarliso Doria**. Mudanças posteriores devem preservar esse crédito na documentação institucional e na interface pública.
