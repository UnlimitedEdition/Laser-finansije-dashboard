// Površina materijala za nabavku i posao - automatski prikaz
// This script calculates and displays the surface area of materials for procurement and job forms.
// Ovaj skript se učitava kao module u index.html
import { MATERIJALI } from '../materials.js';

function popuniMaterijalSelectore() {
    // Za formu prodaje/nabavke
    document.querySelectorAll('.stavka').forEach(stavka => {
        const tipSelect = stavka.querySelector('.tipSelect');
        const debljinaSelect = stavka.querySelector('.debljinaSelect');
        const varijantaSelect = stavka.querySelector('.varijantaSelect');
        const cenaDiv = stavka.querySelector('.povrsina-cena');
        if (tipSelect && debljinaSelect && varijantaSelect) {
            // Popuni tipove (nazive)
            tipSelect.innerHTML = '<option value="">Izaberi materijal</option>';
            const jedinstveniNazivi = [...new Set(MATERIJALI.map(m => m.naziv))];
            jedinstveniNazivi.forEach(naziv => {
                tipSelect.innerHTML += `<option value="${naziv}">${naziv}</option>`;
            });
            tipSelect.addEventListener('change', () => {
                // Popuni debljine za izabrani materijal
                debljinaSelect.innerHTML = '<option value="">Debljina</option>';
                varijantaSelect.innerHTML = '<option value="">Varijanta</option>';
                const izabrani = MATERIJALI.filter(m => m.naziv === tipSelect.value);
                const jedinstveneDebljine = [...new Set(izabrani.map(m => m.debljina))];
                jedinstveneDebljine.forEach(d => {
                    debljinaSelect.innerHTML += `<option value="${d}">${d}</option>`;
                });
                // Prikaz cene i opisa
                if (izabrani.length > 0 && cenaDiv) {
                    cenaDiv.textContent = `0 m² / ${izabrani[0].cena.toLocaleString()} RSD`;
                    cenaDiv.title = izabrani[0].opis;
                }
            });
            debljinaSelect.addEventListener('change', () => {
                // Popuni varijante za izabrani materijal i debljinu
                varijantaSelect.innerHTML = '<option value="">Varijanta</option>';
                const izabrani = MATERIJALI.filter(m => m.naziv === tipSelect.value && m.debljina === debljinaSelect.value);
                const jedinstveneVarijante = [...new Set(izabrani.map(m => m.opis))];
                jedinstveneVarijante.forEach(v => {
                    varijantaSelect.innerHTML += `<option value="${v}">${v}</option>`;
                });
                // Prikaz cene i opisa
                if (izabrani.length > 0 && cenaDiv) {
                    cenaDiv.textContent = `0 m² / ${izabrani[0].cena.toLocaleString()} RSD`;
                    cenaDiv.title = izabrani[0].opis;
                }
            });
            varijantaSelect.addEventListener('change', () => {
                // Prikaz cene i opisa za izabranu varijantu
                const izabrani = MATERIJALI.find(m => m.naziv === tipSelect.value && m.debljina === debljinaSelect.value && m.opis === varijantaSelect.value);
                if (izabrani && cenaDiv) {
                    cenaDiv.textContent = `0 m² / ${izabrani.cena.toLocaleString()} RSD`;
                    cenaDiv.title = izabrani.opis;
                }
            });
        }
    });
}

function popuniMaterijalSelectoreNabavka() {
    // Nabavka forma: koristi ID-jeve
    const tipSelect = document.getElementById('nabavkaTipMaterijala');
    const debljinaSelect = document.getElementById('nabavkaDebljina');
    const varijantaSelect = document.getElementById('nabavkaVarijanta');
    if (tipSelect && debljinaSelect && varijantaSelect) {
        // Popuni tipove (nazive)
        tipSelect.innerHTML = '<option value="">Izaberi tip</option>';
        const jedinstveniNazivi = [...new Set(MATERIJALI.map(m => m.naziv))];
        jedinstveniNazivi.forEach(naziv => {
            tipSelect.innerHTML += `<option value="${naziv}">${naziv}</option>`;
        });
        tipSelect.addEventListener('change', () => {
            // Popuni debljine za izabrani materijal
            debljinaSelect.innerHTML = '<option value="">Izaberi debljinu</option>';
            varijantaSelect.innerHTML = '<option value="">Izaberi varijantu</option>';
            const izabrani = MATERIJALI.filter(m => m.naziv === tipSelect.value);
            const jedinstveneDebljine = [...new Set(izabrani.map(m => m.debljina))];
            jedinstveneDebljine.forEach(d => {
                debljinaSelect.innerHTML += `<option value="${d}">${d}</option>`;
            });
        });
        debljinaSelect.addEventListener('change', () => {
            // Popuni varijante za izabrani materijal i debljinu
            varijantaSelect.innerHTML = '<option value="">Izaberi varijantu</option>';
            const izabrani = MATERIJALI.filter(m => m.naziv === tipSelect.value && m.debljina === debljinaSelect.value);
            const jedinstveneVarijante = [...new Set(izabrani.map(m => m.opis))];
            jedinstveneVarijante.forEach(v => {
                varijantaSelect.innerHTML += `<option value="${v}">${v}</option>`;
            });
        });
    }
}

