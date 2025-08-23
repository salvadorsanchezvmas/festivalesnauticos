/* Loader */
window.addEventListener('load', function () {
  const loader = document.querySelector('.loader-overlay');
  if (loader) {
    loader.classList.add('hidden');
  }
});

/* i18n */
const langSelect = document.getElementById('langSelect');
let currentLang = localStorage.getItem('lang') || 'es';

async function loadI18n(lang) {
  try {
    const res = await fetch(`i18n/${lang}.json`);
    const data = await res.json();
    applyI18n(data);
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
  } catch (err) {
    console.error('i18n load error', err);
  }
}

function applyI18n(data) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const keys = el.dataset.i18n.split('.');
    const text = keys.reduce((o, k) => (o || {})[k], data);
    if (typeof text === 'string') {
      if (el.tagName === 'TITLE') {
        document.title = text;
      } else if (el.tagName === 'META') {
        el.setAttribute('content', text);
      } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = text;
      } else {
        el.innerHTML = text;
      }
    }
  });
}

langSelect.addEventListener('change', e => {
  loadI18n(e.target.value);
});

loadI18n(currentLang);
langSelect.value = currentLang;

/* jQuery dependent plugins */
jQuery(function ($) {
  // Revolution Slider init (basic)
  if ($.fn.revolution) {
    $('#rev-slider').show().revolution({
      sliderType: 'standard',
      sliderLayout: 'auto',
      delay: 5000,
      navigation: { arrows: { enable: true } }
    });
  }

  // Owl Carousel
  $('#altares-carousel, #marxmas-carousel').owlCarousel({
    items: 1,
    loop: true,
    nav: true,
    dots: true
  });

  // fancybox
  $('[data-fancybox]').fancybox();
});

/* Form submission */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const formAlert = document.getElementById('formAlert');
    formAlert.textContent = '';
    const formData = new FormData(form);
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      formAlert.className = data.success ? 'alert alert-success' : 'alert alert-danger';
      formAlert.textContent = data.message;
      if (data.success) {
        form.reset();
        if (typeof grecaptcha !== 'undefined') {
          grecaptcha.reset();
        }
      }
    } catch (err) {
      formAlert.className = 'alert alert-danger';
      formAlert.textContent = 'Error al enviar el formulario.';
    }
  });
}
