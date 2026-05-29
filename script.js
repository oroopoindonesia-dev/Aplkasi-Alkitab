// Daftar 66 Kitab Alkitab (Singkatan standar untuk API)
const daftarKitab = [
    { nama: "Kejadian", abbr: "gen" }, { nama: "Keluaran", abbr: "exo" }, { nama: "Imamat", abbr: "lev" },
    { nama: "Bilangan", abbr: "num" }, { nama: "Ulangan", abbr: "deu" }, { nama: "Yosua", abbr: "jos" },
    { nama: "Hakim-hakim", abbr: "jdg" }, { nama: "Rut", abbr: "rut" }, { nama: "1 Samuel", abbr: "1sa" },
    { nama: "2 Samuel", abbr: "2sa" }, { nama: "1 Raja-raja", abbr: "1ki" }, { nama: "2 Raja-raja", abbr: "2ki" },
    { nama: "1 Tawarikh", abbr: "1ch" }, { nama: "2 Tawarikh", abbr: "2ch" }, { nama: "Ezra", abbr: "ezr" },
    { nama: "Nehemia", abbr: "neh" }, { nama: "Ester", abbr: "est" }, { nama: "Ayub", abbr: "job" },
    { nama: "Mazmur", abbr: "psa" }, { nama: "Amsal", abbr: "pro" }, { nama: "Pengkhotbah", abbr: "ecc" },
    { nama: "Kidung Agung", abbr: "sng" }, { nama: "Yesaya", abbr: "isa" }, { nama: "Yeremia", abbr: "jer" },
    { nama: "Ratapan", abbr: "lam" }, { nama: "Yehezkiel", abbr: "ezk" }, { nama: "Daniel", abbr: "dan" },
    { nama: "Hosea", abbr: "hos" }, { nama: "Yoel", abbr: "jol" }, { nama: "Amos", abbr: "amo" },
    { nama: "Obaja", abbr: "oba" }, { nama: "Yunus", abbr: "jon" }, { nama: "Mikha", abbr: "mic" },
    { nama: "Nahum", abbr: "nam" }, { nama: "Habakuk", abbr: "hab" }, { nama: "Zefanya", abbr: "zep" },
    { nama: "Hagai", abbr: "hag" }, { nama: "Zakharia", abbr: "zec" }, { nama: "Maleakhi", abbr: "mal" },
    { nama: "Matius", abbr: "mat" }, { nama: "Markus", abbr: "mrk" }, { nama: "Lukas", abbr: "luk" },
    { nama: "Yohanes", abbr: "jhn" }, { nama: "Kisah Para Rasul", abbr: "act" }, { nama: "Roma", abbr: "rom" },
    { nama: "1 Korintus", abbr: "1co" }, { nama: "2 Korintus", abbr: "2co" }, { nama: "Galatia", abbr: "gal" },
    { nama: "Efesus", abbr: "eph" }, { nama: "Filipi", abbr: "php" }, { nama: "Kolose", abbr: "col" },
    { nama: "1 Tesalonika", abbr: "1th" }, { nama: "2 Tesalonika", abbr: "2th" }, { nama: "1 Timotius", abbr: "1ti" },
    { nama: "2 Timotius", abbr: "2ti" }, { nama: "Titus", abbr: "tit" }, { nama: "Filemon", abbr: "phm" },
    { nama: "Ibrani", abbr: "heb" }, { nama: "Yakobus", abbr: "jas" }, { nama: "1 Petrus", abbr: "1pe" },
    { nama: "2 Petrus", abbr: "2pe" }, { nama: "1 Yohanes", abbr: "1jn" }, { nama: "2 Yohanes", abbr: "2jn" },
    { nama: "3 Yohanes", abbr: "3jn" }, { nama: "Yudas", abbr: "jud" }, { nama: "Wahyu", abbr: "rev" }
];

const kitabSelect = document.getElementById('kitab-select');
const pasalInput = document.getElementById('pasal-input');
const cariBtn = document.getElementById('cari-btn');
const judulPasal = document.getElementById('judul-pasal');
const kontenAlkitab = document.getElementById('konten-alkitab');

// Mengisi dropdown pilihan kitab
daftarKitab.forEach(kitab => {
    let option = document.createElement('option');
    option.value = kitab.abbr;
    option.textContent = kitab.nama;
    kitabSelect.appendChild(option);
});

// Fungsi untuk mengambil ayat dari API (Menggunakan API publik bible-api.com dengan translation 'alkitab' / id-tb)
async function ambilAlkitab() {
    const kitab = kitabSelect.value;
    const pasal = pasalInput.value;
    const namaKitabTeks = kitabSelect.options[kitabSelect.selectedIndex].text;

    judulPasal.textContent = `Memuat ${namaKitabTeks} ${pasal}...`;
    kontenAlkitab.innerHTML = '<p class="placeholder">Sedang mengambil data...</p>';

    try {
        // Kita gunakan endpoint bibles-api bebas akses (Default di bawah menggunakan web terjemahan ID)
        const response = await fetch(`https://bible-api.com/${kitab}+${pasal}?translation=alkitab`);
        
        if (!response.ok) {
            throw new Error("Pasal tidak ditemukan atau masalah jaringan.");
        }

        const data = await response.json();
        
        judulPasal.textContent = `${namaKitabTeks} ${pasal}`;
        kontenAlkitab.innerHTML = ''; // Kosongkan placeholder

        data.verses.forEach(verse => {
            let p = document.createElement('p');
            p.className = 'ayat';
            p.innerHTML = `<span class="nomor-ayat">${verse.verse}</span>${verse.text}`;
            kontenAlkitab.appendChild(p);
        });

    } catch (error) {
        judulPasal.textContent = "Error";
        kontenAlkitab.innerHTML = `<p class="placeholder" style="color: red;">Gagal memuat teks: ${error.message}<br>Pastikan nomor pasal benar.</p>`;
    }
}

// Event Listener tombol cari
cariBtn.addEventListener('click', ambilAlkitab);
