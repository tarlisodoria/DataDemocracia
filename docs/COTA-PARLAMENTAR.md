# Cota parlamentar

Resumo dos gastos de cada deputado com a Cota para o Exercício da Atividade Parlamentar (CEAP), mostrado na página `/deputado/:id`.

## Fonte

Arquivo anual da Câmara dos Deputados: `https://www.camara.leg.br/cotas/Ano-{ano}.csv.zip` (cerca de 7 MB compactado, 200 mil lançamentos em 2025). Um único download substitui milhares de chamadas ao endpoint `/deputados/{id}/despesas`, que além disso devolvia listas vazias para 2025 durante o desenvolvimento.

## Coleta

```bash
pnpm dados:cota 2025
```

O script `scripts/coletar-cota-camara.mjs` não usa dependências: lê o zip com `zlib` do Node (o tamanho vem do diretório central, porque o arquivo usa _data descriptor_) e interpreta o CSV separado por `;`. Roda no mesmo workflow mensal das votações (`.github/workflows/dados-votacoes.yml`), antes delas e sem bloqueá-las.

## Formato de `client/public/explorar/dados/cota-{ano}.json`

| Campo        | Conteúdo                                                  |
| ------------ | --------------------------------------------------------- |
| `tipos`      | Descrições dos tipos de despesa, na ordem em que aparecem |
| `deps[id].t` | Total líquido no ano (R$)                                 |
| `deps[id].n` | Número de lançamentos                                     |
| `deps[id].m` | Total por mês, janeiro a dezembro                         |
| `deps[id].k` | Total por índice de `tipos`                               |
| `deps[id].f` | Cinco maiores fornecedores: `[nome, cnpj, valor]`         |

`id` é o `ideCadastro`, o mesmo identificador de deputado da API de dados abertos.

## Decisões

- **Valor líquido** (`vlrLiquido`): já desconta glosas. Estornos de passagens aparecem como valores negativos e reduzem o total, como no portal da Câmara.
- **Lideranças e Mesa** não têm `ideCadastro` e ficam de fora.
- **CPF não é publicado.** O arquivo da Câmara traz o CPF do deputado e o documento de fornecedores pessoa física; o resumo guarda só CNPJ de 14 dígitos.
- **Comparação por estado e por mês com gasto.** O teto da cota varia por UF (por causa das passagens), então a referência é a mediana dos deputados da mesma UF. Como suplentes e quem assumiu no meio do ano têm menos meses, compara-se a média por mês com gasto, não o total do ano.

## Limitações

- Mês com gasto é uma aproximação do tempo de mandato: um mês sem lançamento pode ser exercício sem uso da cota.
- A UF usada é a do último voto do deputado em 2025 (arquivo de votações).
- O arquivo da Câmara é atualizado continuamente; notas de dezembro podem chegar meses depois.
