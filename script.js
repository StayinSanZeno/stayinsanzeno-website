/* ── GLOBALS ── */
let currentLang = 'de';
let weatherData = null;
let ALL_IMAGES =[]; 
let lbIdx = 0;

/* ── INITIALISIERUNG (Bilder & Sprache) ── */
document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Gespeicherte Sprache abrufen (Memory-Funktion)
  const savedLang = localStorage.getItem('preferredLang') || 'de';
  setLang(savedLang);

  // 2. Hero-Bild auf der Startseite automatisch setzen
  const heroPhoto = document.querySelector('.hero-photo[data-image]');
  if (heroPhoto) {
    heroPhoto.style.backgroundImage = `url('${heroPhoto.getAttribute('data-image')}')`;
  }

  // 3. Hero-Bild auf der Aktivitäten-Seite automatisch setzen
  const pageHeroPhoto = document.querySelector('.page-hero-photo[data-image]');
  if (pageHeroPhoto) {
    pageHeroPhoto.style.backgroundImage = `url('${pageHeroPhoto.getAttribute('data-image')}')`;
  }

  // 4. Galerie automatisch aufbauen
  const galleryItems = document.querySelectorAll('.gallery-item[data-image]');
  galleryItems.forEach((item, index) => {
    const imgUrl = item.getAttribute('data-image');
    ALL_IMAGES.push(imgUrl); 
    
    const innerDiv = item.querySelector('.gallery-item-inner');
    if (innerDiv) {
      innerDiv.style.backgroundImage = `url('${imgUrl}')`;
    }
    item.addEventListener('click', () => openLightbox(index));
  });

  // 5. INFO POPUP (Renovierung)
  const popup = document.getElementById('infoPopup');
  const closeBtns = document.querySelectorAll('#closePopupBtn, #closePopupBtn2');
  
  if (popup) {
    // Prüfen, ob das Popup in dieser Sitzung schon gezeigt wurde
    if (!sessionStorage.getItem('renovationPopupShown')) {
      // Kleine Verzögerung (1 Sekunde), damit es elegant einfliegt
      setTimeout(() => {
        popup.classList.add('show');
      }, 1000);
    }

    // Funktion zum Schließen und Speichern
    const closePopup = () => {
      popup.classList.remove('show');
      sessionStorage.setItem('renovationPopupShown', 'true'); // Merkt sich, dass es weggeklickt wurde
    };

    // Klick auf das X oder den "Verstanden" Button
    closeBtns.forEach(btn => btn.addEventListener('click', closePopup));
    
    // Klick auf den dunklen Hintergrund schließt das Popup ebenfalls
    popup.addEventListener('click', (e) => {
      if (e.target === popup) closePopup();
    });
  }
  
});

/* ── NAVBAR & STICKY ── */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
  
  const btn = document.getElementById('stickyCta');
  if (btn) {
    btn.style.opacity = window.scrollY > 300 ? '1' : '0';
    btn.style.pointerEvents = window.scrollY > 300 ? 'auto' : 'none';
  }
});

/* ── LANGUAGE SWITCHER (Mit Memory) ── */
function setLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  
  // Sprache im Browser speichern
  localStorage.setItem('preferredLang', lang);

  // Buttons in der Leiste anpassen
  document.querySelectorAll('.lang-bar button').forEach(b => {
    b.classList.toggle('active', b.textContent.toLowerCase() === lang);
  });

  // Texte auf der Seite umschalten
  document.querySelectorAll('[data-lang]').forEach(el => {
    el.classList.toggle('active', el.dataset.lang === lang);
  });
  
  // Formular und Wetter aktualisieren
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

