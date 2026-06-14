// Scroll reveal
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
document.getElementById('menuToggle').addEventListener('click', function() {
  this.classList.toggle('active');
  document.getElementById('mainNav').classList.toggle('mobile-open');
});

document.querySelectorAll('.nav a').forEach(function(link) {
  link.addEventListener('click', function() {
    document.getElementById('menuToggle').classList.remove('active');
    document.getElementById('mainNav').classList.remove('mobile-open');
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

calculate();

// Rotating hero banner
var heroItems = [
  { icon: '🎓', label: 'TRAINING' },
  { icon: '⚡', label: 'AUTOMATION' },
  { icon: '🤖', label: 'CHATBOTS' }
];
var heroIndex = 0;
var heroIconEl = document.getElementById('heroIcon');
var heroLabelEl = document.getElementById('heroLabel');

if (heroIconEl && heroLabelEl) {
  setInterval(function() {
    heroIconEl.classList.add('fade-out');
    heroLabelEl.classList.add('fade-out');
    setTimeout(function() {
      heroIndex = (heroIndex + 1) % heroItems.length;
      heroIconEl.textContent = heroItems[heroIndex].icon;
      heroLabelEl.textContent = heroItems[heroIndex].label;
      heroIconEl.classList.remove('fade-out');
      heroLabelEl.classList.remove('fade-out');
    }, 400);
  }, 2800);
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
