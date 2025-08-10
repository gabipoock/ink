//abrir menu
document.getElementById('menu-toggle').addEventListener('click', () => {
  document.querySelector('.side-menu').classList.toggle('open');
});


// cam.js (versão corrigida)
'use strict';

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const fotoCanvas = document.getElementById('foto');
const fotoCtx = fotoCanvas.getContext('2d');

let modelo = null;
let modelLoaded = false;
let objetosDetectados = [];

/* ---------------- modelo e câmera ---------------- */
async function carregarModelo() {
  try {
    modelo = await cocoSsd.load();
    modelLoaded = true;
    console.log('Modelo coco-ssd carregado.');
  } catch (err) {
    console.error('Erro ao carregar modelo coco-ssd:', err);
  }
}

async function iniciarCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = stream;
    await new Promise(resolve => video.onloadedmetadata = resolve);
    video.play();
    // ajustar canvas ao tamanho do vídeo (opcional)
    canvas.width = video.videoWidth || canvas.width;
    canvas.height = video.videoHeight || canvas.height;
    console.log('Câmera iniciada.');
    return true;
  } catch (err) {
    console.error('Erro ao iniciar câmera:', err);
    alert('Não foi possível acessar a câmera: ' + (err.message || err));
    return false;
  }
}

/* -------------- controle de câmeras (botões) -------------- */
function abrirCamera(facingMode) {
  navigator.mediaDevices.getUserMedia({ video: { facingMode } })
    .then(stream => {
      video.srcObject = stream;
      video.play();
    })
    .catch(err => console.error("Erro ao acessar a câmera:", err));
}

function abrirCameraComputador() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
      video.play();
    })
    .catch(err => console.error("Erro ao acessar a câmera do computador:", err));
}

/* ---------------- tirar foto + mostrar modal ---------------- */
async function tirarFoto() {
  try {
    if (!video || video.readyState < 2) { // HAVE_CURRENT_DATA
      alert('A câmera ainda não está pronta. Aguarde um pouco e tente novamente.');
      return;
    }

    // sincroniza tamanho do canvas de foto com o vídeo (para não deformar)
    fotoCanvas.width = video.videoWidth || fotoCanvas.width;
    fotoCanvas.height = video.videoHeight || fotoCanvas.height;

    // desenha frame atual
    fotoCtx.clearRect(0,0,fotoCanvas.width,fotoCanvas.height);
    fotoCtx.drawImage(video, 0, 0, fotoCanvas.width, fotoCanvas.height);

    // se o modelo estiver pronto, detecta objetos e desenha caixas/nomes
    if (modelLoaded && modelo) {
      const predictions = await modelo.detect(fotoCanvas);
      objetosDetectados = predictions.map(p => p.class);

      // compatibilidade com nomes (traducaoPT ou dicionario)
      const translate = window.traducaoPT || window.dicionario || {};

      fotoCtx.strokeStyle = '#ff0';
      fotoCtx.lineWidth = 2;
      fotoCtx.fillStyle = '#ff0';
      fotoCtx.font = '16px Arial';

      predictions.forEach(obj => {
        const [x, y, w, h] = obj.bbox;
        fotoCtx.strokeRect(x, y, w, h);
        const nomePT = translate[obj.class] || obj.class;
        const textY = (y > 18) ? y - 6 : y + 18;
        fotoCtx.fillText(nomePT, x, textY);
      });
    } else {
      console.log('Modelo não carregado ainda — abrindo modal sem anotações.');
    }

    // abre modal
    const modal = document.getElementById('fotoModal');
    if (modal) modal.style.display = 'flex';
  } catch (err) {
    console.error('Erro em tirarFoto():', err);
    alert('Erro ao tirar foto: ' + (err.message || err));
  }
}

/* ---------------- salvar / fechar modal ---------------- */
function salvarFoto() {
  try {
    const link = document.createElement('a');
    link.download = 'foto-com-objetos.png';
    link.href = fotoCanvas.toDataURL('image/png');
    link.click();
    // fecha modal após salvar
    const modal = document.getElementById('fotoModal');
    if (modal) modal.style.display = 'none';
  } catch (err) {
    console.error('Erro ao salvar foto:', err);
    alert('Erro ao salvar foto: ' + (err.message || err));
  }
}

function fecharModal() {
  const modal = document.getElementById('fotoModal');
  if (modal) modal.style.display = 'none';
}

/* ---------------- falar objetos (usa modelo em tempo real) ---------------- */
async function falarObjetos() {
  try {
    if (!modelLoaded || !modelo) {
      alert('Modelo ainda está carregando. Tente novamente em alguns segundos.');
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const resultados = await modelo.detect(canvas);
    if (!resultados || resultados.length === 0) {
      alert('Nenhum objeto detectado.');
      return;
    }

    const translate = window.traducaoPT || window.dicionario || {};
    const nomesPT = resultados.map(r => translate[r.class] || r.class);
    const mensagem = [...new Set(nomesPT)].join(', ');

    const fala = new SpeechSynthesisUtterance(mensagem);
    fala.lang = 'pt-BR';
    speechSynthesis.speak(fala);

    // desenha no canvas de visualização (opcional)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.font = '20px Arial';
    resultados.forEach((r, i) => {
      const [x, y, w, h] = r.bbox;
      ctx.strokeRect(x, y, w, h);
      ctx.fillText(nomesPT[i], x, y > 20 ? y - 5 : y + 20);
    });

  } catch (err) {
    console.error('Erro em falarObjetos():', err);
    alert('Erro ao detectar/falar objetos: ' + (err.message || err));
  }
}

/* -------------- clique no backdrop fecha modal -------------- */
document.addEventListener('click', (evt) => {
  const modal = document.getElementById('fotoModal');
  if (!modal || modal.style.display !== 'flex') return;
  if (evt.target === modal) fecharModal();
});

/* -------------- inicialização -------------- */
window.addEventListener('DOMContentLoaded', () => {
  iniciarCamera();
  carregarModelo();
});
