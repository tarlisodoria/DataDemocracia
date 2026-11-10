# Atuação dos deputados

Presença, comissões e proposições de cada deputado no ano, mostradas na seção "Atuação" de `/deputado/:id`.

## Fontes

Arquivos em massa de `https://dadosabertos.camara.leg.br/arquivos/`, um download por arquivo, sem chamadas por deputado:

| Arquivo                                                             | Uso                                       |
| ------------------------------------------------------------------- | ----------------------------------------- |
| `eventos/json/eventos-{ano}.json`                                   | Tipo e situação de cada evento            |
| `eventosPresencaDeputados/json/eventosPresencaDeputados-{ano}.json` | Quem esteve presente em cada evento       |
| `orgaosDeputados/json/orgaosDeputados-L{legislatura}.json`          | Comissões, cargos e períodos              |
| `proposicoesAutores/json/proposicoesAutores-{ano}.json`             | Autores e ordem de assinatura             |
| `proposicoes/json/proposicoes-{ano}.json`                           | Tipo, número, ementa e situação (~160 MB) |

```bash
pnpm dados:atuacao 2025
```

O script `scripts/coletar-atuacao-camara.mjs` baixa os arquivos um por vez, guarda só os campos usados e roda no workflow mensal com mais memória (`--max-old-space-size=6144`).

## Formato de `client/public/explorar/dados/atuacao-{ano}.json`

| Campo         | Conteúdo                                                                     |
| ------------- | ---------------------------------------------------------------------------- |
| `sessoes`     | Sessões deliberativas do Plenário encerradas e com presença registrada       |
| `orgaos`      | Nome de publicação de cada órgão, por sigla                                  |
| `deps[id].p`  | Sessões deliberativas com presença                                           |
| `deps[id].c`  | Reuniões de comissão, audiências e outros eventos fora do Plenário           |
| `deps[id].o`  | Órgãos do ano: `[sigla, cargo]`, um por sigla, com o cargo mais alto         |
| `deps[id].a`  | Proposições apresentadas no ano, por tipo (PL, PLP, PEC, PDL, REQ, RIC, INC) |
| `deps[id].l1` | Projetos (PL, PLP, PEC, PDL) como primeiro autor                             |
| `deps[id].ex` | Até três projetos: `[id, rótulo, ementa, situação, data, primeiro autor]`    |

## Decisões

- **Proposições pela data de apresentação.** O arquivo do ano inclui proposições antigas que tramitaram nele (e o campo `ano` vem preenchido com o ano do arquivo), então o filtro usa `dataApresentacao`.
- **Só tipos comparáveis.** Pareceres (PRL), emendas (EMC) e requerimentos de pauta (RPD) dependem do cargo: um vice-presidente da Mesa assinou mais de 8 mil pareceres em 2025. Contar esses tipos transformaria cargo em "produtividade".
- **Primeiro autor separado de coautor.** Projetos coletivos podem ter dezenas de signatários.
- **Medianas, não médias,** e calculadas entre os deputados com voto registrado no ano.

## Limitações

- Presença em reunião de comissão depende das comissões de que o deputado participa; o número serve de contexto, não de comparação direta.
- O cargo mostrado é o mais alto no ano, mesmo que tenha durado poucos meses.
- A situação da proposição é a da data da coleta.
