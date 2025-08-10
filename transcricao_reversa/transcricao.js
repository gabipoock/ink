//abrir menu
document.getElementById('menu-toggle').addEventListener('click', () => {
  document.querySelector('.side-menu').classList.toggle('open');
});

    async function generateSpeech() {
      const text = document.getElementById('textInput').value;
      const audioPlayer = document.getElementById('audioPlayer');

      if (!text) {
        alert("Digite um texto primeiro.");
        return;
      }

      const voiceId = "IGmfzACCDHYu8YfQJuVi"; // ID da voz stitch
      const apiKey = "sk_cd32d0d364f4745b95f6d0d3a5d0447c58cb947d79016b97";

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": apiKey
        },
        body: JSON.stringify({
          text: text,
          //model_id: "eleven_monolingual_v1", // ou outro model_id válido
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (!response.ok) {
        alert("Erro ao gerar áudio.");
        return;
      }

      const audioBlob = await response.blob();
      const audioURL = URL.createObjectURL(audioBlob);
      audioPlayer.src = audioURL;
      audioPlayer.play();
    }
  