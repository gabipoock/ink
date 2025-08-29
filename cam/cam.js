//abrir menu
const navList = document.getElementById('nav-list');
const menuToggle = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', () => {
  navList.classList.toggle('show');
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

/* ---------------- VOZ PT-BR ---------------- */
let vozPT = null;
function atualizarVozPT() {
  const vozes = speechSynthesis.getVoices();
  vozPT =
    vozes.find(v => v.lang.toLowerCase().startsWith('pt-br')) ||
    vozes.find(v => v.lang.toLowerCase().startsWith('pt')) ||
    null;
}
speechSynthesis.onvoiceschanged = atualizarVozPT;
atualizarVozPT();

/* ---------------- UTIL: monta frase com contagem ---------------- */
function gerarMensagemPT(lista) {
  const contagem = {};
  lista.forEach(nome => {
    contagem[nome] = (contagem[nome] || 0) + 1;
  });

  return Object.entries(contagem)
    .map(([nome, qtd]) => (qtd > 1 ? `${qtd} ${nome}s` : `${qtd} ${nome}`))
    .join(', ');
}

/* ---------------- FALAR OBJETOS ---------------- */
async function falarObjetos() {
  try {
    if (!modelLoaded || !modelo) {
      alert('Modelo ainda não está pronto. Aguarde...');
      return;
    }

    // prepara canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.font = '20px Arial';
    ctx.strokeStyle = '#00e0ff';
    ctx.fillStyle = '#00e0ff';

    const resultados = await modelo.detect(canvas);
    if (!resultados || resultados.length === 0) {
      alert('Nenhum objeto detectado.');
      return;
    }

    // traduz + desenha
    const nomesPT = resultados.map(r => window.dicionarioPT[r.class] || r.class);
    resultados.forEach((r, i) => {
      const [x, y, w, h] = r.bbox;
      ctx.strokeRect(x, y, w, h);
      ctx.fillText(nomesPT[i], x, y > 20 ? y - 5 : y + 20);
    });

    // monta frase
    const mensagem = gerarMensagemPT(nomesPT);

    // fala em PT-BR
    speechSynthesis.cancel();
    const fala = new SpeechSynthesisUtterance(mensagem);
    fala.lang = 'pt-BR';
    if (vozPT) fala.voice = vozPT;
    speechSynthesis.speak(fala);

  } catch (err) {
    console.error('Erro em falarObjetos():', err);
    alert('Erro: ' + (err.message || err));
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
