/**
 * navbar.js
 * ---------------------------------------------------------
 * كود النافبار بس (منفصل عن أي كود تاني في الصفحة).
 * ينفع تحطه في أي صفحة جديدة عندها نفس العناصر دي بالظبط:
 *
 *   <header id="navbar">
 *     <nav id="navLinks"> ... روابط بكلاس "nav-link" وattribute "data-link" ... </nav>
 *     <button id="burger"> ... </button>
 *   </header>
 *
 * وكل section في الصفحة لازم يكون ليها id ومعمول لها كلاس "section"
 * عشان تتفعّل خاصية الـ active link تلقائيًا.
 * ---------------------------------------------------------
 */

// ===== إعدادات عامة =====
const navbar   = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const burger   = document.getElementById('burger');
const links    = document.querySelectorAll('[data-link]');
const sections = document.querySelectorAll('.section');

// ===== 1) تمرير سموز عند الضغط على أي رابط =====
links.forEach(link => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    if (targetId && targetId.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
      // إغلاق المنيو في الموبايل بعد اختيار رابط
      navLinks.classList.remove('open');
      burger.classList.remove('open');
    }
  });
});

// ===== 2) تغيير شكل النافبار عند السكرول =====
window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== 3) تفعيل الرابط النشط حسب القسم الظاهر (IntersectionObserver) =====
const navLinkEls = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinkEls.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, {
  threshold: 0.5
});

sections.forEach(section => navObserver.observe(section));

// ===== 4) قائمة الموبايل (Burger Menu) =====
burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  burger.classList.toggle('open');
});