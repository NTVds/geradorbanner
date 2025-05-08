const apiKey = "eb93e716b56767d9b0e6d4fdcf25a511";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const phoneArea = { x: 500, y: 150, width: 210, height: 370 };
const sinopseArea = { x: 40, y: 420, maxWidth: 440 };

document.getElementById("generate").addEventListener("click", async () => {
  const query = document.getElementById("search").value;
  const logoFile = document.getElementById("logo").files[0];
  
  const bg = new Image();
  bg.src = "template.jpg"; // Nome da imagem padrão
  await bg.decode();

  ctx.drawImage(bg, 0, 0);

  if (query) {
    const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=pt-BR&query=${encodeURIComponent(query)}`);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const item = data.results[0];
      const poster = new Image();
      poster.crossOrigin = "anonymous";
      poster.src = "https://image.tmdb.org/t/p/w500" + item.poster_path;
      await poster.decode();
      ctx.drawImage(poster, phoneArea.x, phoneArea.y, phoneArea.width, phoneArea.height);
      ctx.font = "20px Arial";
      ctx.fillStyle = "white";
      wrapText(ctx, item.overview, sinopseArea.x, sinopseArea.y, sinopseArea.maxWidth, 25);
    }
  }

  if (logoFile) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const logo = new Image();
      logo.src = e.target.result;
      await logo.decode();
      ctx.drawImage(logo, 20, 880, 120, 60);

      enableDownload();
    };
    reader.readAsDataURL(logoFile);
  } else {
    enableDownload();
  }
});

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

function enableDownload() {
  const link = document.getElementById("download");
  link.href = canvas.toDataURL("image/jpeg");
  link.style.display = "inline-block";
}
