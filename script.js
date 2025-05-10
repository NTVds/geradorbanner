const API_KEY = "eb93e716b56767d9b0e6d4fdcf25a511";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const baseImage = new Image();
baseImage.src = "assets/background.jpg";

let posterImg = null;
let sinopse = "";
let logomarca = null;

document.getElementById("logoInput").addEventListener("change", e => {
  const reader = new FileReader();
  reader.onload = () => {
    logomarca = new Image();
    logomarca.src = reader.result;
  };
  reader.readAsDataURL(e.target.files[0]);
});

async function gerarBanner() {
  const query = document.getElementById("search").value.trim();
  if (!query) return;

  const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=pt-BR`);
  const data = await res.json();
  const item = data.results[0];

  if (!item) {
    alert("Conteúdo não encontrado!");
    return;
  }

  const posterUrl = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
  posterImg = new Image();
  posterImg.crossOrigin = "anonymous";
  posterImg.src = posterUrl;
  sinopse = item.overview;

  posterImg.onload = desenharBanner;
}

function desenharBanner() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

  ctx.drawImage(posterImg, 430, 270, 220, 330);

  ctx.font = "bold 20px Arial";
  ctx.fillStyle = "white";
  wrapText(ctx, sinopse, 50, 350, 320, 24);

  if (logomarca) {
    ctx.drawImage(logomarca, 20, 880, 80, 80);
  }
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}

function baixarImagem() {
  const link = document.createElement("a");
  link.download = "banner.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}
