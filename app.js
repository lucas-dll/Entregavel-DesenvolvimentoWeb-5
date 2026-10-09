const pedidos = [
  { cliente: "Bia", valor: 120, status: "pago" },
  { cliente: "Ana", valor: 80.5, status: "pago" },
  { cliente: "Lucas", valor: 60, status: "pendente" },
  { cliente: "   ", valor: 40, status: "pago" },
  { cliente: "Pedro", valor: -10, status: "pago" },
  { cliente: "Julia", valor: "50", status: "pago" },
  { cliente: "Carlos", valor: 0, status: "pago" }
];

const pedidosValidos = pedidos.filter(pedido =>
  typeof pedido.cliente === "string" &&
  pedido.cliente.trim() !== "" &&
  Number.isFinite(pedido.valor) &&
  pedido.valor > 0
);

const pedidosPagos = pedidosValidos.filter(pedido => pedido.status === "pago");
const totalFaturado = pedidosPagos.reduce((total, pedido) => total + pedido.valor, 0);
const textosPedidos = pedidosPagos.map(pedido =>
  `${pedido.cliente.trim()} — R$ ${pedido.valor.toFixed(2)}`
);

const listaPedidos = document.querySelector("#lista-pedidos");
textosPedidos.forEach(texto => {
  const item = document.createElement("li");
  item.textContent = texto;
  listaPedidos.append(item);
});
document.querySelector("#total-pedidos").textContent = `Total faturado: R$ ${totalFaturado.toFixed(2)}`;

const formCep = document.querySelector("#form-cep");
const campoCep = document.querySelector("#cep");
const botaoCep = document.querySelector("#botao-cep");
const statusCep = document.querySelector("#status-cep");
const resultadoCep = document.querySelector("#resultado-cep");
const listaHistorico = document.querySelector("#historico-cep");
const historico = [];

function mostrarEndereco(endereco) {
  resultadoCep.replaceChildren();
  const campos = [
    { titulo: "Rua", valor: endereco.logradouro },
    { titulo: "Bairro", valor: endereco.bairro },
    { titulo: "Cidade", valor: endereco.localidade },
    { titulo: "UF", valor: endereco.uf }
  ];

  campos.forEach(campo => {
    const titulo = document.createElement("dt");
    const valor = document.createElement("dd");
    titulo.textContent = campo.titulo;
    valor.textContent = campo.valor || "Não informado";
    resultadoCep.append(titulo, valor);
  });
}

function atualizarHistorico() {
  listaHistorico.replaceChildren();
  document.querySelector("#historico-vazio").hidden = historico.length > 0;
  historico.forEach(endereco => {
    const item = document.createElement("li");
    item.textContent = `${endereco.cep} — ${endereco.cidade}/${endereco.uf}`;
    listaHistorico.append(item);
  });
}

formCep.addEventListener("submit", async e => {
  e.preventDefault();
  if (botaoCep.disabled) return;

  const entrada = campoCep.value.trim();
  const cep = entrada.replace(/^(\d{5})-(\d{3})$/, "$1$2");
  resultadoCep.replaceChildren();

  if (!/^\d{8}$/.test(cep)) {
    statusCep.textContent = "Informe um CEP com exatamente 8 números.";
    return;
  }

  statusCep.textContent = "Buscando...";
  botaoCep.disabled = true;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      signal: AbortSignal.timeout(5000)
    });
    if (!response.ok) throw new Error("Falha na consulta do CEP");

    const endereco = await response.json();
    if (endereco.erro) {
      statusCep.textContent = "CEP não encontrado";
      return;
    }

    mostrarEndereco(endereco);
    historico.push({ cep: endereco.cep, cidade: endereco.localidade, uf: endereco.uf });
    atualizarHistorico();
    statusCep.textContent = "";
  } catch (erro) {
    statusCep.textContent = erro.name === "TimeoutError"
      ? "O tempo de espera terminou. Tente novamente."
      : "Falha na conexão. Verifique sua internet e tente novamente.";
  } finally {
    botaoCep.disabled = false;
  }
});

const formPokemon = document.querySelector("#form-pokemon");
const campoPokemon = document.querySelector("#pokemon");
const botaoPokemon = document.querySelector("#botao-pokemon");
const statusPokemon = document.querySelector("#status-pokemon");
const resultadoPokemon = document.querySelector("#resultado-pokemon");

function mostrarPokemon(pokemon) {
  resultadoPokemon.replaceChildren();
  const nome = document.createElement("h3");
  nome.textContent = pokemon.name;
  resultadoPokemon.append(nome);

  if (pokemon.sprites.front_default) {
    const imagem = document.createElement("img");
    imagem.src = pokemon.sprites.front_default;
    imagem.alt = `Imagem de ${pokemon.name}`;
    resultadoPokemon.append(imagem);
  } else {
    const aviso = document.createElement("p");
    aviso.textContent = "Imagem não disponível.";
    resultadoPokemon.append(aviso);
  }

  const tipos = document.createElement("p");
  tipos.textContent = `Tipos: ${pokemon.types.map(item => item.type.name).join(", ")}`;
  resultadoPokemon.append(tipos);
}

formPokemon.addEventListener("submit", async e => {
  e.preventDefault();
  if (botaoPokemon.disabled) return;

  const nome = campoPokemon.value.trim().toLowerCase();
  resultadoPokemon.replaceChildren();
  if (nome === "") {
    statusPokemon.textContent = "Informe o nome de um Pokémon.";
    return;
  }

  statusPokemon.textContent = "Buscando...";
  botaoPokemon.disabled = true;

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(nome)}`, {
      signal: AbortSignal.timeout(5000)
    });
    if (response.status === 404) {
      statusPokemon.textContent = "Pokémon não encontrado";
      return;
    }
    if (!response.ok) throw new Error("Falha na consulta do Pokémon");

    const pokemon = await response.json();
    mostrarPokemon(pokemon);
    statusPokemon.textContent = "";
  } catch (erro) {
    statusPokemon.textContent = erro.name === "TimeoutError"
      ? "O tempo de espera terminou. Tente novamente."
      : "Falha na conexão. Verifique sua internet e tente novamente.";
  } finally {
    botaoPokemon.disabled = false;
  }
});
