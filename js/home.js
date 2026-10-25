// ===== Reveal elements progressively as the user scrolls down =====
// كل عنصر يظهر بحركة "fade + slide up" ومعاه تأخير بسيط
// وكل عنصر جوه نفس المجموعة (زي الكروت) بياخد تأخير أكبر شوية عن اللي قبله

const revealEls = document.querySelectorAll('.reveal');

// نجمع العناصر حسب الأب (parent) عشان نعمل delay متتالي للعناصر
// اللي بتظهر مع بعض في نفس الوقت (زي كروت الأعمال)
const groups = new Map();

revealEls.forEach(el => {
  const parent = el.parentElement;
  if (!groups.has(parent)) groups.set(parent, []);
  groups.get(parent).push(el);
});

groups.forEach(group => {
  group.forEach((el, index) => {
    el.style.transitionDelay = `${index * 0.15}s`;
  });
});

// ===== IntersectionObserver: يضيف الكلاس in-view أول ما العنصر يدخل الشاشة =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target); // يظهر مرة واحدة بس
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -60px 0px'
});

revealEls.forEach(el => observer.observe(el));
// ===== إعدادات عامة =====
const navbar   = document.getElementById('navbar');
const navbarDesktop = document.getElementById('navbarDesktop');
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
  const scrolled = window.scrollY > 30;
  navbar.classList.toggle('scrolled', scrolled);
  if (navbarDesktop) navbarDesktop.classList.toggle('scrolled', scrolled);
});

// ===== 3) تفعيل الرابط النشط حسب القسم الظاهر (IntersectionObserver) =====
const navLinkEls = document.querySelectorAll('.nav-link, .dlink');

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
  // بدل ما نعتمد على نسبة 50% من طول السكشن (بيفشل مع السكاشن الطويلة زي works)
  // بنعمل "خط تفعيل" وهمي في نص الشاشة تقريبًا، وأول سكشن يقطعه بيبقى هو الـ active
  threshold: 0,
  rootMargin: '-45% 0px -45% 0px'
});

sections.forEach(section => navObserver.observe(section));

// ===== 4) قائمة الموبايل (Burger Menu) =====
burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  burger.classList.toggle('open');
});

/**
 * contact-script.js
 * ---------------------------------------------------------
 * كود صفحة الكونتاكت بس: تحقق بسيط من الفورم + رسالة تأكيد
 * عند الإرسال. مفيهوش أي كود خاص بالنافبار أو الفوتر.
 * ---------------------------------------------------------
 */

const form         = document.getElementById('contactForm');
const submitBtn    = form.querySelector('.submit-btn');
const submitLabel  = document.getElementById('submitLabel');
const statusEl     = document.getElementById('formStatus');

const fields = {
  name:    document.getElementById('name'),
  email:   document.getElementById('email'),
  subject: document.getElementById('subject'),
  message: document.getElementById('message'),
};

// ===== إزالة حالة الخطأ أول ما المستخدم يبدأ يكتب =====
Object.values(fields).forEach(field => {
  field.addEventListener('input', () => field.classList.remove('error'));
});

// ===== دالة بسيطة للتحقق من صحة الإيميل =====
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// ===== ضع مفتاح Web3Forms الخاص بك هنا (Access Key) =====
// احصل عليه مجانًا من: https://web3forms.com
const WEB3FORMS_ACCESS_KEY = 'a44621e3-85f9-42e2-9c70-5f3444a0e47f';

form.addEventListener('submit', (e) => {
  e.preventDefault();

  let isValid = true;

  // تحقق من الحقول الفاضية
  Object.values(fields).forEach(field => {
    if (!field.value.trim()) {
      field.classList.add('error');
      isValid = false;
    }
  });

  // تحقق من صيغة الإيميل
  if (fields.email.value.trim() && !isValidEmail(fields.email.value.trim())) {
    fields.email.classList.add('error');
    isValid = false;
  }

  if (!isValid) {
    statusEl.textContent = 'Please fill in all fields correctly.';
    statusEl.className = 'form-status error';
    return;
  }

  // ===== إرسال البيانات فعليًا عبر Web3Forms (بدون باك اند) =====
  submitBtn.disabled = true;
  submitLabel.textContent = 'SENDING...';
  statusEl.textContent = '';
  statusEl.className = 'form-status';

  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      access_key: WEB3FORMS_ACCESS_KEY,
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      subject: fields.subject.value.trim(),
      message: fields.message.value.trim()
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        statusEl.textContent = "Message sent successfully. I'll get back to you soon.";
        statusEl.className = 'form-status success';
        form.reset();
      } else {
        statusEl.textContent = 'Something went wrong. Please try again or email me directly.';
        statusEl.className = 'form-status error';
      }
    })
    .catch(() => {
      statusEl.textContent = 'Network error. Please check your connection and try again.';
      statusEl.className = 'form-status error';
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitLabel.textContent = 'TRANSMIT MESSAGE';
    });
});

/* =====================================================================
   HERO COUNTERS – بيعدّوا من 0 للرقم الحقيقي أول ما الصفحة تفتح
   - Projects built: بيعدّ كروت .work-card جوه #works تلقائيًا
   - Tools in my stack: بيعدّ .skill-item جوه #skills (ولو مفيش، بياخد data-fallback)
   ===================================================================== */
(function () {
  const counters = document.querySelectorAll('.stat-num');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function getTarget(el) {
    const sel = el.dataset.countSelector;
    let n = sel ? document.querySelectorAll(sel).length : 0;
    if (!n) n = parseInt(el.dataset.fallback || '0', 10);
    return n;
  }

  function animate(el, target, duration) {
    if (reduceMotion || target === 0) { el.textContent = target; return; }
    const start = performance.now();
    const easeOut = t => 1 - Math.pow(1 - t, 3);
    (function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(easeOut(p) * target);
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }

  window.addEventListener('load', () => {
    setTimeout(() => counters.forEach(el => animate(el, getTarget(el), 1600)), 350);
  });
})();