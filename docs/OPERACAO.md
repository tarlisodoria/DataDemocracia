# Manual de operação

## Preparação

```bash
pnpm install
cp .env.example .env.local
```

Preencha apenas valores públicos de frontend no ambiente local. A connection string do PostgreSQL é usada apenas em operações administrativas controladas e nunca deve ser commitada.

## Rotina antes de alterar código

1. Leia `README.md`, `docs/ROADMAP.md` e a documentação específica da área.
2. Verifique `git status` e preserve alterações existentes.
3. Confirme as rotas em `client/src/App.tsx` e os links para os painéis em `client/explorar/`.
4. Entenda se a tela usa Neon, fallback demonstrativo ou ambos.
5. Faça a alteração no menor conjunto de arquivos possível.

## Verificações locais

```bash
pnpm check
pnpm test
pnpm build
```

`pnpm check` é obrigatório para TypeScript. `pnpm build` é a verificação mais próxima da publicação do Cloudflare. Se o bundle mudar de tamanho significativamente, registrar o motivo no changelog do ciclo.

## Dados do Neon

O schema de referência está em `neon/schema.sql`. Consultas públicas podem ser verificadas pelo cliente instalado, usando `allowAnonymous: true` e as variáveis públicas do Neon.

Antes de inserir ou atualizar dados:

- confirmar fonte e data;
- garantir identificador estável;
- preservar o documento original;
- evitar duplicação por fonte e período;
- marcar conteúdo demonstrativo de forma explícita;
- não preencher ausência com zero;
- conferir políticas RLS depois de qualquer mudança.

O banco compartilhado contém desenvolvimento e produção. Nunca usar comandos destrutivos para testar uma tela.

## Publicação

O build estático usa:

```bash
pnpm build
npx wrangler deploy
```

O `wrangler.jsonc` publica `dist/public` com fallback SPA. Depois da publicação, verificar:

- home em HTTP 200;
- `/buscar` em HTTP 200;
- uma rota dinâmica de político;
- `/explorar/votacoes-2025.html` carregando os gráficos e os dois arquivos de `/explorar/dados/`;
- leitura do catálogo público;
- ausência de placeholder ou conteúdo genérico.

## Recuperação

Se o build falhar:

1. reproduzir com `pnpm check` e `pnpm build`;
2. conferir o arquivo que introduziu a regressão;
3. verificar variáveis públicas e caminho `dist/public`;
4. corrigir e repetir as verificações;
5. não publicar uma versão parcialmente validada.

Se a API do Neon falhar, a interface deve conservar o fallback demonstrativo e informar o estado da fonte sem mascarar a falha. Não inserir dados alternativos como se fossem oficiais.

Se houver conflito de Git, interromper a sequência, integrar o branch principal preservando as duas alterações e repetir as verificações afetadas. Nunca forçar o branch principal.

## Migrações

Toda mudança de banco deve ser aplicada nesta ordem:

1. editar `neon/schema.sql` ou a migração correspondente;
2. revisar constraints, índices, grants e RLS;
3. testar em branch temporário quando possível;
4. aplicar na produção somente após conferir o SQL;
5. atualizar `docs/MODELO-DE-DADOS.md`;
6. atualizar tipos, consultas e fixtures;
7. executar as verificações do frontend.

## Checklist de revisão

- [ ] A tela deixa claro se o dado é oficial, demonstrativo ou indisponível.
- [ ] Toda métrica possui fonte, período e escopo.
- [ ] Nenhum status depende apenas de cor.
- [ ] O texto não recomenda voto nem cria ranking geral.
- [ ] Processos e acusações usam estado jurídico preciso.
- [ ] Links e documentos podem ser conferidos.
- [ ] O mobile continua navegável.
- [ ] O manifesto de rotas acompanha o código.
- [ ] README e roadmap continuam verdadeiros.
