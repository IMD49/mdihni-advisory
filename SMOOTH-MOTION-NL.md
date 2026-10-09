# Versie 6 — vloeiendere tekst en scroll

Vervolg op de bestaande website. Inhoud, kleuren, logo, talen en contactgegevens zijn behouden.

## Wat is aangepast

- Tekst komt binnen met een kleinere verticale verplaatsing en een rustigere curve, zonder rotatie. Opacity en translate3d zijn de bewegende eigenschappen.
- De hoofdkop start nadat de gebruikte lokale lettertypen geladen zijn. Zo wordt het lettertype niet midden in de animatie verwisseld.
- Tijdelijke `will-change`-hints bereiden zichtbare animaties voor en worden na afloop verwijderd. Geneste sectie- en tekstanimaties zijn ontdubbeld.
- De dunne decoratieve lijnen worden niet langer geschaald of verplaatst. Hun kleur blijft constant.
- Architectuurbeeld, collage en monogram blijven stabiel. Achtergrondzoom, parallax en 3D-kanteling van kaarten zijn verwijderd om bewegende fijne details rustiger te maken.
- De header is ondoorzichtig en gebruikt geen backdrop-blur. Paginaovergangen gebruiken een korte crossfade zonder verticale verplaatsing van de hele pagina.
- Muiswielscroll krijgt een bescheiden uitloop met Lenis 1.3.26. De tijdstap volgt de browserframes; na stilstand wordt geen grote tijdsprong ingehaald. Er draait geen permanente scroll-loop wanneer de site stilstaat.
- Touchscreens houden native scrollen en momentum. Toetsenbord, formuliercontrols, menu en voorkeur voor minder beweging houden hun eigen gedrag. De terug-naar-boven-link houdt rekening met de sticky header.

Lenis is lokaal meegeleverd: circa 18.7 kB JavaScript, geen CDN-aanvragen of trackers. Licentie en brongegevens staan in `assets/vendor/`. De officiële documentatie: https://github.com/darkroomengineering/lenis .

## Validatie

- 16 taalpagina's en 700 lokale verwijzingen: geen ontbrekende bestanden of ankers.
- 38 nieuwe layoutcontroles: alle 16 taalpagina's op 390 en 1280 px; beide homepages daarnaast op 320, 768 en 1024 px. Geen horizontale overflow gevonden.
- Synthetische wheeltest in de lokale browser op desktop- en mobiele viewport: 600 px beweging via meer dan 100 tussenposities, exacte eindpositie, geen overshoot. Na stilstand blijft de tweede beweging geïnterpoleerd en begint die zonder grote sprong.
- Tijdens die test hebben de decoratieve lijnen één constante combinatie van kleur en transform; de header heeft geen blur en de heroafbeelding geen animatie.
- JavaScript-guards voor minder beweging en een grove aanwijzer gecontroleerd met een testshim. Daarbij onderschept de site de wheelinput niet. Dit is geen volledige OS-emulatie van CSS-mediaqueries.
- Mobiel menu openen/sluiten met Escape, FAQ openen, toetsenbordscroll en terug-naar-boven tot scrollpositie 0 gecontroleerd. Browserconsole bevatte geen appwaarschuwingen of fouten.

De RAF-metingen in `motion-test-results-v6.json` zijn browser-callbackmetingen. Ze bewijzen geen vaste beeldschermframerate, geen GPU-rasterprestaties en geen identiek resultaat op elk apparaat. De gemelde flikkering is aangepakt door de bewegende fijne details te stabiliseren; beoordeling van het uiteindelijke gevoel gebeurt in de live site.

## Bewerken en publicatie

`assets/polish.css` bevat de actuele motionstyles; `assets/site.js` de interacties en scrollafstemming. `assets/motion-boot.js` voorkomt een vroege tekstanimatie voordat het lettertype klaar is, met een fallback die de tekst zichtbaar maakt als het hoofdscript niet laadt. De lokale Lenis-bestanden worden vóór het hoofdscript geladen.

De bestaande GitHub Pages-workflow blijft gelden. `mdihni.com` en `contact@mdihni.com` blijven behouden. Er zijn geen STRATO-, DNS- of mailinstellingen gewijzigd. Versie 5 blijft apart beschikbaar in de eerdere ZIP.
