# Versie 5 — verfijnde beweging en een heldere start

Deze versie verfijnt de bestaande donkere website, met dezelfde pagina's, logo's, diensten en Nederlandse en Engelse taalkeuze.

## Vormgeving en animaties

- Gelaagde binnenkomst van de hoofdkop, intro, knoppen en fijne architectuurlijnen.
- Subtiele diepte in de achtergrond bij muisbeweging en scrollen.
- Kaarten met een kleine perspectiefkanteling en een lichtaccent dat de muis volgt.
- Secties en kaarten verschijnen met korte, gespreide vertragingen.
- Het architectuurbeeld, achterpaneel en monogram bewegen subtiel ten opzichte van elkaar bij scrollen.
- Overgangen tussen pagina's in browsers die native view transitions ondersteunen. Andere browsers navigeren normaal.
- Verfijnde knoppen, pijlen, FAQ, formulierfocus en een dunne leesvoortgang in de header.

Er is geen doorlopende animatielus, laadscherm of aangepaste scrollmotor toegevoegd. De site gebruikt native scrollgedrag en kleine animaties in CSS en JavaScript. Geen extra externe bibliotheken of trackers nodig. De pauzeknop blijft verwijderd.

Extra muis-effecten werken alleen met een fijne aanwijzer. De systeeminstelling voor minder beweging schakelt de extra beweging uit. Inhoud blijft beschikbaar zonder JavaScript. Animatie is een visuele verfijning en draagt geen noodzakelijke informatie.

## Eerlijke positionering

De homepage vermeldt “Een jonge praktijk. Een heldere visie.” De adviespraktijk en de pagina Over ons beschrijven Mdihni Advisory als een jonge, onafhankelijke praktijk in opbouw. Contact maakt duidelijk dat een eerste bericht nog geen opdracht is. Het doel, de vraag, de opdrachtomvang en beschikbaarheid worden eerst besproken.

De site presenteert persoonlijke afstemming, duidelijke afspraken en zorgvuldig delen als uitgangspunten. Er worden geen klanten, testimonials, resultaten, ervaringsjaren, registratiegegevens, certificeringen of bevoegdheden geclaimd. De bestaande aandachtsgebieden en juridische conceptstatus blijven behouden.

## Controles

- 16 taalpagina's, 652 lokale verwijzingen: geen ontbrekende bestanden of ankers.
- 96 responsive combinaties: 8 pagina's × 2 talen × 6 breedtes (320, 390, 768, 971, 1024 en 1280 px).
- Metingen na afronding van de paginaovergang; geen blijvende horizontale overflow of te brede koppen gevonden.
- Een nog ladend beeld is afzonderlijk opnieuw gecontroleerd; alle afbeeldingen in die pagina zijn geladen.
- Navigatie, FAQ openen, mobiel menu met Escape en contactbericht kopiëren getest. Geen e-mail verzonden.
- JavaScript-syntaxis en browserconsole gecontroleerd.

De browsercontroles zijn geen volledige toegankelijkheidsaudit of garantie op een vaste framerate op ieder apparaat. De voorkeur voor minder beweging wordt in de gedeelde CSS en JavaScript afgehandeld.

## Bewerken

De actuele verfijning staat in `assets/polish.css`, na de bestaande stylesheets. `assets/site.js` bevat de interacties. De beide taalversies blijven gewone HTML-pagina's. Dit is een vervolg op het bestaande project, geen nieuwe rebuild.

## Bronnen voor de gebruikte browserfuncties

- [Native paginaovergangen](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40view-transition)
- [Animatieprestaties](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Animation_performance_and_frame_rate)

## Publicatie

De bestaande GitHub Pages-workflow publiceert wijzigingen op `main`. `mdihni.com` blijft het beoogde officiële domein en `contact@mdihni.com` blijft het contactadres. STRATO-DNS en mailinstellingen zijn in deze update niet gewijzigd.
