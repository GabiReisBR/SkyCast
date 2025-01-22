const apiKey = "8c30676c940ed8559e0d2054a63162f9";

// Elementos da interface
const buscarBtn = document.getElementById("buscar");
const localizacaoBtn = document.getElementById("localizacaoBtn");
const infoClima = document.getElementById("infoClima");
const loadingDiv = document.getElementById("loading");
const nomeCidade = document.getElementById("nomeCidade");
const temperatura = document.getElementById("temperatura");
const descricao = document.getElementById("descricao");
const sensacaoTermica = document.getElementById("sensacaoTermica");
const umidade = document.getElementById("umidade");
const vento = document.getElementById("vento");
const nascerPorDoSol = document.getElementById("nascerPorDoSol");
const iconeClima = document.getElementById("iconeClima");
const erroDiv = document.getElementById("erro");

// Mostrar carregamento
function mostrarCarregando() {
  loadingDiv.classList.remove("hidden");
  infoClima.classList.add("hidden");
  erroDiv.classList.add("hidden");
}

// Ocultar carregamento
function ocultarCarregando() {
  loadingDiv.classList.add("hidden");
}

// Funções de busca e exibição
async function buscarClimaPorCidade(cidade) {
  mostrarCarregando();
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&units=metric&lang=pt_br&appid=${apiKey}`
    );
    if (response.ok) {
      const dados = await response.json();
      mostrarClima(dados);
    } else {
      mostrarErro("Cidade não encontrada.");
    }
  } catch (error) {
    mostrarErro("Erro ao buscar dados. Verifique sua conexão.");
  } finally {
    ocultarCarregando();
  }
}

async function buscarClimaPorCoordenadas(lat, lon) {
  mostrarCarregando();
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${apiKey}`
    );
    if (response.ok) {
      const dados = await response.json();
      mostrarClima(dados);
    } else {
      mostrarErro("Não foi possível obter o clima para sua localização.");
    }
  } catch (error) {
    mostrarErro("Erro ao buscar dados por coordenadas.");
  } finally {
    ocultarCarregando();
  }
}

// Exibição de clima
function mostrarClima(dados) {
  nomeCidade.textContent = dados.name;
  temperatura.textContent = `Temperatura: ${dados.main.temp}°C`;
  descricao.textContent = `Condição: ${dados.weather[0].description}`;
  sensacaoTermica.textContent = `Sensação térmica: ${dados.main.feels_like}°C`;
  umidade.textContent = `Umidade: ${dados.main.humidity}%`;
  vento.textContent = `Vento: ${dados.wind.speed} m/s`;

  const nascer = new Date(dados.sys.sunrise * 1000).toLocaleTimeString("pt-BR");
  const por = new Date(dados.sys.sunset * 1000).toLocaleTimeString("pt-BR");
  nascerPorDoSol.textContent = `Nascer do sol: ${nascer} | Pôr do sol: ${por}`;

  const iconCode = dados.weather[0].icon;
  iconeClima.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  iconeClima.alt = dados.weather[0].description;

  infoClima.classList.remove("hidden");
}

// Exibição de erros
function mostrarErro(mensagem) {
  erroDiv.textContent = mensagem;
  erroDiv.classList.remove("hidden");
}

// Eventos
buscarBtn.addEventListener("click", () => {
  const cidade = document.getElementById("cidade").value.trim();
  if (cidade) buscarClimaPorCidade(cidade);
});

localizacaoBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (posicao) => {
        const { latitude, longitude } = posicao.coords;
        buscarClimaPorCoordenadas(latitude, longitude);
      },
      () => mostrarErro("Erro ao obter localização.")
    );
  } else {
    mostrarErro("Seu navegador não suporta geolocalização.");
  }
});