function prikaziPoljaNabavke() {
    const tipNabavke = document.getElementById('tipNabavke');
    const materijalPolja = document.querySelectorAll('.materijal-polje');
    const ostaloPolja = document.querySelectorAll('.ostalo-polje');
    if (!tipNabavke) return;
    if (tipNabavke.value === 'materijal') {
        materijalPolja.forEach(e => e.style.display = '');
        ostaloPolja.forEach(e => e.style.display = 'none');
    } else {
        materijalPolja.forEach(e => e.style.display = 'none');
        ostaloPolja.forEach(e => e.style.display = '');
    }
}

function initPovrsina() {
    // Nabavka forma
    const nabavkaForm = document.getElementById('nabavkaForm');
    if (nabavkaForm) {
        popuniMaterijalSelectoreNabavka(); // <-- DODATO
        dodajPovrsinaListenerNabavka();
        nabavkaForm.addEventListener('input', prikaziPregledNabavke);
        prikaziPregledNabavke();
        const tipNabavke = document.getElementById('tipNabavke');
        if (tipNabavke) {
            tipNabavke.addEventListener('change', prikaziPoljaNabavke);
            prikaziPoljaNabavke();
        }
    }
    // Posao forma
    const potrosnjaForm = document.getElementById('potrosnjaForm');
    if (potrosnjaForm) {
        dodajPovrsinaListenerPosao();
        potrosnjaForm.addEventListener('input', prikaziPregledProdaje);
        prikaziPregledProdaje();
    }
    popuniMaterijalSelectore();
}

function dodajPovrsinaListenerNabavka() {
    const kolicina = document.getElementById('nabavkaKolicina');
    // Dinamički dodaj polja za dimenzije
    let dimenzijeDiv = document.createElement('div');
    dimenzijeDiv.className = 'row';
    dimenzijeDiv.innerHTML = `
        <div class="col-md-2">
            <label>Širina (mm)</label>
            <input type="number" class="form-control" id="nabavkaSirina" min="1" value="100">
        </div>
        <div class="col-md-2">
            <label>Visina (mm)</label>
            <input type="number" class="form-control" id="nabavkaVisina" min="1" value="100">
        </div>
        <div class="col-md-2">
            <label>Površina</label>
            <div class="form-control-plaintext" id="nabavkaPovrsina">0 m²</div>
        </div>
    `;
    kolicina.parentElement.parentElement.insertBefore(dimenzijeDiv, kolicina.parentElement.nextSibling);

    const sirina = document.getElementById('nabavkaSirina');
    const visina = document.getElementById('nabavkaVisina');
    const povrsinaDiv = document.getElementById('nabavkaPovrsina');

    function updatePovrsina() {
        const s = parseFloat(sirina.value) || 0;
        const v = parseFloat(visina.value) || 0;
        const k = parseFloat(kolicina.value) || 0;
        let povrsina = (s * v * k) / 1_000_000;
        povrsinaDiv.textContent = povrsina.toFixed(2) + ' m²';
    }
    sirina.addEventListener('input', updatePovrsina);
    visina.addEventListener('input', updatePovrsina);
    kolicina.addEventListener('input', updatePovrsina);
    updatePovrsina();
}

function updatePovrsinaICena(stavka) {
    const tipSelect = stavka.querySelector('.tipSelect');
    const debljinaSelect = stavka.querySelector('.debljinaSelect');
    const varijantaSelect = stavka.querySelector('.varijantaSelect');
    const sirina = stavka.querySelector('.sirina');
    const visina = stavka.querySelector('.visina');
    const kolicina = stavka.querySelector('.kolicina');
    const cenaDiv = stavka.querySelector('.povrsina-cena');
    // Pronađi izabrani materijal
    const materijal = MATERIJALI.find(m =>
        m.naziv === tipSelect.value &&
        m.debljina === debljinaSelect.value &&
        (varijantaSelect.value === '' || m.opis === varijantaSelect.value)
    );
    const s = parseFloat(sirina.value) || 0;
    const v = parseFloat(visina.value) || 0;
    const k = parseFloat(kolicina.value) || 0;
    let povrsina = (s * v * k) / 1_000_000;
    let cena = materijal ? materijal.cena : 0;
    let ukupno = povrsina * cena;
    if (cenaDiv) {
        cenaDiv.textContent = povrsina.toFixed(2) + ' m² / ' + ukupno.toLocaleString() + ' RSD';
        cenaDiv.title = materijal ? materijal.opis : '';
    }
}

