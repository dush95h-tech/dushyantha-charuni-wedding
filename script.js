const cover = document.getElementById('cover');
const openButton = document.getElementById('open-invitation');
const invitation = document.getElementById('invitation');
openButton.addEventListener('click', () => {
  openButton.disabled = true;
  cover.classList.add('opening');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  setTimeout(() => {
    invitation.hidden = false;
    cover.classList.add('dismissed');
    invitation.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, reducedMotion ? 0 : 1100);
});
const weddingTime = Date.parse('2027-05-04T09:00:00+05:30');
function updateCountdown() {
  const total = Math.max(0, Math.floor((weddingTime - Date.now()) / 1000));
  const values = { days: Math.floor(total / 86400), hours: Math.floor(total / 3600) % 24, minutes: Math.floor(total / 60) % 60, seconds: total % 60 };
  for (const [id, value] of Object.entries(values)) document.getElementById(id).textContent = String(value).padStart(2, '0');
  if (total === 0) document.getElementById('countdown-title').textContent = 'Our forever begins · 4 May 2027';
}
updateCountdown();
setInterval(updateCountdown, 1000);
