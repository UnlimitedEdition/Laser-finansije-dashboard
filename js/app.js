// js/app.js
import { securityUtils } from './security.js';
import { ucitajPodatkeSaServera, upisiPodatkeNaServer } from './app.js';

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

let profitBarChart;

function renderProfitBarChart(ukupanRashod, ukupanProfit) {
    const ctx = document.getElementById('profitBarChart');
    if (!ctx) return;
    if (profitBarChart) profitBarChart.destroy();
    profitBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Rashod i Profit'],
            datasets: [
                {
                    label: 'Rashod',
                    data: [ukupanRashod],
                    backgroundColor: '#ff6384',
                    stack: 'total',
                    borderRadius: 10
                },
                {
                    label: 'Profit',
                    data: [ukupanProfit],
                    backgroundColor: '#36a2eb',
                    stack: 'total',
                    borderRadius: 10
                }
            ]
        },
        options: {
            indexAxis: 'y',
            plugins: {
                legend: { display: true, position: 'bottom', labels: { color: 'white' } },
                title: { display: true, text: 'Rashod vs Profit', color: 'white' }
            },
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    ticks: { color: 'white' }
                },
                y: {
                    stacked: true,
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    ticks: { color: 'white' }
                }
            }
        }
    });
}

// Pozovi ovu funkciju nakon što izračunaš rashod i profit
window.renderProfitBarChart = renderProfitBarChart;

function prikaziMetrikeIPozoviGrafikone() {
    // Učitaj podatke
    let data = securityUtils.loadSecureData('laser-finansije') || {
        potrosnja: [], prihod: [], poslovi: [], nabavke: []
    };
    // Izračunaj rashod i profit
    let ukupanRashod = 0;
    let ukupanPrihod = 0;
    if (Array.isArray(data.potrosnja)) {
        data.potrosnja.forEach(item => {
            ukupanRashod += Number(item.cena || 0);
        });
    }
    if (Array.isArray(data.prihod)) {
        data.prihod.forEach(item => {
            ukupanPrihod += Number(item.cena || item.iznos || 0);
        });
    }
    let ukupanProfit = ukupanPrihod - ukupanRashod;
    // Prikaz metrika (ako je potrebno)
    if (document.getElementById('ukupanPrihod'))
        document.getElementById('ukupanPrihod').textContent = ukupanPrihod.toLocaleString() + ' RSD';
    if (document.getElementById('ukupanRashod'))
        document.getElementById('ukupanRashod').textContent = ukupanRashod.toLocaleString() + ' RSD';
    if (document.getElementById('ukupanProfit'))
        document.getElementById('ukupanProfit').textContent = ukupanProfit.toLocaleString() + ' RSD';
    // Pozovi grafikon
    if (window.renderProfitBarChart) {
        window.renderProfitBarChart(ukupanRashod, ukupanProfit);
    }
}
// Pozovi funkciju kada se DOM i komponente učitaju
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(prikaziMetrikeIPozoviGrafikone, 500);
});

// API pozivi za sinhronizaciju sa backendom
export async function ucitajPodatkeSaServera() {
    try {
        const res = await fetch('/api/podaci');
        if (!res.ok) throw new Error('Ne mogu da učitam podatke sa servera');
        return await res.json();
    } catch (err) {
        console.error('Greška pri učitavanju sa servera:', err);
        return null;
    }
}

export async function upisiPodatkeNaServer(data) {
    try {
        const res = await fetch('/api/upisi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Ne mogu da upišem podatke na server');
        return await res.json();
    } catch (err) {
        console.error('Greška pri upisu na server:', err);
        return null;
    }
}

export { initApp };

// Funkcija za inicijalno učitavanje podataka sa servera i prikaz u UI
async function inicijalizujPodatke() {
    const podaci = await ucitajPodatkeSaServera();
    if (podaci) {
        // Upisi podatke i u localStorage (ili direktno u UI, po potrebi)
        localStorage.setItem('laser-finansije', JSON.stringify(podaci));
        // Osvetli UI (pozovi tvoje funkcije za prikaz tabele, grafikona, metrika...)
        if (typeof prikaziMetrikeIPozoviGrafikone === 'function') prikaziMetrikeIPozoviGrafikone();
    }
}

