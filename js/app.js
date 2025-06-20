// js/app.js
import { securityUtils } from './security.js';

async function initApp() {
    const potrosnjaForm = document.getElementById('potrosnjaForm');

    if (potrosnjaForm) {
        potrosnjaForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const opisPosla = document.getElementById('opisPosla').value;
            const datumPosla = document.getElementById('datumPosla').value;
            const cenaPosla = document.getElementById('cenaPosla').value;

            const stavke = [];
            document.querySelectorAll('.stavka').forEach(stavka => {
                const tip = stavka.querySelector('.tipSelect')?.value || '';
                const debljina = stavka.querySelector('.debljinaSelect')?.value || '';
                const varijanta = stavka.querySelector('.varijantaSelect')?.value || '';
                const sirina = stavka.querySelector('.sirina')?.value || '';
                const visina = stavka.querySelector('.visina')?.value || '';
                const kolicina = stavka.querySelector('.kolicina')?.value || '';

                stavke.push({
                    tip,
                    debljina,
                    varijanta,
                    sirina,
                    visina,
                    kolicina
                });
            });

            const noviPosao = {
                opis: opisPosla,
                datum: datumPosla,
                cena: cenaPosla,
                stavke: stavke
            };

            try {
                // Učitaj postojeće podatke sa dekripcijom
                let data = securityUtils.loadSecureData('laser-finansije') || {
                    potrosnja: [],
                    prihod: [],
                    poslovi: [],
                    nabavke: []
                };

                data.poslovi.push(noviPosao);
                
                // Sačuvaj podatke sa enkripcijom
                if (securityUtils.saveSecureData('laser-finansije', data)) {
                    alert('Posao je uspešno sačuvan!');
                } else {
                    alert('Došlo je do greške pri čuvanju podataka.');
                }
            } catch (error) {
                console.error('Greška:', error);
                alert('Došlo je do greške pri čuvanju podataka.');
            }
        });
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', initApp);

export { initApp };
