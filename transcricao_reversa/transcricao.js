const navList = document.getElementById('nav-list');
const menuToggle = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', () => {
  navList.classList.toggle('show');
});


// IDs das vozes
const voices = {
  voz1: "IGmfzACCDHYu8YfQJuVi",
  voz2: "JBFqnCBsd6RMkjVDRZzb"
};

// carrega voz salva (ou padrão)
let selectedVoiceId = localStorage.getItem('selectedVoiceId') || voices.voz1;

// quando a página carregar, conecta eventos e atualiza visual
window.addEventListener('DOMContentLoaded', () => {
  // conecta clique dos botões de voz
  document.querySelectorAll('.voice-buttons button').forEach(btn => {
    btn.addEventListener('click', () => {
      const vid = btn.dataset.voiceId;
      selectVoice(vid);
    });
  });

  // conecta botão gerar (se existir)
  const generateBtn = document.getElementById('generateBtn');
  if (generateBtn) {
    generateBtn.addEventListener('click', generateSpeech);
  }

  // aplica estado visual inicial
  updateVoiceButtons();
});

function selectVoice(voiceId) {
  selectedVoiceId = voiceId;
  localStorage.setItem('selectedVoiceId', voiceId);
  updateVoiceButtons();
}

function updateVoiceButtons() {
  document.querySelectorAll('.voice-buttons button').forEach(btn => {
    // remove qualquer estilo inline antigo (por segurança)
    btn.removeAttribute('style');

    if (btn.dataset.voiceId === selectedVoiceId) {
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
    } else {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    }
  });
}

async function generateSpeech() {
  const text = document.getElementById('textInput').value.trim();
  const audioPlayer = document.getElementById('audioPlayer');
  const generateBtn = document.getElementById('generateBtn');

  if (!text) {
    alert("Digite um texto primeiro.");
    return;
  }

  // ATENÇÃO: deixar a apiKey no front-end expõe sua chave. 
  // Em produção, faça essa chamada por um servidor/proxy (recomendado).
  const apiKey = "sk_cd32d0d364f4745b95f6d0d3a5d0447c58cb947d79016b97";

  if (generateBtn) generateBtn.disabled = true;

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}/stream`, {
      method: "POST",
      headers: {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey
      },
      body: JSON.stringify({
        text: text,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error("Erro ao gerar áudio. " + response.status + " " + errText);
    }

    const audioBlob = await response.blob();
    const audioURL = URL.createObjectURL(audioBlob);
    audioPlayer.src = audioURL;
    await audioPlayer.play().catch(() => { /* alguns browsers exigem interação */ });
  } catch (error) {
    alert(error.message);
  } finally {
    if (generateBtn) generateBtn.disabled = false;
  }
}
