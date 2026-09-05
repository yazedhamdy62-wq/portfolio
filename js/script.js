document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.gallery__item');
  const caption = document.getElementById('galleryCaption');

  items.forEach((item) => {
    item.addEventListener('click', () => {
      items.forEach((i) => i.classList.remove('is-active'));
      item.classList.add('is-active');
      if (caption) caption.textContent = item.dataset.caption || '';
    });
  });
});