/* ── PREIS-SYNC aus Google Sheets (Additions-Logik) ── */
async function syncPrices() {
  const SHEETS_CSV = 'https://docs.google.com/spreadsheets/d/1_XwA9VM0e-B3kBIvmrO6ObXSHnLvca0BzftrhKctwas/export?format=csv&gid=0';
  const KEY = 'szn_prices_v3'; 
  const TTL = 24 * 60 * 60 * 1000;

  function applyRows(rows) {
    if (rows.length < 4) return; 

    // Hilfsfunktion: Holt die Zahl aus der Preis-Spalte
    const getVal = (row) => row && row[3] ? parseInt(row[3].replace(/[^0-9]/g, ''), 10) : 0;
    
    // NEU: Hilfsfunktion: Holt Start- und Enddatum und verbindet sie
    const getDate = (row) => {
      if (!row) return '';
      if (row[1] && row[2]) return `${row[1]} – ${row[2]}`; // Spalte B und C verbinden
      return row[1] || ''; // Falls nur Spalte B existiert
    };

    const baseVal       = getVal(rows[0]); 
    const summerAdd     = getVal(rows[1]); 
    const ferragostoAdd = getVal(rows[2]); 
    const xmasAdd       = getVal(rows[3]); 
    const extraPerson   = rows.length > 4 ? getVal(rows[4]) : 30; 

    const summerTotal     = baseVal + summerAdd;               
    const ferragostoTotal = baseVal + summerAdd + ferragostoAdd; 
    const xmasTotal       = baseVal + xmasAdd;                 

    // DATUM auslesen (jetzt mit der neuen Funktion)
    const dateSummer     = getDate(rows[1]);
    const dateFerragosto = getDate(rows[2]);
    const dateXmas       = getDate(rows[3]);

    const elBase = document.getElementById('price-base');
    const elSummer = document.getElementById('price-summer');
    const elFerragosto = document.getElementById('price-ferragosto');
    const elXmas = document.getElementById('price-xmas');

    if (elBase && baseVal) elBase.innerHTML = `<strong>${baseVal} €</strong>`;
    if (elSummer && summerTotal) elSummer.textContent = `${summerTotal} €`;
    if (elFerragosto && ferragostoTotal) elFerragosto.textContent = `${ferragostoTotal} €`;
    if (elXmas && xmasTotal) elXmas.textContent = `${xmasTotal} €`;

    const elDateSummer = document.getElementById('date-summer');
    const elDateFerragosto = document.getElementById('date-ferragosto');
    const elDateXmas = document.getElementById('date-xmas');

    if (elDateSummer && dateSummer) elDateSummer.textContent = dateSummer;
    if (elDateFerragosto && dateFerragosto) elDateFerragosto.textContent = dateFerragosto;
    if (elDateXmas && dateXmas) elDateXmas.textContent = dateXmas;

    document.querySelectorAll('.price-extra').forEach(el => {
      if (extraPerson) el.textContent = extraPerson;
    });

    const dot = document.getElementById('syncDot');
    const txt = document.getElementById('syncText');
    if (dot) { dot.classList.remove('loading'); dot.classList.add('synced'); }
    if (txt) {
      const d = new Date().toLocaleDateString(currentLang === 'en' ? 'en-GB' : currentLang === 'it' ? 'it-IT' : 'de-DE');
      const m = { de: 'Preise aktualisiert: ' + d, it: 'Prezzi aggiornati: ' + d, en: 'Prices updated: ' + d };
      txt.textContent = m[currentLang] || m.de;
    }
  }

  try {
    const cached = sessionStorage.getItem(KEY);
    if (cached) {
      const { ts, rows } = JSON.parse(cached);
      if (Date.now() - ts < TTL) { applyRows(rows); return; }
    }
  } catch(e) {}

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

/* ── LIGHTBOX (Absturzsicher) ── */
function openLightbox(index) {
  lbIdx = index;
  updateLightbox();
  const lb = document.getElementById('lightbox');
  if (lb) {
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) {
    lb.classList.remove('open');
    document.body.style.overflow = 'auto';
  }
}

function updateLightbox() {
  const lbImg = document.getElementById('lbImg');
  const lbCounter = document.getElementById('lbCounter');
  if (lbImg) lbImg.src = ALL_IMAGES[lbIdx];
  if (lbCounter) lbCounter.textContent = (lbIdx + 1) + ' / ' + ALL_IMAGES.length;
}

// Event Listener sicher hinzufügen
const btnClose = document.getElementById('lbClose');
const btnNext = document.getElementById('lbNext');
const btnPrev = document.getElementById('lbPrev');
const lbElement = document.getElementById('lightbox');

if (btnClose) btnClose.addEventListener('click', closeLightbox);
if (btnNext) btnNext.addEventListener('click', () => {
  lbIdx = (lbIdx + 1) % ALL_IMAGES.length;
  updateLightbox();
});
if (btnPrev) btnPrev.addEventListener('click', () => {
  lbIdx = (lbIdx - 1 + ALL_IMAGES.length) % ALL_IMAGES.length;
  updateLightbox();
});
if (lbElement) {
  lbElement.addEventListener('click', e => {
    if (e.target.id === 'lightbox') closeLightbox();
  });
  
  // Wischen auf Mobilgeräten (sicher eingebunden)
  let touchStartX = 0;
  lbElement.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  lbElement.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) { lbIdx = (lbIdx + 1) % ALL_IMAGES.length; }
      else          { lbIdx = (lbIdx - 1 + ALL_IMAGES.length) % ALL_IMAGES.length; }
      updateLightbox();
    }
  }, { passive: true });
}

document.addEventListener('keydown', e => {
  if (!lbElement || !lbElement.classList.contains('open')) return;
  if (e.key === 'ArrowRight') { lbIdx = (lbIdx + 1) % ALL_IMAGES.length; updateLightbox(); }
  if (e.key === 'ArrowLeft')  { lbIdx = (lbIdx - 1 + ALL_IMAGES.length) % ALL_IMAGES.length; updateLightbox(); }
  if (e.key === 'Escape') closeLightbox();
});

/* ── INIT ── */
loadWeather();
syncPrices();
