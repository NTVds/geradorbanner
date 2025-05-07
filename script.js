const apiKey = '0f89d4bba2a06e4b0e99c6b79d1d58de';

document.getElementById('searchButton').addEventListener('click', async () => {
  const query = document.getElementById('searchInput').value.trim();
  const resultDiv = document.getElementById('searchResult');
  const titleEl = document.getElementById('resultTitle');
  const imageEl = document.getElementById('resultImage');
  const overviewEl = document.getElementById('resultOverview');

  if (!query) {
    alert('Digite um nome para buscar.');
    return;
  }

  try {
    const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=pt-BR&query=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      resultDiv.classList.remove('hidden');
      titleEl.textContent = 'Nada encontrado';
      imageEl.src = '';
      overviewEl.textContent = '';
      return;
    }

    const result = data.results[0];
    const title = result.title || result.name || 'Sem título';
    const overview = result.overview || 'Sem descrição';
    const imagePath = result.backdrop_path || result.poster_path;

    titleEl.textContent = title;
    overviewEl.textContent = overview;
    imageEl.src = imagePath ? `https://image.tmdb.org/t/p/w500${imagePath}` : '';
    imageEl.alt = title;

    resultDiv.classList.remove('hidden');
  } catch (err) {
    alert('Erro na busca. Verifique sua conexão.');
    console.error(err);
  }
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
  const title = document.getElementById('resultTitle').textContent;

  // Fundo
  if (bgFile) {
    const bgURL = URL.createObjectURL(bgFile);
    const bgImage = new Image();
    bgImage.src = bgURL;
    await new Promise(resolve => bgImage.onload = resolve);
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Logo
  if (logoFile) {
    const logoURL = URL.createObjectURL(logoFile);
    const logoImage = new Image();
    logoImage.src = logoURL;
    await new Promise(resolve => logoImage.onload = resolve);
    ctx.drawImage(logoImage, canvas.width - 320, 30, 280, 80);
  }

  // Título
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
