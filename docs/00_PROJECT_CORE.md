# Stay in San Zeno — Project Core

## Zweck
Diese Datei ist die verbindliche gemeinsame Wissensbasis für alle KI-Arbeitsbereiche des Projekts.
Bei Widersprüchen gilt die neueste bestätigte Information in PROJECT_CONFIG bzw. in den aktuellen Quelldateien.

## Projekt
- Marke: Stay in San Zeno
- Unterkunft: Ferienwohnung / touristische Kurzzeitvermietung
- Ort: San Zeno di Montagna (VR), Italien
- Website: https://stayinsanzeno.com
- E-Mail: stayinsanzeno@gmail.com
- Instagram: @stayinsanzeno
- Sprachen: Deutsch, Italienisch, Englisch

## Positionierung
Leitidee:
- DE: San Zeno di Montagna – Wo die Berge den See berühren.
- IT: Dove le montagne abbracciano il lago.
- EN: Where the mountains meet the lake.

Kernwerte:
- authentisch
- hochwertig
- ruhig
- naturverbunden
- persönlich
- modern
- unkompliziert
- lokal

Wichtig: Keine falschen Erwartungen erzeugen. Kein uneingeschränkter direkter Seeblick versprechen.
Der kleine Balkon bietet hauptsächlich Dorf- und Bergblick; Teilseeblick nur dort kommunizieren, wo er tatsächlich vorhanden ist.

## Unterkunft
- 2 Schlafzimmer
- Wohnküche
- Schlafcouch
- 1 Bad
- kleiner Balkon
- Standardkapazität bis 5 Gäste
- 6. Gast nur nach aktueller Vermarktungs-/Buchungsregel
- Küche, Backofen, Herd, Kühlschrank, Geschirrspüler
- Kaffeemaschine, Wasserkocher
- Waschmaschine
- Klima / Heizen
- WLAN
- Babybett auf Anfrage
- Self-Check-in
- Parkplatz in der Nähe
- Haustiere nicht gestattet

## Zielgruppen
Primär:
1. Deutschland
2. Italien
3. internationale / englischsprachige Gäste

Typische Segmente:
- Paare
- Familien
- Freunde
- Wanderer
- Radfahrer
- Natur- und Aktivurlauber
- Gäste, die Gardasee und Monte Baldo verbinden möchten

## Vertrieb
Kanäle:
- Direktbuchung über Website
- Booking.com
- perspektivisch Airbnb
- Instagram
- organische Suche / Google

Strategisches Ziel:
Nicht maximale Auslastung um jeden Preis, sondern hoher Nettoertrag bei vertretbarem Aufwand und guter Gästequalität.

## Website
Technik:
- HTML5
- CSS3
- Vanilla JavaScript ES6+
- GitHub-basiertes Repository
- keine unnötigen Frameworks
- Mobile First
- zentrale style.css
- zentrale script.js
- data-lang für DE/IT/EN
- localStorage für Sprachpersistenz
- dynamische Preise aus Google Sheets
- Google Calendar für Verfügbarkeit
- Google Forms für Anfragen

Wichtige Seiten:
- index.html
- activities.html
- welcome.html
- info.html
- impressum.html

## Backend
Google-Ökosystem:
- Apps Script
- Forms
- Sheets
- Calendar
- Gmail
- Drive

Sollprozess:
Anfrage → Validierung → Preis → Verfügbarkeit → Anfrage-Mail → Kalender → manuelle Entscheidung →
Bestätigung/Absage → Zahlungsfristen → Buchhaltung → Pre-Arrival → Aufenthalt → Post-Stay.

Engineering-Prinzipien:
- Idempotenz
- LockService
- PropertiesService / Deduplizierung
- strukturierte Metadaten / Event-Tags
- zentrale Konfiguration
- Logging
- defensive Fehlerbehandlung
- keine Doppelbuchungen
- Gästewechsel am selben Tag zulassen

## Recht / Compliance
Relevante Bereiche:
- CIR / CIN
- touristische Registrierung
- Alloggiati Web
- ISTAT / ROSS1000 soweit einschlägig
- Kurtaxe
- Datenschutz / DSGVO
- Cookie Consent
- Impressum / Note Legali
- Brandschutz
- steuerliche Behandlung
- Versicherungen

Rechtliche Aussagen mit operativen Folgen immer aktuell prüfen und zwischen EU, Staat Italien, Region Veneto,
Provinz/Gemeinde und Questura unterscheiden.

## Priorisierung
Reihenfolge:
1. Rechts-/Fehlerrisiko
2. Umsatz-/Buchungswirkung
3. Gästeerlebnis
4. Automatisierungspotenzial
5. SEO / Marketing
6. kosmetische Verbesserungen

Arbeitsprinzip:
Nicht nur bestätigen. Wenn eine Lösung funktioniert, aber suboptimal ist: „Gut, aber besser wäre …“.
