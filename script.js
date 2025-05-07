const tmdbKey = "eb93e716b56767d9b0e6d4fdcf25a511";
let selectedData = null;
let logoImage = null;
let bgImage = null;

document.getElementById('logoUpload').addEventListener('change', function (e) {
  const reader = new FileReader();
  reader.onload = () => logoImage = reader.result;
  reader.readAsDataURL(e.target.files[0]);
});

document.getElementById('bgUpload').addEventListener('change', function (e) {
  const reader = new FileReader();
  reader.onload = () => bgImage = reader.result;
  reader.readAsDataURL(e.target.files[0]);
});

function buscarTMDB() {
  const query = document.getElementById('tmdbQuery').value;
  fetch(`https://api.themoviedb.org/3/search/multi?api_key=${tmdbKey}&language=pt-BR&query=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      const result = data.results[0];
      if (!result) return alert("Nenhum resultado encontrado.");
      selectedData = result;
      desenharBanner();
    });
}

function desenharBanner() {
  const canvas = document.getElementById('bannerCanvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 1080, 1080);

  const posterUrl = `https://image.tmdb.org/t/p/w500${selectedData.poster_path}`;
  const title = selectedData.name || selectedData.title || 'Sem título';
  const overview = selectedData.overview || 'Sinopse indisponível';
  const tipo = selectedData.media_type === "tv" ? "SÉRIE DISPONÍVEL" : "FILME DISPONÍVEL";

  const posterImg = new Image();
  posterImg.crossOrigin = "anonymous";
  posterImg.src = posterUrl;

  posterImg.onload = () => {
    const bg = new Image();
    bg.src = bgImage || "https://i.imgur.com/j0rC7pv.jpg";

    bg.onload = () => {
      ctx.drawImage(bg, 0, 0, 1080, 1080);
      ctx.drawImage(posterImg, 80, 250, 350, 525);

      if (logoImage) {
        const logo = new Image();
        logo.src = logoImage;
        logo.onload = () => ctx.drawImage(logo, 60, 60, 250, 80);
      }

      ctx.fillStyle = "white";
      ctx.font = "bold 48px Arial";
      ctx.fillText(tipo, 470, 300);

      ctx.font = "24px Arial";
      wrapText(ctx, overview, 470, 360, 540, 32);

      ctx.font = "bold 36px Arial";
      ctx.fillText("ASSINE JÁ!", 400, 1000);

      document.getElementById("downloadBtn").style.display = "inline-block";
    };
  };
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

function baixarBanner() {
  const canvas = document.getElementById('bannerCanvas');
  const link = document.createElement('a');
  link.download = 'banner.png';
  link.href = canvas.toDataURL();
  link.click();
}
