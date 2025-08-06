const navList = document.getElementById('nav-list');
const menuToggle = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', () => {
  navList.classList.toggle('show');
});

// Geração do calendário
function generateCalendar() {
  const calendar = document.getElementById('calendar');
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const today = now.getDate();

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
  for (let i = 0; i < firstDay; i++) {
    daysContainer.innerHTML += `<div></div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    const classToday = i === today ? 'today' : '';
    daysContainer.innerHTML += `<div class="${classToday}">${i}</div>`;
  }
}

generateCalendar();

document.addEventListener('click', function (e) {
  if (e.target.classList.contains('today')) {
    window.location.href = 'diario.html';
  }
});