// Izmeni dodajPovrsinaListenerPosao da koristi updatePovrsinaICena
function dodajPovrsinaListenerPosao() {
    document.querySelectorAll('.stavka').forEach(stavka => {
        const tipSelect = stavka.querySelector('.tipSelect');
        const debljinaSelect = stavka.querySelector('.debljinaSelect');
        const varijantaSelect = stavka.querySelector('.varijantaSelect');
        const sirina = stavka.querySelector('.sirina');
        const visina = stavka.querySelector('.visina');
        const kolicina = stavka.querySelector('.kolicina');
        [tipSelect, debljinaSelect, varijantaSelect, sirina, visina, kolicina].forEach(el => {
            if (el) el.addEventListener('input', () => updatePovrsinaICena(stavka));
        });
        updatePovrsinaICena(stavka);
    });
}

function prikaziPregledNabavke() {
    const pregledDiv = document.getElementById('pregledNabavke');
    if (!pregledDiv) return;
    const tip = document.getElementById('nabavkaTipMaterijala')?.value || '';
    const debljina = document.getElementById('nabavkaDebljina')?.value || '';
    const varijanta = document.getElementById('nabavkaVarijanta')?.value || '';
    const sirina = document.getElementById('nabavkaSirina')?.value || '';
    const visina = document.getElementById('nabavkaVisina')?.value || '';
    const kolicina = document.getElementById('nabavkaKolicina')?.value || '';
    const povrsina = sirina && visina && kolicina ? ((parseFloat(sirina) * parseFloat(visina) * parseFloat(kolicina)) / 1_000_000).toFixed(2) : '0.00';
    if (!tip && !debljina && !varijanta) {
        pregledDiv.innerHTML = '';
        return;
    }
    pregledDiv.innerHTML = `
        <h5>Pregled materijala za nabavku</h5>
        <table class="table table-bordered table-sm text-white">
            <thead><tr>
                <th>Tip</th><th>Debljina</th><th>Varijanta</th><th>Širina (mm)</th><th>Visina (mm)</th><th>Kom</th><th>Površina (m²)</th>
            </tr></thead>
            <tbody><tr>
                <td>${tip}</td><td>${debljina}</td><td>${varijanta}</td><td>${sirina}</td><td>${visina}</td><td>${kolicina}</td><td>${povrsina}</td>
            </tr></tbody>
        </table>
    `;
}

function prikaziPregledProdaje() {
    const pregledDiv = document.getElementById('pregledProdaje');
    if (!pregledDiv) return;
    const stavka = document.querySelector('.stavka');
    if (!stavka) {
        pregledDiv.innerHTML = '';
        return;
    }
    const tip = stavka.querySelector('.tipSelect')?.value || '';
    const debljina = stavka.querySelector('.debljinaSelect')?.value || '';
    const varijanta = stavka.querySelector('.varijantaSelect')?.value || '';
    const sirina = stavka.querySelector('.sirina')?.value || '';
    const visina = stavka.querySelector('.visina')?.value || '';
    const kolicina = stavka.querySelector('.kolicina')?.value || '';
    const povrsina = sirina && visina && kolicina ? ((parseFloat(sirina) * parseFloat(visina) * parseFloat(kolicina)) / 1_000_000).toFixed(2) : '0.00';
    if (!tip && !debljina && !varijanta) {
        pregledDiv.innerHTML = '';
        return;
    }
    pregledDiv.innerHTML = `
        <h5>Pregled materijala za prodaju</h5>
        <table class="table table-bordered table-sm text-white">
            <thead><tr>
                <th>Tip</th><th>Debljina</th><th>Varijanta</th><th>Širina (mm)</th><th>Visina (mm)</th><th>Kom</th><th>Površina (m²)</th>
            </tr></thead>
            <tbody><tr>
                <td>${tip}</td><td>${debljina}</td><td>${varijanta}</td><td>${sirina}</td><td>${visina}</td><td>${kolicina}</td><td>${povrsina}</td>
            </tr></tbody>
        </table>
    `;
}

export { initPovrsina };
