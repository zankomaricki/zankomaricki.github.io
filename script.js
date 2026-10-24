const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduce) document.documentElement.classList.add('anim');const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

// Naslov: črke se dvignejo ena za drugo
$$('.split').forEach((el, li) => {
  const text = el.textContent;
  el.textContent = '';
  [...text].forEach((c, i) => {
    const s = document.createElement('span');
    s.className = 'ch';
    s.textContent = c;
    s.style.animationDelay = `${0.15 + li * 0.25 + i * 0.045}s`;
    el.appendChild(s);
  });
});

// Vloge, ki se menjajo
// Jezik strani: 'sl' (izvirnik) ali 'en' (prevod iz i18n.js)
let lang = 'sl';
try { if (localStorage.getItem('lang') === 'en') lang = 'en'; } catch (e) {}
const t = s => (lang === 'en' && window.EN && EN[s]) || s;

const rolesSl = ['športnik', 'študent fizioterapije', 'bodybuilder v pripravah', 'bodoči osebni trener', 'bodoči maser'];
const roles = () => (lang === 'en' && window.EN_ROLES) || rolesSl;
const word = $('.role-word');
let ri = 0;
if (!reduce) setInterval(() => {
  word.classList.add('out');
  setTimeout(() => {
    ri = (ri + 1) % roles().length;
    word.textContent = roles()[ri];
    word.classList.remove('out');
    word.classList.add('in');
    requestAnimationFrame(() => requestAnimationFrame(() => word.classList.remove('in')));
  }, 450);
}, 2600);

// Navigacija
const nav = $('.nav'), burger = $('.burger'), menu = $('#meni');
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
$$('#meni a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('open');
  burger.setAttribute('aria-expanded', false);
  document.body.style.overflow = '';
}));

// Pomikanje: napredek, nav ozadje, paralaksa
const progress = $('.progress');
const parallax = $$('.parallax');
function onScroll() {
  const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
  nav.classList.toggle('scrolled', y > 40);
  if (!reduce) parallax.forEach(img => {
    img.style.transform = `translateY(${-y * parseFloat(img.dataset.speed)}px)`;
  });
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Aktivna povezava v meniju
// vsaka sekcija pripada poglavju (O meni, Fitnes, Delo), ki je pred njo
const links = $$('.nav-links a[href^="#"]');
let chapter = '';
const chapterOf = new Map();
$$('main section[id]').forEach(s => {
  if (s.classList.contains('chapter') || s.id === 'kontakt' || s.id === 'domov' || s.id === 'delo') chapter = s.id;
  chapterOf.set(s, chapter);
});
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + chapterOf.get(e.target)));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
chapterOf.forEach((_, s) => spy.observe(s));

