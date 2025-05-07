function buscar() {
  const termo = document.getElementById('search').value;
  const select = document.getElementById('conteudo-select');
  select.innerHTML = `<option>${termo}</option>`;
}

function gerarBanner() {
  const logoInput = document.getElementById('logo').files[0];
  const fundoInput = document.getElementById('fundo').files[0];
  const orientacao = document.getElementById('orientacao').value;
  const select = document.getElementById('conteudo-select');
  const titulo = select.options[select.selectedIndex].text;

  if (!fundoInput || !logoInput || !titulo) {
    alert("Selecione fundo, logo e conteúdo.");
    return;
  }

  const readerFundo = new FileReader();
  const readerLogo = new FileReader();

  readerFundo.onload = () => {
    readerLogo.onload = () => {
      const fundoImg = new Image();
      const logoImg = new Image();

      fundoImg.onload = () => {
        logoImg.onload = () => {
          const canvas = document.getElementById('canvas');
          const ctx = canvas.getContext('2d');

          let width = orientacao === 'vertical' ? 1080 : 1920;
          let height = orientacao === 'vertical' ? 1920 : 1080;

          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(fundoImg, 0, 0, width, height);
          ctx.drawImage(logoImg, width - 300, 30, 250, 100);

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 80px Arial";
          ctx.textAlign = "center";
          ctx.fillText(titulo, width / 2, height - 100);
        };
        logoImg.src = readerLogo.result;
      };
      fundoImg.src = readerFundo.result;
    };
    readerLogo.readAsDataURL(logoInput);
  };
  readerFundo.readAsDataURL(fundoInput);
}

function baixarBanner() {
  const canvas = document.getElementById('canvas');
  const link = document.createElement('a');
  link.download = 'banner.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}
