/* ── GLOBALS ── */
let currentLang = 'de';
let weatherData = null;
let ALL_IMAGES =[]; // Wird jetzt automatisch befüllt!
let lbIdx = 0;

/* ── GALERIE AUTOMATIK (NEU) ── */
document.addEventListener('DOMContentLoaded', () => {
  const galleryItems = document.querySelectorAll('.gallery-item[data-image]');
  
  galleryItems.forEach((item, index) => {
    const imgUrl = item.getAttribute('data-image');
    
    // 1. Bild zur Lightbox-Liste hinzufügen
    ALL_IMAGES.push(imgUrl); 
    
    // 2. Hintergrundbild für die Box automatisch setzen
    const innerDiv = item.querySelector('.gallery-item-inner');
    if (innerDiv) {
      innerDiv.style.backgroundImage = `url('${imgUrl}')`;
    }
    
    // 3. Klick-Event für die Lightbox hinzufügen
    item.addEventListener('click', () => openLightbox(index));
  });
});

/* ── NAVBAR & STICKY ── */
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 60);
  const btn = document.getElementById('stickyCta');
  if (btn) {
    btn.style.opacity = window.scrollY > 300 ? '1' : '0';
    btn.style.pointerEvents = window.scrollY > 300 ? 'auto' : 'none';
  }
});

/* ── LANGUAGE SWITCHER ── */
function setLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('.lang-bar button').forEach(b => {
    b.classList.toggle('active', b.getAttribute('onclick').includes("'" + lang + "'"));
  });
  document.querySelectorAll('[data-lang]').forEach(el => {
    el.classList.toggle('active', el.dataset.lang === lang);
  });
  switchFormByIndex({de:0, it:1, en:2}[lang] ?? 0);
  renderWeatherWidget();
}

/* ── BOOKING TABS ── */
function switchFormByIndex(i) {
  document.querySelectorAll('.booking-tab').forEach((t, idx) => t.classList.toggle('active', idx === i));
  document.querySelectorAll('.form-panel').forEach((p, idx) => p.classList.toggle('active', idx === i));
}
document.querySelectorAll('.booking-tab').forEach((tab, i) => {
  tab.addEventListener('click', () => switchFormByIndex(i));
});

/* ── FAQ ── */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ── WETTER — vollständige WMO-Codes + 3-Tage Vorschau ── */
const WMO = {
  0:{i:'☀️',de:'Sonnig',it:'Soleggiato',en:'Sunny'},
  1:{i:'🌤️',de:'Überwiegend klar',it:'Per lo più sereno',en:'Mostly clear'},
  2:{i:'⛅',de:'Teilbewölkt',it:'Parzialmente nuvoloso',en:'Partly cloudy'},
  3:{i:'☁️',de:'Bedeckt',it:'Coperto',en:'Overcast'},
  45:{i:'🌫️',de:'Neblig',it:'Nebbioso',en:'Foggy'},
  48:{i:'🌫️',de:'Reifnebel',it:'Nebbia gelata',en:'Icy fog'},
  51:{i:'🌦️',de:'Leichter Niesel',it:'Pioggerella',en:'Light drizzle'},
  53:{i:'🌦️',de:'Nieselregen',it:'Pioggerella',en:'Drizzle'},
  55:{i:'🌦️',de:'Starker Niesel',it:'Pioggerella intensa',en:'Heavy drizzle'},
  61:{i:'🌧️',de:'Leichter Regen',it:'Pioggia leggera',en:'Light rain'},
  63:{i:'🌧️',de:'Regen',it:'Pioggia',en:'Rain'},
  65:{i:'🌧️',de:'Starker Regen',it:'Pioggia intensa',en:'Heavy rain'},
  71:{i:'❄️',de:'Leichter Schnee',it:'Neve leggera',en:'Light snow'},
  73:{i:'❄️',de:'Schnee',it:'Neve',en:'Snow'},
  75:{i:'❄️',de:'Starker Schnee',it:'Neve intensa',en:'Heavy snow'},
  80:{i:'🌦️',de:'Regenschauer',it:'Acquazzone',en:'Rain showers'},
  81:{i:'🌧️',de:'Kräftige Schauer',it:'Acquazzoni',en:'Heavy showers'},
  95:{i:'⛈️',de:'Gewitter',it:'Temporale',en:'Thunderstorm'},
  99:{i:'⛈️',de:'Gewitter m. Hagel',it:'Temporale con grandine',en:'Storm w. hail'}
};