// Števci
function countUp(el) {
  const end = parseFloat(el.dataset.count), dec = +(el.dataset.decimals || 0);
  const t0 = performance.now(), dur = reduce ? 1 : 1600;
  const fmt = v => v.toFixed(dec).replace('.', ',');
  (function tick(t) {
    const p = Math.min((t - t0) / dur, 1);
    el.textContent = fmt(end * (1 - Math.pow(1 - p, 4)));
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}

// Pojavljanje elementov
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const siblings = el.parentElement ? $$(':scope > .reveal, :scope > figure', el.parentElement) : [];
    const idx = Math.max(0, siblings.indexOf(el));
    el.style.transitionDelay = `${Math.min(idx, 6) * 0.08}s`;
    el.classList.add('visible');
    $$('[data-count]', el).forEach(countUp);
    if (el.matches('.bar') || el.querySelector('.bar')) $$('.bar', el).forEach(b => $('i', b).style.width = b.dataset.level + '%');
    if (el.matches('.ring')) $('.fg', el).style.strokeDashoffset = 327 * (1 - el.dataset.level / 100);
    io.unobserve(el);
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
$$('.reveal, .reveal-img, .masonry figure').forEach(el => io.observe(el));

// Primerjava poz
$$('.compare').forEach(compare => {
  const range = $('input', compare), top = $('.compare-top', compare), handle = $('.compare-handle', compare);
  const set = v => { top.style.clipPath = `inset(0 ${100 - v}% 0 0)`; handle.style.left = v + '%'; };
  range.addEventListener('input', () => set(range.value));
  set(50);
});

// Odštevalnik do konca priprav
const cd = $('.countdown');
if (cd) {
  const target = new Date(cd.dataset.target).getTime();
  const pad = (n, l = 2) => String(n).padStart(l, '0');
  const tick = () => {
    let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
    const d = Math.floor(s / 86400); s %= 86400;
    const h = Math.floor(s / 3600); s %= 3600;
    const m = Math.floor(s / 60); s %= 60;
    $('[data-cd="d"]', cd).textContent = pad(d, 3);
    $('[data-cd="h"]', cd).textContent = pad(h);
    $('[data-cd="m"]', cd).textContent = pad(m);
    $('[data-cd="s"]', cd).textContent = pad(s);
  };
  tick();
  setInterval(tick, 1000);
}

// Graf teže (tedenska povprečja iz check-in skripte)
const weights = [
  ['15. 6.', 83.19], ['22. 6.', 82.37], ['29. 6.', 81.65], ['6. 7.', 80.71], ['13. 7.', 79.4], ['20. 7.', 77.93],
  ['27. 7.', 76.68], ['3. 8.', 76.15], ['10. 8.', 75.1], ['17. 8.', 74.56], ['24. 8.', 74.98], ['31. 8.', 75.85],
  ['7. 9.', 75.08], ['14. 9.', 74.0], ['21. 9.', 75.69], ['28. 9.', 76.29], ['5. 10.', 76.57], ['12. 10.', 77.3]
];
const chart = $('#weightChart');
if (chart) {
  const W = 600, H = 260, pl = 34, pr = 14, pt = 24, pb = 30;
  const min = 73, max = 84;
  const x = i => pl + i * (W - pl - pr) / (weights.length - 1);
  const y = v => pt + (max - v) * (H - pt - pb) / (max - min);
  const pts = weights.map(([, v], i) => [x(i), y(v)]);
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const fmt = v => v.toFixed(1).replace('.', ',');
  let grid = '', axis = '';
  for (let v = 74; v <= 84; v += 2) {
    grid += `<line x1="${pl}" x2="${W - pr}" y1="${y(v)}" y2="${y(v)}"/>`;
    axis += `<text x="${pl - 8}" y="${y(v) + 3}" text-anchor="end">${v}</text>`;
  }
  weights.forEach(([lbl], i) => { if (i % 3 === 0 || i === weights.length - 1) axis += `<text x="${x(i)}" y="${H - 8}" text-anchor="middle">${lbl}</text>`; });
  const iMin = 13, last = weights.length - 1;
  chart.innerHTML = `<svg viewBox="0 0 ${W} ${H}">
    <g class="grid">${grid}</g><g class="axis">${axis}</g>
    <path class="area" d="${d} L${x(last)} ${H - pb} L${x(0)} ${H - pb} Z"/>
    <path class="line" d="${d}"/>
    ${pts.map((p, i) => `<circle class="pt" cx="${p[0]}" cy="${p[1]}" r="4"><title>${weights[i][0]} 2026: ${fmt(weights[i][1])} kg</title></circle>`).join('')}
    <text class="lbl" x="${x(0) + 8}" y="${y(weights[0][1]) - 10}">${fmt(weights[0][1])} kg</text>
    <text class="lbl" x="${x(iMin)}" y="${y(weights[iMin][1]) + 22}" text-anchor="middle">${fmt(weights[iMin][1])} kg</text>
    <text class="lbl" x="${x(last)}" y="${y(weights[last][1]) - 12}" text-anchor="end">${fmt(weights[last][1])} kg</text>
  </svg>`;
  const line = $('.line', chart);
  chart.style.setProperty('--len', Math.ceil(line.getTotalLength()));
  new IntersectionObserver((es, o) => es.forEach(e => {
    if (e.isIntersecting) { chart.classList.add('drawn'); o.disconnect(); }
  }), { threshold: 0.4 }).observe(chart);
}

// Jedilniki (iz trenutne faze, 12. 10. 2026)
const days = {
  trening: { kcal: 2489, oh: 336, p: 182, f: 45, meals: [
    ['Obrok 1', 629, 55, 19, 55, [['Ovseni kosmiči', '60 g'], ['Whey protein', '50 g'], ['Arašidovo maslo', '25 g'], ['Borovnice', '80 g']]],
    ['Obrok 2', 513, 63, 11, 44, [['Beli riž', '50 g'], ['Piščančja prsa', '150 g'], ['Poljubna zelenjava', '150 g'], ['Olivno olje', '5 g'], ['Ananas', '100 g']]],
    ['Pre workout', 642, 101, 10, 38, [['Beli riž', '105 g'], ['Whey protein', '30 g'], ['Arašidovo maslo', '15 g'], ['Banana', '60 g']]],
    ['Intra drink', 76, 19, 0, 0, [['Maltodextrin', '20 g']]],
    ['Post workout', 629, 98, 5, 45, [['Čokoladni kosmiči', '100 g'], ['Whey protein', '45 g'], ['Ananas', '100 g']]]
  ] },
  rest: { kcal: 2053, oh: 218, p: 178, f: 53, meals: [
    ['Obrok 1', 478, 47, 16, 37, [['Ovseni kosmiči', '50 g'], ['Whey protein', '30 g'], ['Arašidovo maslo', '20 g'], ['Borovnice', '80 g']]],
    ['Obrok 2', 472, 54, 11, 43, [['Beli riž', '55 g'], ['Piščančja prsa', '150 g'], ['Poljubna zelenjava', '150 g'], ['Olivno olje', '5 g']]],
    ['Obrok 3', 472, 54, 11, 43, [['Beli riž', '55 g'], ['Piščančja prsa', '150 g'], ['Poljubna zelenjava', '150 g'], ['Olivno olje', '5 g']]],
    ['Obrok 4', 407, 42, 15, 24, [['Jajca M', '2 kos'], ['Jajčni beljaki', '50 ml'], ['Beli kruh', '70 g'], ['Poljubna zelenjava', '100 g']]],
    ['Obrok 5', 224, 21, 0, 31, [['Grški jogurt 0 %', '275 g'], ['Ananas', '100 g']]]
  ] }
};
const food = $('#prehrana');
function showDay(key) {
  const day = days[key];
  food.dataset.day = key;
  $('#kcal').textContent = day.kcal;
  $('#m-oh').textContent = day.oh + ' g';
  $('#m-p').textContent = day.p + ' g';
  $('#m-f').textContent = day.f + ' g';
  const C = 2 * Math.PI * 48, parts = [day.oh * 4, day.p * 4, day.f * 9], tot = parts.reduce((a, b) => a + b);
  let off = 0;
  ['.d-oh', '.d-p', '.d-f'].forEach((sel, i) => {
    const len = C * parts[i] / tot;
    const seg = $(sel, food);
    seg.style.strokeDasharray = `${Math.max(len - 3, 0)} ${C}`;
    seg.style.strokeDashoffset = -off;
    off += len;
  });
  const [lc, lp, lf] = lang === 'en' ? ['C', 'P', 'F'] : ['OH', 'B', 'M'];
  $('#meals').innerHTML = day.meals.map(([name, kcal, oh, f, p, items], i) => `
    <article class="meal" style="animation-delay:${i * 0.07}s">
      <div class="meal-head"><h4>${t(name)}</h4><span>${kcal} kcal</span></div>
      <ul>${items.map(([n, q]) => `<li>${t(n)}<b>${t(q)}</b></li>`).join('')}</ul>
      <div class="meal-macros"><span>${lc} ${oh} g</span><span>${lp} ${p} g</span><span>${lf} ${f} g</span></div>
    </article>`).join('');
}
if (food) {
  $$('.food-tabs button').forEach(btn => btn.addEventListener('click', () => {
    $$('.food-tabs button').forEach(b => { b.classList.toggle('active', b === btn); b.setAttribute('aria-selected', b === btn); });
    showDay(btn.dataset.day);
  }));
  new IntersectionObserver((es, o) => es.forEach(e => {
    if (e.isIntersecting) { showDay('trening'); o.disconnect(); }
  }), { threshold: 0.2 }).observe(food);
}

// Videi: skrij manjkajoče, predvajaj, ko so vidni
const vSection = $('#videi');
if (vSection) {
  const cards = $$('.v-card', vSection);
  const check = () => vSection.classList.toggle('empty', cards.every(c => c.classList.contains('broken')));
  cards.forEach(card => {
    const v = $('video', card);
    v.addEventListener('error', () => { card.classList.add('broken'); check(); });
    card.addEventListener('click', () => {
      v.muted = !v.muted;
      $('.v-sound', card).textContent = v.muted ? '🔇' : '🔊';
      if (!v.muted) $$('video', vSection).forEach(o => { if (o !== v && !o.muted) { o.muted = true; $('.v-sound', o.parentElement).textContent = '🔇'; } });
    });
  });
  const vio = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target;
    if (e.isIntersecting) v.play().catch(() => {}); else v.pause();
  }), { threshold: 0.5 });
  $$('video', vSection).forEach(v => vio.observe(v));
}

