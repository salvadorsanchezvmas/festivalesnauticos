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
    nav: false,
    autoplay: true,
    dots: false
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

document.addEventListener('DOMContentLoaded', function () {
  $('#banner-slider').owlCarousel({
    items: 1,
    loop: true,
    nav: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 7000,
    autoplayHoverPause: true,
    navText: [
      '<span class="carousel-control-prev-icon" aria-label="Anterior"></span>',
      '<span class="carousel-control-next-icon" aria-label="Siguiente"></span>'
    ]
  });
});

function isMobileScreen() {
  return window.innerWidth <= 967;
}

$(function () {
  if (!isMobileScreen()) {
    var $nav = $('.navbar'); // Adjust selector if your nav uses a different class or id
    var $logo = $nav.find('img.navbar-logo'); // Add class 'navbar-logo' to your logo <img>
    $nav.css({
      'background-color': 'transparent',
      'color': '#fff'
    });
    $nav.find('a, .navbar-brand, .nav-link').css('color', '#fff');
    if ($logo.length) {
      $logo.attr('src', 'images/logowhite.png');
    }

    $(window).on('scroll', function () {
      if ($(window).scrollTop() >= 50) {
        $nav.css('background-color', 'rgba(255,255,255,0.95)');
        $nav.find('a, .navbar-brand, .nav-link').css('color', '#1F2B7B');
        if ($logo.length) {
          $logo.attr('src', 'images/logo.png');
        }
      } else {
        $nav.css('background-color', 'transparent');
        $nav.find('a, .navbar-brand, .nav-link').css('color', '#fff');
        if ($logo.length) {
          $logo.attr('src', 'images/logowhite.png');
        }
      }
    });
  }
});


// Place this script after your gallery section is rendered (e.g., at the end of your JS file or in a DOMContentLoaded event)
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('#gallery .row a').forEach(function (el) {
    // Only process if not already duplicated
    if (!el.classList.contains('gallery-duplicated')) {
      // Clone the <a> element
      var clone = el.cloneNode(true);
      clone.style.display = 'none';
      clone.classList.add('gallery-duplicated');

      // Get the <img> inside and its alt attribute
      var img = clone.querySelector('img');
      if (img && img.alt) {
        if (img.alt.toLowerCase().includes('altares')) {
          clone.setAttribute('data-fancybox', 'altares2024');
        } else if (img.alt.toLowerCase().includes('myc')) {
          clone.setAttribute('data-fancybox', 'marxmas2024');
        }
      }

      // Insert the hidden clone after the original
      el.parentNode.appendChild(clone);
    }
  });
});