// Abrir/fechar menu lateral
const navList = document.getElementById('nav-list');
const menuToggle = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', () => {
  navList.classList.toggle('show');
});

// Função para rolar cada carrossel individualmente
function scrollCarousel(carouselId, direction) {
  const carousel = document.getElementById(carouselId);
  const scrollAmount = 320; // Largura de um vídeo + margem
  carousel.scrollBy({
    left: direction * scrollAmount,
    behavior: 'smooth'
  });
}