// Animiran klepet: obiskovalec piše, Žan odgovori, nato se ponovi
const chatScripts = {
  wa: [['me', 'Živjo Žan! 👋'], ['me', 'Zanima me osebni trening.'], ['zan', 'Živjo! Z veseljem 💪'], ['zan', 'Piši mi kar tukaj na WhatsApp.']],
  tg: [['me', 'Hej, imaš minutko?'], ['me', 'Kakšen je tvoj jedilnik na trening dan?'], ['zan', 'Seveda 🙌'], ['zan', 'Piši mi na Telegram, pa ti pošljem.']]
};
const wait = ms => new Promise(r => setTimeout(r, ms));
function bubble(body, who, html) {
  const el = document.createElement('span');
  el.className = 'msg ' + who;
  el.innerHTML = html;
  body.appendChild(el);
  return el;
}
async function playChat(chat) {
  const body = $('.chat-body', chat);
  const script = () => ((lang === 'en' && window.EN_CHATS) || chatScripts)[chat.dataset.chat];
  if (reduce) { script().forEach(([who, txt]) => bubble(body, who, txt)); return; }
  for (;;) {
    const lines = script();
    body.innerHTML = '';
    await wait(600);
    for (const [who, txt] of lines) {
      const dots = bubble(body, who + ' typing', '<i></i><i></i><i></i>');
      await wait(900 + txt.length * 28);
      dots.remove();
      bubble(body, who, txt);
      await wait(700);
    }
    await wait(3500);
  }
}
$$('.chat').forEach((chat, i) => {
  new IntersectionObserver((es, o) => es.forEach(e => {
    if (e.isIntersecting) { setTimeout(() => playChat(chat), i * 1400); o.disconnect(); }
  }), { threshold: 0.3 }).observe(chat);
});

