# Laser Finansije Dashboard

Aplikacija za praćenje potrošnje materijala, prihoda i profita u laserskoj radionici. Podaci se automatski sinhronizuju između svih uređaja putem GitHub repozitorijuma.

## Funkcionalnosti
- Praćenje prihoda i rashoda
- Automatski proračun profita i marže
- Vizuelizacija podataka (grafikoni, tabele, metrike)
- Sinhronizacija podataka preko GitHub-a (backend API)
- Modularni frontend (sve komponente u posebnom fajlu)

## Tehnologije
- Frontend: HTML, CSS (Bootstrap), JavaScript (ES6), Chart.js
- Backend: Node.js (Express), GitHub REST API

## Pokretanje projekta

### 1. Backend (Node.js server)
1. Instaliraj zavisnosti:
   ```bash
   npm install express node-fetch dotenv body-parser
   ```
2. Uredi `.env` fajl (primer):
   ```env
   GITHUB_TOKEN=ovde_tvoj_token
   GITHUB_USERNAME=UnlimitedEdition
   REPO_NAME=Laser-finansije-dashboard
   DATA_FILE=data.json
   PORT=3001
   ```
3. Pokreni server:
   ```bash
   node server.js
   ```

### 2. Frontend (lokalni server)
1. Pokreni lokalni server (npr. Python):
   ```bash
   python -m http.server 8000
   ```
2. Otvori [http://localhost:8000](http://localhost:8000) u browseru.

## Sinhronizacija podataka
- Svi podaci se automatski čuvaju na GitHub-u preko backend servera.
- Kada otvoriš aplikaciju na bilo kom uređaju, podaci se automatski povlače sa GitHub-a.
- Svaka izmena (unos, brisanje) se automatski upisuje na GitHub.

## Bezbednost
- GitHub token se čuva isključivo u `.env` fajlu na backendu (nikada u browseru ili repozitorijumu).
- `.env` je u `.gitignore` i ne ide na GitHub.

## Doprinos
- Forkuj repozitorijum, napravi branch, pošalji Pull Request.

## Licenca
MIT
