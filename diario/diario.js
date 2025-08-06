function salvarEmocao() {
  const texto = document.getElementById('textoEmocao').value;
  const emocao = document.querySelector('input[name="emocao"]:checked');

  if (!emocao) {
    alert("Selecione uma emoção.");
    return;
  }

  const data = new Date();
  const chave = `${data.getFullYear()}-${data.getMonth()}-${data.getDate()}`;

  const registro = {
    emocao: emocao.value,
    texto: texto
  };

  localStorage.setItem(chave, JSON.stringify(registro));
  alert("Emoção salva com sucesso!");

  // Volta para o calendário
  window.location.href = 'index.html';
}

const navList = document.getElementById('nav-list');
const menuToggle = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', () => {
  navList.classList.toggle('show');
});

// Emoções e cores correspondentes
const corEmocoes = {
  feliz: '#ffff88',
  triste: '#84b6f4',
  calmo:  '#a8e6cf',
  medo:   '#fda4ff',
  raiva:  '#f76c6c'
};

function generateCalendar() {
  const calendar = document.getElementById('calendar');
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  calendar.innerHTML = `
    <div class="calendar-header">
      <h2>${monthNames[month]} ${year}</h2>
    </div>
    <div class="weekdays">
      <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div>
      <div>Qui</div><div>Sex</div><div>Sáb</div>
    </div>
    <div class="days" id="days"></div>
  `;

  const daysContainer = document.getElementById('days');

  // Espaço para dias da semana que não começam no domingo
  for (let i = 0; i < firstDay; i++) {
    daysContainer.innerHTML += `<div></div>`;
  }

  // Dias do mês com emoção (se houver)
  for (let day = 1; day <= lastDate; day++) {
    const chave = `${year}-${month}-${day}`;
    const dataSalva = localStorage.getItem(chave);

    let classe = '';
    let estilo = '';
    let texto = day;

    if (dataSalva) {
      const info = JSON.parse(dataSalva);
      const cor = corEmocoes[info.emocao];
      estilo = `background-color: ${cor};`;
    } else if (day === today) {
      classe = 'today';
    }

    daysContainer.innerHTML += `<div class="${classe}" style="${estilo}" data-dia="${day}">${texto}</div>`;
  }
}

// Redireciona ao clicar no dia atual
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('today')) {
    window.location.href = 'diario.html';
  }
});

generateCalendar();
