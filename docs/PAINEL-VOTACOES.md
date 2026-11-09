# Painel de votações da Câmara

Página própria em `client/explorar/votacoes-2025.html`, publicada em `/explorar/votacoes-2025.html`. É uma segunda entrada do build do Vite, fora do roteador React: carrega só o necessário (os módulos do ECharts que usa e dois arquivos JSON em `client/public/explorar/dados/`) e pode ser compartilhada isoladamente. Nenhum recurso vem de CDN externo.

## Fonte e coleta

- Fonte: [API Dados Abertos da Câmara](https://dadosabertos.camara.leg.br/swagger/api.html) v2.
- Escopo: votações do Plenário (`idOrgao=180`) de 01/01 a 31/12/2025.
- Script: `pnpm dados:votacoes 2025` (`scripts/coletar-votacoes-camara.mjs`).
- Agendamento: o workflow `dados-votacoes.yml` roda a coleta no dia 1 de cada mês (ou manualmente, escolhendo o ano) e faz commit se o arquivo mudar.

O script lista as votações por trimestre (limite de intervalo da API), busca os votos de cada uma, o detalhe da votação e os temas da proposição principal. São cerca de 2 mil chamadas, com 6 requisições simultâneas e nova tentativa em erro 429/5xx.

Uma votação é considerada **nominal** quando tem mais de 50 votos registrados. Abaixo disso, a votação foi simbólica ou registra só o voto do presidente da sessão.

## Formato de `dados/votacoes-plenario-2025.json`

O arquivo é compacto para carregar rápido (cerca de 350 KB, 70 KB com gzip):

| Campo    | Conteúdo                                                                                                                           |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `deps`   | `[id, nome, partido, uf]` por deputado, em ordem alfabética                                                                        |
| `vot`    | `[id, data, o que foi votado, proposição, idProposição, [índices de tema]]` por votação, em ordem cronológica                      |
| `temas`  | nomes dos temas (classificação da Câmara)                                                                                          |
| `v`      | uma string por votação, um caractere por deputado: `S` sim, `N` não, `A` abstenção, `O` obstrução, `R` artigo 17, `.` sem registro |
| `coleta` | data da coleta                                                                                                                     |

O cadastro dos deputados fica em `dados/deputados-2025.json`: para cada id, nome civil, foto oficial, e-mail do gabinete e redes sociais (`/deputados/{id}` da API). As páginas `/deputado/:id` funcionam sem esse arquivo, só sem foto e redes.

O mapa usa `dados/brasil-uf.json`, com os contornos dos estados de [@svg-maps/brazil](https://github.com/VictorCazanave/svg-maps) (CC BY 4.0).

## Regras de cálculo

- **% de um tipo de voto** = votos daquele tipo ÷ votos registrados (Sim + Não + Abstenção + Obstrução/Art. 17) no recorte.
- **Sem registro** = deputado que votou em ao menos uma votação do ano e não aparece na lista desta votação. Inclui falta, licença, missão oficial, presidência da sessão e suplente fora de exercício. Não é sinônimo de ausência.
- **Partido e UF** = sigla registrada no último voto do deputado no ano. Trocas de partido durante o ano não estão separadas.
- **Títulos dinâmicos** só comparam estados e partidos com pelo menos 300 votos registrados no recorte, e células do mapa de calor com menos de 30 votos não são calculadas.
- Obstrução e Artigo 17 aparecem somadas.

## Interação

Toda seleção vira filtro global: estado, região, cor da legenda, parte de barra, fatia, célula, linha das tabelas e busca por deputado. Um clique substitui a seleção, Ctrl/Shift soma, clicar de novo desmarca. Cada visual ignora o próprio filtro para mostrar as alternativas esmaecidas, como no realce cruzado de ferramentas de BI.

## Limitações conhecidas

- Os dados são uma coleta pontual; a data aparece no topo da página.
- "Sem registro" usa como universo quem votou no ano, não os mandatos em exercício em cada data.
- "Sim" pode significar aprovar ou rejeitar algo, conforme o objeto da votação (requerimento, destaque, emenda).
- O tema vem só da proposição principal afetada pela votação.

## Próximos passos

- Guardar o arquivo original de cada resposta da API (camada bronze).
- Calcular "sem registro" com base nos mandatos em exercício em cada data.
- Incluir a orientação de bancada para mostrar aderência à orientação do partido.
- Repetir o painel para o Senado.
