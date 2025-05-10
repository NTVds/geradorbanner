const API_KEY = "eb93e716b56767d9b0e6d4fdcf25a511";
const BASE_URL = "https://api.themoviedb.org/3/search/multi";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const bgImage = new Image();
bgImage.src = "bg.png";
bgImage.onload = () => {
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
};

function buscarTMDB() {
    const query = document.getElementById("tmdbQuery").value;
    if (!query) return alert("Digite algo para buscar.");

    fetch(`${BASE_URL}?query=${encodeURIComponent(query)}&api_key=${API_KEY}&language=pt-BR`)
        .then(res => res.json())
        .then(data => {
            const item = data.results?.[0];
            if (!item || !item.poster_path) return alert("Nada encontrado.");
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = IMAGE_URL + item.poster_path;
            img.onload = () => {
                ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 665, 250, 340, 510); // Ajuste da imagem no celular
            };
        });
}

function baixarImagem() {
    const link = document.createElement("a");
    link.download = "banner.png";
    link.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    link.click();
}
