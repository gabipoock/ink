
    let video = document.getElementById("video");
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    let modelo = null;

    cocoSsd.load().then(mod => {
    modelo = mod;
    });

    function abrirCamera(facingMode) {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: facingMode } })
        .then(stream => { video.srcObject = stream; })
        .catch(err => console.error("Erro ao acessar a câmera:", err));
    }

    function abrirCameraComputador() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => { video.srcObject = stream; })
        .catch(err => console.error("Erro ao acessar a câmera do computador:", err));
    }

    async function falarObjetos() {
    if (!modelo) {
        alert("Modelo ainda está carregando...");
        return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const resultados = await modelo.detect(canvas);
    if (resultados.length === 0) {
        alert("Nenhum objeto detectado.");
        return;
    }

    const nomesEN = resultados.map(r => r.class);
    const nomesPT = nomesEN.map(n => dicionario[n] || n);
    console.log(nomesEN.map(n => dicionario[n] || n) +"=="+nomesPT);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#00FF00";
    ctx.lineWidth = 2;
    ctx.font = "20px Arial";
    ctx.fillStyle = "#00FF00";

    resultados.forEach((r, i) => {
        const [x, y, w, h] = r.bbox;
        ctx.strokeRect(x, y, w, h);
        ctx.fillText(nomesPT[i], x, y > 20 ? y - 5 : y + 20);
    });

    const mensagem = "" + [...new Set(nomesPT)].join(", ");
    const fala = new SpeechSynthesisUtterance(mensagem);
    fala.lang = "pt-BR";
    speechSynthesis.speak(fala);
    }