// Funkcija za automatski upis na server nakon svake izmene
async function autoUpisiNaServer() {
    const podaci = JSON.parse(localStorage.getItem('laser-finansije') || '{}');
    await upisiPodatkeNaServer(podaci);
}

// Pozovi inicijalno učitavanje podataka sa servera pri pokretanju aplikacije
window.addEventListener('DOMContentLoaded', inicijalizujPodatke);

// Primer: pozovi autoUpisiNaServer() nakon svake izmene podataka
// (npr. posle submit forme za prihod/rashod, ili posle brisanja)
// Primer:
// document.getElementById('potrosnjaForm').onsubmit = async function(e) {
//     ...tvoja logika...
//     await autoUpisiNaServer();
// };

async function prikaziTabeluPoslova() {
    const tabela = document.getElementById('posloviTabela').querySelector('tbody');
    tabela.innerHTML = '';
    const podaci = await ucitajPodatkeSaServera();
    if (!podaci || !Array.isArray(podaci.poslovi)) return;
    podaci.poslovi.forEach((posao, idx) => {
        const ukupno = posao.stavke?.reduce((acc, s) => {
            const materijal = window.MATERIJALI?.find(m => m.naziv === s.tip && m.debljina === s.debljina);
            const povrsina = (parseFloat(s.sirina) * parseFloat(s.visina) * parseFloat(s.kolicina)) / 1_000_000;
            const cena = materijal ? materijal.cena : 0;
            return {
                povrsina: acc.povrsina + povrsina,
                cena: acc.cena + povrsina * cena
            };
        }, { povrsina: 0, cena: 0 });
        const materijali = posao.stavke?.map(s => `${s.tip} (${s.debljina})`).join(', ');
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${posao.datum}</td>
            <td>${posao.opis}</td>
            <td>${materijali || ''}</td>
            <td>${ukupno.povrsina.toFixed(2)} m² / ${ukupno.cena.toLocaleString()} RSD</td>
            <td>${posao.cena ? parseFloat(posao.cena).toLocaleString() + ' RSD' : ''}</td>
            <td>-</td>
            <td>-</td>
            <td><button class="btn btn-sm btn-outline-primary" onclick="popuniFormuIzPosla(${idx})">Popuni formu</button></td>
        `;
        tabela.appendChild(tr);
    });
}
window.prikaziTabeluPoslova = prikaziTabeluPoslova;

window.popuniFormuIzPosla = async function(idx) {
    const podaci = await ucitajPodatkeSaServera();
    if (!podaci || !Array.isArray(podaci.poslovi) || !podaci.poslovi[idx]) return;
    const posao = podaci.poslovi[idx];
    // Popuni osnovna polja
    document.getElementById('opisPosla').value = posao.opis || '';
    document.getElementById('datumPosla').value = posao.datum || '';
    document.getElementById('cenaPosla').value = posao.cena || '';
    // Ukloni sve stavke osim prve
    const stavkeContainer = document.querySelector('.stavke-container');
    while (stavkeContainer.querySelectorAll('.stavka').length > 1) {
        stavkeContainer.lastElementChild.remove();
    }
    // Popuni stavke
    posao.stavke.forEach((s, i) => {
        if (i > 0) window.dodajNovuStavku();
        const stavka = stavkeContainer.querySelectorAll('.stavka')[i];
        stavka.querySelector('.tipSelect').value = s.tip || '';
        stavka.querySelector('.debljinaSelect').value = s.debljina || '';
        stavka.querySelector('.varijantaSelect').value = s.varijanta || '';
        stavka.querySelector('.sirina').value = s.sirina || '';
        stavka.querySelector('.visina').value = s.visina || '';
        stavka.querySelector('.kolicina').value = s.kolicina || '';
        // Trigger change za selectore
        stavka.querySelector('.tipSelect').dispatchEvent(new Event('change'));
        stavka.querySelector('.debljinaSelect').dispatchEvent(new Event('change'));
        stavka.querySelector('.varijantaSelect').dispatchEvent(new Event('change'));
    });
    // Ažuriraj proračune
    if (window.initPovrsina) window.initPovrsina();
};
