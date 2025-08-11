// Abrir/fechar menu lateral
document.getElementById('menu-toggle').addEventListener('click', () => {
  document.querySelector('.side-menu').classList.toggle('open');
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
