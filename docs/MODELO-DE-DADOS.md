# Modelo de dados e proveniência

## Entidades

### `politicians`

Representa uma pessoa política ou candidatura catalogada.

Campos centrais:

- `id`: identificador interno UUID;
- `slug`: identificador estável para URLs;
- `name`, `role`, `party`, `state`, `city`, `period`: identidade pública contextualizada;
- `portrait_url`: imagem, quando houver uso permitido;
- `source_url`, `source_name`, `source_updated_at`: origem e recência do registro;
- `created_at`, `updated_at`: controle técnico.

A identidade do registro não deve ser deduzida somente pelo nome. O pipeline futuro precisa combinar eleição, cargo, UF, município, número eleitoral ou identificador oficial quando disponível.

### `promises`

Representa um compromisso identificado em um documento de campanha.

Campos centrais:

- `politician_id`: vínculo com a pessoa ou candidatura;
- `external_id`: identificador estável da fonte, quando disponível;
- `title`, `theme`: texto normalizado e tema editorial;
- `status`, `progress`, `deadline`, `competence`, `trajectory`: classificação explicada;
- `source_url`, `source_page`, `source_hash`: rastreabilidade do documento;
- `last_reviewed_at`: data da última revisão.

`progress` não é prova de cumprimento. É um campo de leitura auxiliar e só deve ser usado quando houver regra publicada e evidência suficiente para sustentar a interpretação.

### `promise_evidence`

Representa um documento, ato, publicação ou registro relacionado a uma promessa.

Campos centrais:

- `source_name`, `source_url`: fonte consultada;
- `document_title`, `document_page`: localização no material original;
- `evidence_type`: natureza do registro;
- `description`: descrição factual, sem acusação ou conclusão não sustentada;
- `strength`: força da evidência;
- `observed_at`, `extracted_at`, `reviewed_at`: linha temporal;
- `protocol`: referência pública, quando existir de verdade.

### `monitoring_items`

Representa a preferência privada de acompanhamento de uma pessoa usuária.

`entity_type` pode ser `politician`, `promise`, `theme`, `city` ou `agency`. O registro deve sempre estar vinculado ao usuário autenticado pela função `auth.user_id()` e protegido por RLS.

## Estados editoriais

Os estados atuais foram escolhidos para evitar certezas indevidas:

- **Em andamento:** há sinais documentados de execução, mas não de conclusão;
- **Cumprida:** a regra e a evidência permitem afirmar que o compromisso foi atendido no escopo declarado;
- **Prazo crítico:** o prazo se aproxima ou foi ultrapassado sem evidência proporcional;
- **Sem evidência suficiente:** a busca não encontrou material suficiente para classificar;
- **Fora da competência direta:** o cargo ou órgão não tem competência direta para executar sozinho o compromisso.

Esses estados não são equivalentes a uma avaliação moral da pessoa. Toda tela deve preservar essa distinção.

## Cadeia de proveniência

O fluxo recomendado é:

```text
Fonte oficial
  → documento/API preservado
  → extração com data e identificador
  → normalização
  → revisão de qualidade
  → classificação por regra
  → publicação com fonte e limitações
  → correção versionada
```

Não criar hashes, protocolos ou selos de auditoria como decoração. Esses valores só devem aparecer quando forem produzidos pelo pipeline e puderem ser conferidos.

## Política de ausência

- Ausência de documento não significa que o fato não aconteceu.
- Ausência de voto nominal não significa oposição.
- Ausência de evidência não significa descumprimento.
- Ausência de processo na fonte consultada não significa inexistência de processo.
- Registro público desatualizado deve exibir a data, não ser apresentado como retrato atual.

## Próximas extensões

O schema deverá evoluir para incluir histórico de versões, fontes, documentos preservados, execução de ingestão, correções, métricas parlamentares, candidaturas e estados processuais. Cada extensão deve vir acompanhada de:

1. migração reversível ou documentada;
2. política RLS;
3. índices e restrições;
4. exemplos de consulta;
5. atualização do adaptador de frontend;
6. regra editorial e fonte oficial correspondente.
