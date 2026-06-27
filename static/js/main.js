// Scroll reveal
document.documentElement.classList.add('js-reveal');

var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(function(el) {
  observer.observe(el);
});

// Header scroll shadow
window.addEventListener('scroll', function() {
  document.getElementById('header').classList.toggle('scrolled', window.scrollY > 10);
});

// Mobile menu
var menuToggle = document.getElementById('menuToggle');
var mainNav = document.getElementById('mainNav');

menuToggle.addEventListener('click', function() {
  this.classList.toggle('active');
  mainNav.classList.toggle('mobile-open');
});

// Mobile dropdown accordion
document.querySelectorAll('.dropdown-toggle').forEach(function(btn) {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    var item = this.closest('.nav-item');
    var isOpen = item.classList.contains('dropdown-open');
    // close all others
    document.querySelectorAll('.nav-item.dropdown-open').forEach(function(el) {
      el.classList.remove('dropdown-open');
      var b = el.querySelector('.dropdown-toggle');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('dropdown-open');
      this.setAttribute('aria-expanded', 'true');
    }
  });
});

// Close menu when a non-toggle nav link is clicked
document.querySelectorAll('.nav a').forEach(function(link) {
  link.addEventListener('click', function() {
    menuToggle.classList.remove('active');
    mainNav.classList.remove('mobile-open');
    document.querySelectorAll('.nav-item.dropdown-open').forEach(function(el) {
      el.classList.remove('dropdown-open');
      var b = el.querySelector('.dropdown-toggle');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  });
});

// Counter animation
var counterObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = '1';
      var target = parseInt(entry.target.getAttribute('data-count'));
      var current = 0;
      var step = target / (1500 / 16);
      var timer = setInterval(function() {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        entry.target.textContent = Math.round(current);
      }, 16);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(function(el) {
  counterObserver.observe(el);
});

// Calculator
var values = { staff: 3, hours: 8, rate: 45 };

function adjust(field, delta) {
  values[field] = Math.max(field === 'rate' ? 10 : 1, values[field] + delta);
  document.getElementById(field).textContent = values[field];
  calculate();
}

function calculate() {
  var saved = values.staff * values.hours * 0.7;
  var monthly = Math.round(saved * values.rate * 4.33);
  var yearly = monthly * 12;

  document.getElementById('resultMonth').textContent = monthly.toLocaleString('de-DE') + ' \u20AC';
  document.getElementById('resultYear').textContent = yearly.toLocaleString('de-DE') + ' \u20AC';

  var result = document.getElementById('calcResult');
  result.classList.remove('pop');
  void result.offsetWidth;
  result.classList.add('pop');
}

if (document.getElementById('resultMonth')) {
  calculate();
}

// Rotating hero banner
var heroSlides = document.querySelectorAll('.hero-slide');
var heroDots = document.querySelectorAll('.hero-dot');
var heroSlideIndex = 0;

if (heroSlides.length) {
  setInterval(function() {
    heroSlides[heroSlideIndex].classList.remove('active');
    heroSlides[heroSlideIndex].classList.add('prev');
    if (heroDots[heroSlideIndex]) heroDots[heroSlideIndex].classList.remove('active');

    var finishedIndex = heroSlideIndex;
    heroSlideIndex = (heroSlideIndex + 1) % heroSlides.length;

    heroSlides[heroSlideIndex].classList.add('active');
    if (heroDots[heroSlideIndex]) heroDots[heroSlideIndex].classList.add('active');

    setTimeout(function() {
      heroSlides[finishedIndex].classList.remove('prev');
    }, 500);
  }, 3500);
}

// FAQ accordion
function toggleFaq(btn) {
  var item = btn.parentElement;
  var wasOpen = item.classList.contains('open');

  document.querySelectorAll('.faq-item').forEach(function(i) {
    i.classList.remove('open');
  });

  if (!wasOpen) {
    item.classList.add('open');
  }
}