// Preklop jezika: zamenja vsa statična besedila, dinamični deli berejo `lang`
const originals = new Map();
function textNodes() {
  const out = [], w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: n => n.parentElement.closest('script,style,.chat-body,#meals,.role-word,.split') || !n.nodeValue.trim() ? 2 : 1
  });
  let n;
  while ((n = w.nextNode())) out.push(n);
  return out;
}
function applyLang() {
  textNodes().forEach(n => {
    if (!originals.has(n)) originals.set(n, n.nodeValue);
    const orig = originals.get(n), key = orig.trim().replace(/\s+/g, ' ');
    const tr = lang === 'en' && EN[key];
    n.nodeValue = tr ? orig.replace(orig.trim(), tr) : orig;
  });
  document.documentElement.lang = lang;
  const btn = $('.lang-btn');
  btn.textContent = lang === 'en' ? 'SLO' : 'EN';
  btn.setAttribute('aria-label', lang === 'en' ? 'Preklopi v slovenščino' : 'Switch to English');
  word.textContent = roles()[ri % roles().length];
  const wa = $('.chat[data-chat="wa"]');
  if (wa) wa.href = 'https://wa.me/38651486275?text=' + encodeURIComponent(lang === 'en' ? 'Hi Žan!' : 'Živjo Žan!');
  if (food && food.dataset.day) showDay(food.dataset.day);
  $$('.chat-body').forEach(b => { if (reduce) { b.innerHTML = ''; script(b); } });
}
function script(body) {
  const chat = body.closest('.chat');
  ((lang === 'en' && window.EN_CHATS) || chatScripts)[chat.dataset.chat].forEach(([who, txt]) => bubble(body, who, txt));
}
$('.lang-btn').addEventListener('click', () => {
  lang = lang === 'en' ? 'sl' : 'en';
  try { localStorage.setItem('lang', lang); } catch (e) {}
  applyLang();
});
if (lang === 'en') applyLang();

// Filtri galerije
const figures = $$('.masonry figure');
$$('.filters button').forEach(btn => btn.addEventListener('click', () => {
  $$('.filters button').forEach(b => b.classList.toggle('active', b === btn));
  const f = btn.dataset.filter;
  figures.forEach((fig, i) => {
    const show = f === 'vse' || fig.dataset.cat === f;
    fig.classList.toggle('hide', !show);
    if (show) {
      fig.classList.remove('visible');
      fig.style.transitionDelay = `${(i % 8) * 0.04}s`;
      requestAnimationFrame(() => requestAnimationFrame(() => fig.classList.add('visible')));
    }
  });
}));

// Lightbox
const lb = $('.lightbox'), lbImg = $('img', lb);
let current = 0;
const visibleFigs = () => figures.filter(f => !f.classList.contains('hide'));
function openLb(i) {
  const list = visibleFigs();
  current = (i + list.length) % list.length;
  const img = $('img', list[current]);
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lb.hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeLb() { lb.hidden = true; document.body.style.overflow = ''; }
figures.forEach(fig => fig.addEventListener('click', () => openLb(visibleFigs().indexOf(fig))));
$('.lb-close').addEventListener('click', closeLb);
$('.lb-prev').addEventListener('click', e => { e.stopPropagation(); openLb(current - 1); });
$('.lb-next').addEventListener('click', e => { e.stopPropagation(); openLb(current + 1); });
lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
addEventListener('keydown', e => {
  if (lb.hidden) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowLeft') openLb(current - 1);
  if (e.key === 'ArrowRight') openLb(current + 1);
});
