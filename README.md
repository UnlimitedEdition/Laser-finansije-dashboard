# Laser Finansije Dashboard

Aplikacija za praćenje prihoda i rashoda za laser poslovanje.

## Podešavanje

1. Forkuj ovaj repozitorijum
2. Omogući GitHub Pages:
   - Idi na Settings -> Pages
   - Source: postavi na "main" branch
   - Sačekaj da se sajt deploy-uje

3. Kreiraj GitHub Personal Access Token:
   - Idi na GitHub Settings -> Developer settings -> Personal access tokens -> Tokens (classic)
   - Generiši novi token sa sledećim dozvolama:
     - `repo` (pun pristup repozitorijumima)
   - Kopiraj token (prikazaće se samo jednom!)

4. Podesi kredencijale:
   - Otvori `index.html`
   - Pronađi sekciju sa GitHub konfiguracijom
   - Popuni:
     ```javascript
     const GITHUB_TOKEN = 'tvoj-token-ovde';
     const GITHUB_USERNAME = 'tvoj-github-username';
     const REPO_NAME = 'ime-tvog-forka';
     ```

## Korišćenje

- Otvori GitHub Pages URL svog fork-a
- Unosi prihode i rashode
- Svi podaci se čuvaju u `data.json` u tvom repozitorijumu
- Možeš pristupiti podacima sa bilo kog uređaja
- Sve promene se beleže u Git istoriji

## Napomene

- Čuvaj svoj GitHub token bezbedan
- Možeš pratiti istoriju promena u Git commit-ovima
- Za bilo kakve probleme, otvori Issue u repozitorijumu

### Аутор:
- Име: Milan Tosic SERBIJA
- GitHub: UnlimitedEdition
- Контакт: +381677275144 | mtosic0450@gmail.com
