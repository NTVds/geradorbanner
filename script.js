const TMDB_API_KEY = "eb93e716b56767d9b0e6d4fdcf25a511";
let selectedData = null;
let logoImage = null;
let bgImage = null;
let posterAngle = 0;

document.getElementById("logoInput").addEventListener("change", loadLogo);
document.getElementById("bgInput").addEventListener("change", loadBg);

const orientationSelect = document.getElementById("posterOrientation");
const angleRange = document.getElementById("angleRange");
const angleValue = document.getElementById("angleValue");
const angleControl = document.getElementById("angleControl");

orientationSelect.addEventListener("change", () => {
  const type = orientationSelect.value;
  if (type === "custom") {
    angleControl.style.display = "block";
  } else {
    angleControl.style.display = "none";
    posterAngle = type === "vertical" ? 0 : 90;
    renderBanner();
  }
});

angleRange.addEventListener("input", (e) => {
  posterAngle = parseInt(e.target.value);
  angleValue.textContent = `${posterAngle}°`;
  renderBanner();
});

function loadLogo(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    logoImage = new Image();
    logoImage.onload = renderBanner;
    logoImage.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function loadBg(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    bgImage = new Image();
    bgImage.onload = renderBanner;
    bgImage.src = reader.result;
  };
  reader.readAsDataURL(file);
}

async function searchTMDB() {
  const query = document.getElementById("searchInput").value;
  const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&language=pt-BR&query=${query}`);
  const data = await response.json();

  const select = document.getElementById("resultsSelect");
  select.innerHTML = "";
  data.results.forEach(item => {
    const option = document.createElement("option");
    option.textContent = item.title || item.name;
    option.value = JSON.stringify(item);
    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    selectedData = JSON.parse(select.value);
    renderBanner();
  });
}

function renderBanner() {
  const canvas = document.getElementById("bannerCanvas");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (bgImage) ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  else {
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  if (!selectedData) return;

  const posterPath = selectedData.poster_path;
  const title = selectedData.title || selectedData.name;
  const overview = selectedData.overview || "Sem sinopse.";

  const poster = new Image();
  poster.crossOrigin = "anonymous";
  poster.onload = () => {
    ctx.save();
    ctx.translate(400, 540);
    ctx.rotate((posterAngle * Math.PI) / 180);

    if (Math.abs(posterAngle) === 90) {
      ctx.drawImage(poster, -300, -200, 600, 400); // horizontal
    } else {
      ctx.drawImage(poster, -200, -300, 400, 600); // vertical
    }
    ctx.restore();

    ctx.fillStyle = "white";
    ctx.font = "bold 36px Arial";
    ctx.fillText(title, 50, 1000);

    ctx.font = "24px Arial";
    wrapText(ctx, overview, 500, 300, 500, 28);

    if (logoImage) {
      ctx.drawImage(logoImage, 800, 900, 200, 100);
    }

    const downloadBtn = document.getElementById("downloadBtn");
    downloadBtn.href = canvas.toDataURL("image/png");
    downloadBtn.style.display = "inline-block";
  };

  poster.src = `https://image.tmdb.org/t/p/w780${posterPath}`;
}

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
