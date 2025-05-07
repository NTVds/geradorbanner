const apiKey = '0f89d4bba2a06e4b0e99c6b79d1d58de';

document.getElementById('searchButton').addEventListener('click', async () => {
  const query = document.getElementById('searchInput').value.trim();
  if (!query) return;

  const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=pt-BR`);
  const data = await res.json();

  const first = data.results[0];
  const resultDiv = document.getElementById('searchResult');

  if (!first) {
    resultDiv.innerHTML = '<p>Nenhum resultado encontrado.</p>';
    resultDiv.classList.remove('hidden');
    return;
  }

  const title = first.title || first.name;
  const overview = first.overview || 'Sem descrição disponível.';
  const imageUrl = first.backdrop_path || first.poster_path;

  resultDiv.innerHTML = `
    <h2>${title}</h2>
    <img src="https://image.tmdb.org/t/p/w500${imageUrl}" alt="${title}">
    <p>${overview}</p>
  `;
  resultDiv.classList.remove('hidden');
});

document.getElementById('generateButton').addEventListener('click', async () => {
  const orientation = document.getElementById('orientation').value;
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = orientation === 'horizontal' ? 1920 : 1080;
  canvas.height = orientation === 'horizontal' ? 1080 : 1920;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const bgFile = document.getElementById('bgInput').files[0];
  const logoFile = document.getElementById('logoInput').files[0];
  const title = document.getElementById('searchInput').value;

  if (bgFile) {
    const bgURL = URL.createObjectURL(bgFile);
    const bgImage = new Image();
    bgImage.src = bgURL;
    await new Promise(res => bgImage.onload = res);
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  }

  if (logoFile) {
    const logoURL = URL.createObjectURL(logoFile);
    const logoImage = new Image();
    logoImage.src = logoURL;
    await new Promise(res => logoImage.onload = res);
    ctx.drawImage(logoImage, canvas.width - 300, 30, 250, 80);
  }

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 60px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, canvas.width / 2, canvas.height - 60);

  canvas.classList.remove('hidden');
  document.getElementById('downloadButton').classList.remove('hidden');
});

document.getElementById('downloadButton').addEventListener('click', () => {
  const canvas = document.getElementById('canvas');
  const link = document.createElement('a');
  link.download = 'banner.png';
  link.href = canvas.toDataURL();
  link.click();
});
