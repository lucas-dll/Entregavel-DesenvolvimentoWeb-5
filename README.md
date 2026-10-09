# Desenvolvimento Web — Semana 05

Atividade sobre objetos, arrays, manipulação do DOM e consumo de APIs com JavaScript.

## Como executar

Abra o arquivo `index.html` em um navegador atualizado. Não é necessário instalar dependências. As consultas às APIs precisam de conexão com a internet.

## Funcionalidades

- Validação dos pedidos, filtro dos pagamentos e cálculo do total com `reduce`.
- Consulta de endereço pelo ViaCEP, com validação de oito dígitos e hífen opcional.
- Histórico das consultas de CEP bem-sucedidas em um array de objetos. O histórico é apagado ao recarregar a página.
- Busca de Pokémon por nome, exibindo imagem e tipos.
- Estados de carregamento, erro, não encontrado e sucesso nas duas buscas.
- Limite de cinco segundos para as requisições com `AbortSignal.timeout(5000)`.

O array `pedidos` contém exemplos válidos e inválidos. Apenas Bia e Ana entram no faturamento, totalizando R$ 200.50. Os resultados são criados com `createElement` e `textContent`, sem inserir dados externos com `innerHTML`.

## Por que `Promise.all` pode ser mais rápido que vários `await` seguidos?

Quando fazemos `await fetch(...)` e só depois chamamos outro `fetch`, a segunda requisição começa quando a primeira termina. O tempo total acaba sendo aproximadamente a soma dos tempos de cada consulta.

Com `Promise.all([fetch(url1), fetch(url2)])`, as duas chamadas a `fetch` iniciam as requisições sem esperar uma pela outra. O `Promise.all` aguarda as duas, permitindo aproveitar o tempo de rede. Se uma levar dois segundos e outra três, juntas podem terminar em cerca de três segundos, em vez de cinco.

Quem inicia as requisições são as chamadas a `fetch`, não o próprio `Promise.all`. Isso é útil quando as consultas são independentes. Se uma depende do resultado da outra, a espera sequencial é necessária. Se qualquer uma das promises rejeitar, o `Promise.all` também rejeita; isso não cancela automaticamente as outras requisições.

## APIs utilizadas

- [ViaCEP](https://viacep.com.br/)
- [PokéAPI](https://pokeapi.co/docs/v2)
