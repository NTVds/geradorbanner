const apiKey = 'eb93e716b56767d9b0e6d4fdcf25a511';

async function buscarConteudo() {
  const query = document.getElementById('searchInput').value;
  if (!query) return alert("Digite um nome.");

  const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${query}&language=pt-BR`);
  const data = await response.json();

  if (data.results.length === 0) {
    alert("Nenhum conteúdo encontrado.");
    return;
  }

  const item = data.results[0];
  const title = item.title || item.name || "Sem título";
  const overview = item.overview || "Sem sinopse.";
  const year = (item.release_date || item.first_air_date || "0000").split('-')[0];
  const imageUrl = `https://image.tmdb.org/t/p/original${item.backdrop_path || item.poster_path}`;

  const logoInput = document.getElementById('logoInput');
  const logoFile = logoInput.files[0];

  generateBanner(title, overview, year, imageUrl, logoFile);
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && i > 0) {
      lines.push(line.trim());
      line = words[i] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());
  return lines.slice(0, 4);
}

function generateBanner(title, overview, year, imageUrl, logoFile) {
  const canvas = document.getElementById('bannerCanvas');
  const ctx = canvas.getContext('2d');

  const background = new Image();
  background.crossOrigin = "anonymous";
  background.src = imageUrl;

  background.onload = () => {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    if (logoFile) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const logo = new Image();
        logo.src = e.target.result;
        logo.onload = () => {
          const logoSize = 200;
          ctx.drawImage(logo, canvas.width - logoSize - 30, 30, logoSize, logoSize);
          desenharTexto();
        };
      };
      reader.readAsDataURL(logoFile);
    } else {
      desenharTexto();
    }

    function desenharTexto() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, canvas.height - 300, canvas.width, 300);

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 40px sans-serif';
      ctx.fillText(title, 30, canvas.height - 240);

      ctx.font = '30px sans-serif';
      ctx.fillText(year, 30, canvas.height - 200);

      ctx.font = '24px sans-serif';
      const lines = wrapText(ctx, overview, canvas.width - 60);
      lines.forEach((line, i) => {
        ctx.fillText(line, 30, canvas.height - 160 + i * 28);
      });

      const link = document.getElementById('downloadLink');
      link.href = canvas.toDataURL('image/png');
      link.style.display = 'inline-block';
    }
  };
}
