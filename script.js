let logoUrlTemp = '';
let contentImageTemp = '';
let contentTitleTemp = '';
let contentYearTemp = '';

document.getElementById('bannerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const mediaType = document.getElementById('mediaType').value;
  const searchQuery = document.getElementById('search').value;
  const apiKey = 'eb93e716b56767d9b0e6d4fdcf25a511';

  const response = await fetch(`https://api.themoviedb.org/3/search/${mediaType}?query=${encodeURIComponent(searchQuery)}&api_key=${apiKey}&language=pt-BR`);
  const data = await response.json();

  if (!data.results.length) {
    alert('Nenhum conteúdo encontrado.');
    return;
  }

  const content = data.results[0];
  contentImageTemp = `https://image.tmdb.org/t/p/w780${content.poster_path}`;
  contentTitleTemp = content.title || content.name;
  contentYearTemp = (content.release_date || content.first_air_date || '').split('-')[0] || 'Ano desconhecido';
  const contentOverview = content.overview || 'Sem descrição.';

  const contentElement = document.getElementById('contentResults');
  contentElement.innerHTML = `
    <h2>${contentTitleTemp} (${contentYearTemp})</h2>
    <img src="${contentImageTemp}" alt="${contentTitleTemp}" class="content-img">
    <p>${contentOverview}</p>
  `;

  document.getElementById('logoUpload').style.display = 'block';
  document.getElementById('downloadLink').style.display = 'none';
});

document.getElementById('logo').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file && contentImageTemp) {
    logoUrlTemp = URL.createObjectURL(file);
    generateBanner(contentImageTemp, logoUrlTemp, contentTitleTemp, contentYearTemp);
  }
});

function generateBanner(bgImageUrl, logoUrl, title, year) {
  const canvas = document.getElementById('bannerCanvas');
  const ctx = canvas.getContext('2d');

  const background = new Image();
  const logo = new Image();

  background.crossOrigin = "anonymous";
  logo.crossOrigin = "anonymous";

  background.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    logo.onload = () => {
      const logoSize = 200;
      ctx.drawImage(logo, 30, 30, logoSize, logoSize);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, canvas.height - 150, canvas.width, 150);

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 40px sans-serif';
      ctx.fillText(title, 30, canvas.height - 80);

      ctx.font = '30px sans-serif';
      ctx.fillText(year, 30, canvas.height - 40);

      const link = document.getElementById('downloadLink');
      link.href = canvas.toDataURL('image/png');
      link.style.display = 'inline-block';
    };

    logo.src = logoUrl;
  };

  background.src = bgImageUrl;
}
