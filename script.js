const cover = document.getElementById('cover');
const openButton = document.getElementById('open-invitation');
const invitation = document.getElementById('invitation');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionToggle = document.getElementById('motion-toggle');
let motionPaused = motionPreference.matches;
let revealObserver;
function applyMotionPreference() {
  document.body.classList.toggle('motion-paused', motionPaused);
  motionToggle.textContent = motionPaused ? 'Play animations' : 'Pause animations';
  motionToggle.setAttribute('aria-pressed', String(motionPaused));
  motionToggle.hidden = motionPreference.matches;
}
motionToggle.addEventListener('click', () => { motionPaused = !motionPaused; applyMotionPreference(); });
motionPreference.addEventListener('change', () => { motionPaused = motionPreference.matches; applyMotionPreference(); });
applyMotionPreference();
const petalLayer = document.getElementById('petals');
for (let i = 0; i < 14; i++) {
  const petal = document.createElement('i');
  petal.className = 'petal';
  petal.style.cssText = `--left:${(i * 37) % 100}%;--size:${8 + i % 5 * 2}px;--duration:${14 + i % 7 * 2}s;--delay:-${i * 2.7}s;--drift:${i % 2 ? 90 : -90}px`;
  petalLayer.appendChild(petal);
}
function revealSections() {
  if (motionPaused || !('IntersectionObserver' in window)) return;
  revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  }, { threshold: 0.08 });
  document.querySelectorAll('.celebration > *, .countdown-section > *, .location > *, footer > *').forEach(element => {
    element.classList.add('reveal-pending');
    revealObserver.observe(element);
  });
}
openButton.addEventListener('click', () => {
  openButton.disabled = true;
  cover.classList.add('opening');
  setTimeout(() => {
    invitation.hidden = false;
    cover.classList.add('dismissed');
    document.body.classList.add('invitation-open');
    revealSections();
    invitation.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, motionPaused ? 0 : 1600);
});
const weddingTime = Date.parse('2027-05-04T09:00:00+05:30');
function updateCountdown() {
  const total = Math.max(0, Math.floor((weddingTime - Date.now()) / 1000));
  const values = { days: Math.floor(total / 86400), hours: Math.floor(total / 3600) % 24, minutes: Math.floor(total / 60) % 60, seconds: total % 60 };
  for (const [id, value] of Object.entries(values)) {
    const digit = document.getElementById(id);
    const next = String(value).padStart(2, '0');
    if (digit.textContent !== next) {
      digit.textContent = next;
      if (!motionPaused && !invitation.hidden) {
        digit.classList.remove('digit-change');
        void digit.offsetWidth;
        digit.classList.add('digit-change');
      }
    }
  }
  if (total === 0) document.getElementById('countdown-title').textContent = 'Our forever begins · 4 May 2027';
}
updateCountdown();
setInterval(updateCountdown, 1000);