const DAY_NAMES = {
  de:['So','Mo','Di','Mi','Do','Fr','Sa'],
  it:['Dom','Lun','Mar','Mer','Gio','Ven','Sab'],
  en:['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
};

function renderWeatherWidget() {
  const card = document.getElementById('weatherCard');
  if (!weatherData || !card) return;
  const cur = weatherData.current;
  const daily = weatherData.daily;
  const wmo = WMO[cur.weather_code] || WMO[3];
  const days = DAY_NAMES[currentLang];

  let forecastHTML = '';
  for (let i = 1; i <= 3; i++) {
    const date = new Date(daily.time[i]);
    const fw = WMO[daily.weather_code[i]] || WMO[3];
    forecastHTML += `
      <div class="w-day">
        <div class="w-day-name">${days[date.getDay()]}</div>
        <div class="w-day-icon">${fw.i}</div>
        <div class="w-day-temps">
          <span class="w-day-max">${Math.round(daily.temperature_2m_max[i])}°</span>
          <span class="w-day-min">${Math.round(daily.temperature_2m_min[i])}°</span>
        </div>
      </div>`;
  }

  card.innerHTML = `
    <div class="weather-current">
      <div class="w-main">
        <span class="w-icon">${wmo.i}</span>
        <span class="w-temp">${Math.round(cur.temperature_2m)}°</span>
      </div>
      <div class="w-desc">${wmo[currentLang]}</div>
      <div class="w-details">
        <div class="w-detail">💧 ${cur.relative_humidity_2m}%</div>
        <div class="w-detail">💨 ${Math.round(cur.wind_speed_10m)} km/h</div>
        <div class="w-detail">📍 550 m</div>
      </div>
    </div>
    <div class="weather-forecast">${forecastHTML}</div>`;
}

async function loadWeather() {
  try {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=45.6494&longitude=10.8583'
      + '&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code'
      + '&daily=temperature_2m_max,temperature_2m_min,weather_code'
      + '&timezone=Europe%2FRome&forecast_days=4&wind_speed_unit=kmh';
    const resp = await fetch(url);
    weatherData = await resp.json();
    renderWeatherWidget();
  } catch(e) {
    const card = document.getElementById('weatherCard');
    if (card) card.innerHTML = '<div class="w-error">⚠️ Wetter nicht verfügbar</div>';
  }
}

/* ── PREIS-SYNC aus Google Sheets (1x täglich) ── */
async function syncPrices() {
  const SHEETS_CSV = 'https://docs.google.com/spreadsheets/d/1_XwA9VM0e-B3kBIvmrO6ObXSHnLvca0BzftrhKctwas/export?format=csv&gid=0';
  const KEY = 'szn_prices_v1';
  const TTL = 24 * 60 * 60 * 1000;

  function applyRows(rows) {
    // Basispreis (keine Datumsspalte)
    const base = rows.find(r => !r[1] || r[1] === '');
    if (base) {
      const baseTd = document.querySelector('.base-row .price-tag strong');
      if (baseTd) { const v = base[3].replace(/[^0-9]/g,''); if (v) baseTd.textContent = v + ' €'; }
    }
    // Saisonpreise
    const seasons = rows.filter(r => r[1] && r[1] !== '');
    const tags = document.querySelectorAll('.price-table tbody tr:not(.base-row) .price-tag');
    seasons.forEach((row, i) => {
      if (tags[i]) { const v = row[3].replace(/[^0-9]/g,''); if (v) tags[i].textContent = v + ' €'; }
    });
    // Status-Anzeige
    const dot = document.getElementById('syncDot');
    const txt = document.getElementById('syncText');
    if (dot) { dot.classList.remove('loading'); dot.classList.add('synced'); }
    if (txt) {
      const d = new Date().toLocaleDateString(currentLang === 'en' ? 'en-GB' : currentLang === 'it' ? 'it-IT' : 'de-DE');
      const m = { de: 'Preise aktualisiert: ' + d, it: 'Prezzi aggiornati: ' + d, en: 'Prices updated: ' + d };
      txt.textContent = m[currentLang] || m.de;
    }
  }

  // Cache prüfen
  try {
    const cached = sessionStorage.getItem(KEY);
    if (cached) {
      const { ts, rows } = JSON.parse(cached);
      if (Date.now() - ts < TTL) { applyRows(rows); return; }
    }
  } catch(e) {}

  // Fetch
  try {
    const res = await fetch(SHEETS_CSV);
    const csv = await res.text();
    const rows = csv.trim().split('\n').slice(1)
      .filter(l => l.trim())
      .map(l => l.split(',').map(c => c.replace(/^"|"$/g,'').trim()))
      .filter(c => c[0] && c[3]);
    if (rows.length) {
      try { sessionStorage.setItem(KEY, JSON.stringify({ ts: Date.now(), rows })); } catch(e) {}
      applyRows(rows);
    }
  } catch(e) {
    const dot = document.getElementById('syncDot');
    const txt = document.getElementById('syncText');
    if (dot) dot.classList.remove('loading');
    if (txt) {
      const m = { de: 'Preise statisch', it: 'Prezzi statici', en: 'Prices static' };
      txt.textContent = m[currentLang] || m.de;
    }
  }
}

/* ── LIGHTBOX ── */
function openLightbox(index) {
  lbIdx = index;
  updateLightbox();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = 'auto';
}

function updateLightbox() {
  document.getElementById('lbImg').src = ALL_IMAGES[lbIdx];
  document.getElementById('lbCounter').textContent = (lbIdx + 1) + ' / ' + ALL_IMAGES.length;
}

document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.getElementById('lbNext').addEventListener('click', () => {
  lbIdx = (lbIdx + 1) % ALL_IMAGES.length;
  updateLightbox();
});
document.getElementById('lbPrev').addEventListener('click', () => {
  lbIdx = (lbIdx - 1 + ALL_IMAGES.length) % ALL_IMAGES.length;
  updateLightbox();
});
document.getElementById('lightbox').addEventListener('click', e => {
  if (e.target.id === 'lightbox') closeLightbox();
});

// Tastatur: Pfeiltasten + Escape
document.addEventListener('keydown', e => {
  if (!document.getElementById('lightbox').classList.contains('open')) return;
  if (e.key === 'ArrowRight') { lbIdx = (lbIdx + 1) % ALL_IMAGES.length; updateLightbox(); }
  if (e.key === 'ArrowLeft')  { lbIdx = (lbIdx - 1 + ALL_IMAGES.length) % ALL_IMAGES.length; updateLightbox(); }
  if (e.key === 'Escape') closeLightbox();
});

// Wischen auf Mobilgeräten
let touchStartX = 0;
document.getElementById('lightbox').addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });
document.getElementById('lightbox').addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].screenX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) { lbIdx = (lbIdx + 1) % ALL_IMAGES.length; }
    else          { lbIdx = (lbIdx - 1 + ALL_IMAGES.length) % ALL_IMAGES.length; }
    updateLightbox();
  }
}, { passive: true });

/* ── INIT ── */
loadWeather();
syncPrices();
