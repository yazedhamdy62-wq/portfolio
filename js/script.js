document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Navbar shadow on scroll ---------- */
  const nav = document.getElementById('pnav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Desktop gallery: highlight the clicked item ---------- */
  const items = document.querySelectorAll('.gallery__item');
  items.forEach((item) => {
    item.addEventListener('click', () => {
      items.forEach((i) => i.classList.remove('is-active'));
      item.classList.add('is-active');
    });
  });

  /* ---------- Mobile gallery: big image + arrows + thumbnails ----------
     بيتبني أوتوماتيك من نفس صور .gallery__item، فمفيش حاجة تتغير في الـ HTML.
     CSS هو اللي بيظهره على الموبايل بس (<= 760px). */
  const ARROW_L = '<svg viewBox="0 0 24 24"><path d="M20 12H4M10 18l-6-6 6-6"/></svg>';
  const ARROW_R = '<svg viewBox="0 0 24 24"><path d="M4 12h16M14 6l6 6-6 6"/></svg>';

  document.querySelectorAll('.gallery').forEach((gallery) => {
    const imgs = [...gallery.querySelectorAll('.gallery__item img')];
    if (!imgs.length) return;

    const wrap = document.createElement('div');
    wrap.className = 'g-mobile' + (imgs.length < 2 ? ' is-single' : '');
    wrap.innerHTML =
      '<div class="g-row">' +
        '<button type="button" class="g-arrow g-prev" aria-label="Previous image">' + ARROW_L + '</button>' +
        '<div class="g-stage"><img alt=""></div>' +
        '<button type="button" class="g-arrow g-next" aria-label="Next image">' + ARROW_R + '</button>' +
      '</div>' +
      '<div class="g-thumbs"></div>';

    const stageImg = wrap.querySelector('.g-stage img');
    const thumbsBox = wrap.querySelector('.g-thumbs');
    let index = 0;

    const thumbs = imgs.map((img, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'g-thumb';
      b.setAttribute('aria-label', 'Image ' + (i + 1));
      const t = document.createElement('img');
      t.src = img.src; t.alt = ''; t.loading = 'lazy';
      b.appendChild(t);
      b.addEventListener('click', () => show(i));
      thumbsBox.appendChild(b);
      return b;
    });

    function show(i, instant) {
      index = (i + imgs.length) % imgs.length;
      const apply = () => {
        stageImg.src = imgs[index].src;
        stageImg.alt = imgs[index].alt || '';
        stageImg.classList.remove('is-fading');
      };
      if (instant) apply();
      else { stageImg.classList.add('is-fading'); setTimeout(apply, 130); }

      thumbs.forEach((t, k) => t.classList.toggle('is-active', k === index));
      const t = thumbs[index];
      thumbsBox.scrollTo({ left: t.offsetLeft - (thumbsBox.clientWidth - t.offsetWidth) / 2, behavior: 'smooth' });
    }

    wrap.querySelector('.g-prev').addEventListener('click', () => show(index - 1));
    wrap.querySelector('.g-next').addEventListener('click', () => show(index + 1));

    /* swipe */
    let startX = null;
    const stage = wrap.querySelector('.g-stage');
    stage.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1));
    });

    gallery.querySelector('.gallery__grid').after(wrap);
    gallery.classList.add('has-carousel');
    show(0, true);
  });
});