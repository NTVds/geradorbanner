document.getElementById('bannerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const mediaType = document.getElementById('mediaType').value;
    const searchQuery = document.getElementById('search').value;
    const apiKey = 'eb93e716b56767d9b0e6d4fdcf25a511'; // Sua chave de API TMDB
    
    // Faz a busca na API do TMDB
    const response = await fetch(`https://api.themoviedb.org/3/search/${mediaType}?query=${searchQuery}&api_key=${apiKey}`);
    const data = await response.json();
    
    if (data.results.length === 0) {
        alert('Nenhum conteúdo encontrado.');
        return;
    }
    
    const content = data.results[0]; // Pegando o primeiro resultado
    const contentImage = `https://image.tmdb.org/t/p/w500${content.poster_path}`;
    const contentTitle = content.title || content.name;
    const contentYear = content.release_date ? content.release_date.split('-')[0] : 'N/A';
    
    const contentElement = document.getElementById('contentResults');
    contentElement.innerHTML = `
        <h2>${contentTitle} (${contentYear})</h2>
        <img src="${contentImage}" alt="${contentTitle}">
        <p>${content.overview}</p>
    `;
    
    document.getElementById('logoUpload').style.display = 'block'; // Mostrar opção de logo
    
    // Quando a logomarca for carregada
    document.getElementById('logo').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const logoUrl = URL.createObjectURL(file);
            generateBanner(contentImage, logoUrl, contentTitle, contentYear);
        }
    });
});

// Função para gerar o banner
function generateBanner(contentImage, logoUrl, contentTitle, contentYear) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = contentImage;
    
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height + 100; // Adiciona espaço para a logo e título
        
        ctx.drawImage(img, 0, 0);
        
        // Carregar a logomarca
        const logo = new Image();
        logo.src = logoUrl;
        logo.onload = () => {
            ctx.drawImage(logo, 20, 20, 150, 50); // Coloca a logo no banner (ajustar conforme necessário)
            
            // Adicionar o título
            ctx.font = '30px Arial';
            ctx.fillStyle = 'white';
            ctx.fillText(contentTitle, 20, img.height + 60);
            
            // Salvar o banner gerado
            const dataUrl = canvas.toDataURL();
            const generatedBanner = document.getElementById('generatedBanner');
            generatedBanner.innerHTML = `<img src="${dataUrl}" alt="Banner Gerado">`;
            document.getElementById('downloadBtn').style.display = 'block';
            document.getElementById('downloadBtn').addEventListener('click', () => {
                const a = document.createElement('a');
                a.href = dataUrl;
                a.download = `${contentTitle}_banner.png`;
                a.click();
            });
        };
    };
}
