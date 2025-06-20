// Površina materijala za nabavku i posao - automatski prikaz
// This script calculates and displays the surface area of materials for procurement and job forms.
// Ovaj skript se učitava kao module u index.html
import { MATERIJALI } from '../materials.js';

function popuniMaterijalSelectore() {
    // Nabavka forma
    const tipSelect = document.getElementById('nabavkaTipMaterijala');
    const debljinaSelect = document.getElementById('nabavkaDebljina');
    const varijantaSelect = document.getElementById('nabavkaVarijanta');
    if (tipSelect && debljinaSelect && varijantaSelect) {
        // Popuni tipove
        tipSelect.innerHTML = '<option value="">Izaberi tip</option>';
        Object.keys(MATERIJALI.Plexi).forEach(tip => {
            tipSelect.innerHTML += `<option value="${tip}">${tip}</option>`;
        });
        tipSelect.addEventListener('change', () => {
            // Popuni debljine
            debljinaSelect.innerHTML = '<option value="">Izaberi debljinu</option>';
            varijantaSelect.innerHTML = '<option value="">Izaberi varijantu</option>';
            const tip = tipSelect.value;
            if (tip && MATERIJALI.Plexi[tip]) {
                const debljine = [...new Set(MATERIJALI.Plexi[tip].map(m => m.debljina))];
                debljine.forEach(d => {
                    debljinaSelect.innerHTML += `<option value="${d}">${d}</option>`;
                });
            }
        });
        debljinaSelect.addEventListener('change', () => {
            // Popuni varijante
            varijantaSelect.innerHTML = '<option value="">Izaberi varijantu</option>';
            const tip = tipSelect.value;
            const debljina = debljinaSelect.value;
            if (tip && debljina && MATERIJALI.Plexi[tip]) {
                const varijante = [...new Set(MATERIJALI.Plexi[tip].filter(m => m.debljina === debljina).map(m => m.tip))];
                varijante.forEach(v => {
                    varijantaSelect.innerHTML += `<option value="${v}">${v}</option>`;
                });
            }
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

function dodajPovrsinaListenerPosao() {
    // Za svaku stavku materijala
    document.querySelectorAll('.stavka').forEach(stavka => {
        const sirina = stavka.querySelector('.sirina');
        const visina = stavka.querySelector('.visina');
        const kolicina = stavka.querySelector('.kolicina');
        const povrsinaDiv = stavka.querySelector('.povrsina-cena');
        function updatePovrsina() {
            const s = parseFloat(sirina.value) || 0;
            const v = parseFloat(visina.value) || 0;
            const k = parseFloat(kolicina.value) || 0;
            let povrsina = (s * v * k) / 1_000_000;
            povrsinaDiv.textContent = povrsina.toFixed(2) + ' m² / 0 RSD';
        }
        sirina.addEventListener('input', updatePovrsina);
        visina.addEventListener('input', updatePovrsina);
        kolicina.addEventListener('input', updatePovrsina);
        updatePovrsina();
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
