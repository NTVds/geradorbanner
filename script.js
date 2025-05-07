const apiKey = 'b3e3c53866b55e2949cf3b40c6470a96'; // TMDB Key

let dadosSelecionados = null;

async function buscar() {
  const query = document.getElementById("search").value;
  const res = await fetch(`https://corsproxy.io/?https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=pt-BR&query=${encodeURIComponent(query)}`);
  const data = await res.json();

  const select = document.getElementById("resultado");
  select.innerHTML = "";

  data.results.forEach((item, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.text = item.title || item.name;
    select.appendChild(option);
  });

  dadosSelecionados = data.results;
}

function gerarBanner() {
  const index = document.getElementById("resultado").value;
  const item = dadosSelecionados[index];
  const orientacao = document.getElementById("orientacao").value;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = orientacao === "vertical" ? 1080 : 1920;
  canvas.height = orientacao === "vertical" ? 1920 : 1080;

  const fundoInput = document.getElementById("fundo").files[0];
  const logoInput = document.getElementById("logo").files[0];

  const fundoURL = fundoInput ? URL.createObjectURL(fundoInput) : "";
  const logoURL = logoInput ? URL.createObjectURL(logoInput) : "";

  const imgFundo = new Image();
  imgFundo.src = fundoURL;
  imgFundo.onload = () => {
    ctx.drawImage(imgFundo, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.fillText(item.title || item.name, 50, canvas.height - 100);

    ctx.font = "30px Arial";
    ctx.fillText(item.overview || "Sinopse indisponível", 50, canvas.height - 50);

    if (logoURL) {
      const logo = new Image();
      logo.src = logoURL;
      logo.onload = () => {
        ctx.drawImage(logo, canvas.width - 200, 50, 150, 50);
        document.getElementById("banner").innerHTML = "";
        document.getElementById("banner").appendChild(canvas);
      };
    } else {
      document.getElementById("banner").innerHTML = "";
      document.getElementById("banner").appendChild(canvas);
    }
  };
}

function baixarBanner() {
  const canvas = document.querySelector("canvas");
  const link = document.createElement("a");
  link.download = "banner.png";
  link.href = canvas.toDataURL();
  link.click();
}
