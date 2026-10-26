const cover = document.getElementById('cover');
const invitation = document.getElementById('invitation');
const film = document.getElementById('film');
const video = document.getElementById('intro-video');
const pauseFilm = document.getElementById('pause-film');
const filmStatus = document.getElementById('film-status');
const motionToggle = document.getElementById('motion-toggle');
const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused = preference.matches;
let observer;
let playbackAttempt = 0;
document.body.classList.add('intro-active');
function applyMotion() {
  document.body.classList.toggle('motion-paused', motionPaused);
  motionToggle.textContent = motionPaused ? 'Play motion' : 'Pause motion';
  motionToggle.setAttribute('aria-pressed', String(motionPaused));
  motionToggle.hidden = preference.matches;
}
motionToggle.addEventListener('click', () => { motionPaused = !motionPaused; applyMotion(); });
preference.addEventListener('change', () => { motionPaused = preference.matches; applyMotion(); if (preference.matches && !film.hidden) showInvitation(); });
applyMotion();
for (let i = 0; i < 12; i++) {
  const petal = document.createElement('i');
  petal.className = 'petal';
  petal.style.cssText = '--left:'+(i*37%100)+'%;--size:'+(7+i%4*2)+'px;--duration:'+(17+i%7*2)+'s;--delay:-'+(i*2.7)+'s;--drift:'+(i%2?80:-80)+'px';
  document.getElementById('petals').appendChild(petal);
}
function observeSections() {
  if (observer || motionPaused || !('IntersectionObserver' in window)) return;
  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll('.section > *, footer > *').forEach(element => { element.classList.add('reveal-pending'); observer.observe(element); });
}
function showInvitation() {
  playbackAttempt++;
  video.pause();
  film.hidden = true;
  cover.hidden = true;
  invitation.hidden = false;
  document.body.classList.remove('intro-active', 'film-playing');
  document.body.classList.add('invitation-open');
  observeSections();
  invitation.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}
async function playFilm() {
  if (preference.matches || motionPaused) { showInvitation(); return; }
  const attempt = ++playbackAttempt;
  cover.hidden = true;
  invitation.hidden = true;
  film.hidden = false;
  filmStatus.hidden = false;
  document.body.classList.add('intro-active', 'film-playing');
  video.currentTime = 0;
  document.getElementById('film-progress').style.width = '0%';
  pauseFilm.textContent = 'Pause film';
  document.getElementById('skip-film').focus();
  try { await video.play(); } catch { if (attempt === playbackAttempt && !film.hidden) showInvitation(); }
}
document.getElementById('open-invitation').addEventListener('click', playFilm);
document.getElementById('replay-film').addEventListener('click', playFilm);
document.getElementById('skip-film').addEventListener('click', showInvitation);
video.addEventListener('ended', showInvitation);
video.addEventListener('error', () => { if (!film.hidden) showInvitation(); });
pauseFilm.addEventListener('click', async () => {
  if (video.paused) {
    const attempt = playbackAttempt;
    try { await video.play(); } catch { if (attempt === playbackAttempt && !film.hidden) showInvitation(); }
  } else video.pause();
});
video.addEventListener('pause', () => { pauseFilm.textContent = 'Play film'; });
video.addEventListener('play', () => { pauseFilm.textContent = 'Pause film'; });
video.addEventListener('playing', () => { filmStatus.hidden = true; });
video.addEventListener('waiting', () => { filmStatus.hidden = false; });
video.addEventListener('timeupdate', () => {
  if (Number.isFinite(video.duration) && video.duration > 0) document.getElementById('film-progress').style.width = (video.currentTime / video.duration * 100) + '%';
});
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !film.hidden) showInvitation(); });
const weddingTime = Date.parse('2027-05-04T09:00:00+05:30');
function updateCountdown() {
  const total = Math.max(0, Math.floor((weddingTime - Date.now()) / 1000));
  const values = { days: Math.floor(total / 86400), hours: Math.floor(total / 3600) % 24, minutes: Math.floor(total / 60) % 60, seconds: total % 60 };
  Object.entries(values).forEach(([id, value]) => { document.getElementById(id).textContent = String(value).padStart(2, '0'); });
  if (!total) document.getElementById('countdown-title').textContent = 'Our forever begins · 4 May 2027';
}
updateCountdown();
setInterval(updateCountdown, 1000);

