/* Portfolio v6 JS
   - particles canvas (neon dots + connecting lines)
   - theme toggle
   - typewriter
   - reveal on scroll
   - skillbars animate
   - project modal (image + description + buttons)
   - toast notifications
   - EmailJS (place keys)
*/

// ---------- helpers ----------
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- THEME ----------
const themeToggle = $('#themeToggle');
if(localStorage.getItem('theme') === 'light') document.body.classList.add('light');
updateThemeIcon();
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
  updateThemeIcon();
});
function updateThemeIcon(){ themeToggle.innerHTML = document.body.classList.contains('light') ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>'; }

// ---------- TYPEWRITER (fast) ----------
const phrases = ["Fast & Energetic Interfaces", "Web Developer • HTML + Python", "I build responsive UIs", "Let's build something!"];
let pIdx = 0, cIdx = 0;
const typeEl = $('#typewriter');
const T = { typeSpeed: 70, eraseSpeed: 40, pause: 800 };
function type(){
  const cur = phrases[pIdx];
  if(cIdx < cur.length){ typeEl.textContent += cur.charAt(cIdx++); typeEl.classList.add('caret'); setTimeout(type, T.typeSpeed); }
  else setTimeout(erase, T.pause);
}
function erase(){
  if(cIdx > 0){ typeEl.textContent = phrases[pIdx].substring(0, cIdx-1); cIdx--; setTimeout(erase, T.eraseSpeed); }
  else { pIdx = (pIdx + 1) % phrases.length; setTimeout(type, 300); }
}
document.addEventListener('DOMContentLoaded', () => setTimeout(type, 400));

// ---------- REVEAL ON SCROLL & SKILL BARS ----------
const revealEls = $$('.reveal');
const skillBars = $$('.skill-bar > div');
function onScrollReveal(){
  revealEls.forEach(el => {
    const r = el.getBoundingClientRect();
    if(r.top < window.innerHeight - 80) el.classList.add('visible');
  });
  skillBars.forEach(bar => {
    const parent = bar.closest('.skill');
    if(!parent) return;
    const r = parent.getBoundingClientRect();
    if(r.top < window.innerHeight - 80){
      const pct = bar.getAttribute('data-percent') || bar.dataset.percent;
      bar.style.width = pct + '%';
    }
  });
}
window.addEventListener('scroll', onScrollReveal);
window.addEventListener('load', onScrollReveal);

// ---------- PROJECT MODAL ----------
const modal = $('#project-modal');
const modalTitle = $('#modal-title');
const modalDesc = $('#modal-desc');
const modalImg = modal.querySelector('.modal-image img');
const modalLive = $('#modal-live');
const modalCode = $('#modal-code');
const openBtns = $$('.open-project');
openBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const art = e.target.closest('.project');
    openProjectModal(art);
  });
});
// Also preview button quick open with small animation
$$('.preview').forEach(b => b.addEventListener('click', (e)=>{
  const art = e.target.closest('.project');
  openProjectModal(art);
}));

function openProjectModal(art){
  if(!art) return;
  const title = art.dataset.title || art.querySelector('h3').innerText;
  const img = art.dataset.img || 'project-placeholder.jpg';
  const desc = art.dataset.desc || art.querySelector('p').innerText;
  const code = art.dataset.code || '#';
  const live = art.dataset.live || '#';
  modalTitle.textContent = title;
  modalDesc.textContent = desc;
  modalImg.src = img;
  modalLive.href = live;
  modalCode.href = code;
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}
$('.modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });
function closeModal(){ modal.classList.remove('show'); document.body.style.overflow = ''; }

// ---------- TOAST ----------
const toast = $('#toast');
function showToast(msg, time = 3000){
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(()=> toast.classList.remove('show'), time);
}

// ---------- EMAILJS CONTACT ----------
(function(){
  try { emailjs.init("YOUR_PUBLIC_KEY"); } catch(e){ console.warn('EmailJS not ready', e); }
})();
const form = $('#contact-form'), status = $('#form-status');
form.addEventListener('submit', (e)=>{
  e.preventDefault();
  status.textContent = 'Sending...';
  const params = { from_name: $('#name').value, from_email: $('#email').value, message: $('#message').value };
  emailjs.send('YOUR_SERVICE_ID','YOUR_TEMPLATE_ID', params).then(()=>{
    status.textContent = '✅ Sent! I will reply soon.';
    form.reset();
    showToast('Message sent successfully!');
    setTimeout(()=> status.textContent = '', 4000);
  }, (err)=>{
    console.error(err);
    status.textContent = '❌ Send failed.';
    showToast('Error sending message — check EmailJS keys.');
  });
});

// ---------- PARTICLES CANVAS (neon dots + connecting lines) ----------
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W = canvas.width = innerWidth;
let H = canvas.height = innerHeight;

window.addEventListener('resize', ()=>{ W = canvas.width = innerWidth; H = canvas.height = innerHeight; initParticles(); });

let particles = [];
function rand(min,max){ return Math.random()*(max-min)+min; }

function initParticles(){
  particles = [];
  const count = Math.floor((W*H)/80000) + 25; // scale with screen
  for(let i=0;i<count;i++){
    particles.push({
      x: rand(0,W),
      y: rand(0,H),
      vx: rand(-0.35,0.35),
      vy: rand(-0.35,0.35),
      r: rand(1,2.6),
      hue: rand(160,210),
      alpha: rand(0.4,0.95)
    });
  }
}
function updateParticles(){
  for(const p of particles){
    p.x += p.vx;
    p.y += p.vy;
    if(p.x < -10) p.x = W + 10;
    if(p.x > W + 10) p.x = -10;
    if(p.y < -10) p.y = H + 10;
    if(p.y > H + 10) p.y = -10;
  }
}
function draw(){
  ctx.clearRect(0,0,W,H);
  // draw lines
  for(let i=0;i<particles.length;i++){
    const a = particles[i];
    for(let j=i+1;j<particles.length;j++){
      const b = particles[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if(dist < 120){
        const op = 1 - dist/120;
        ctx.strokeStyle = `rgba(0,200,255,${op*0.12})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x,a.y);
        ctx.lineTo(b.x,b.y);
        ctx.stroke();
      }
    }
  }
  // draw dots
  for(const p of particles){
    ctx.beginPath();
    ctx.fillStyle = `rgba(0,255,209,${p.alpha})`;
    ctx.shadowColor = `rgba(0,255,209,0.18)`;
    ctx.shadowBlur = 8;
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function animate(){
  updateParticles();
  draw();
  requestAnimationFrame(animate);
}
initParticles();
animate();

// ---------- NAV LINK smooth behavior ----------
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const t = document.querySelector(a.getAttribute('href'));
    if(!t) return;
    e.preventDefault();
    t.scrollIntoView({behavior:'smooth', block:'start'});
  });
});
