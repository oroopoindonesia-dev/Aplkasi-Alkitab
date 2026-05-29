const API_URL = 'https://vercel.app';
const selectKitab = document.getElementById('selectKitab');
const selectPasal = document.getElementById('selectPasal');
const kontenAlkitab = document.getElementById('kontenAlkitab');
const loading = document.getElementById('loading');
let daftarKitab = [];

// 1. Registrasi Service Worker untuk PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log('Service Worker terdaftar resmi.'))
            .catch(err => console.error('Gagal daftar Service Worker:', err));
    });
}

// 2. Ambil Daftar Kitab
async function muatKitab() {
    try {
        const res = await fetch(`${API_URL}/api/books`);
        daftarKitab = await res.json();
        
        selectKitab.innerHTML = daftarKitab.map(k => `<option value="${k.id}">${k.name}</option>`).join('');
        perbaruiPilihanPasal();
    } catch (err) {
        kontenAlkitab.innerHTML = `<p class="text-red-500 text-center">Gagal memuat data. Periksa koneksi internet Anda.</p>`;
    }
}

// 3. Perbarui Dropdown Pasal berdasarkan Kitab yang dipilih
function perbaruiPilihanPasal() {
    const kitabId = selectKitab.value;
    const kitabTerpilih = daftarKitab.find(k => k.id == kitabId);
    
    if (kitabTerpilih) {
        let opsiPasal = '';
        for (let i = 1; i <= kitabTerpilih.chapter_count; i++) {
            opsiPasal += `<option value="${i}">Pasal ${i}</option>`;
        }
        selectPasal.innerHTML = opsiPasal;
        muatAyat();
    }
}

// 4. Ambil dan Tampilkan Ayat
async function muatAyat() {
    const kitabId = selectKitab.value;
    const pasal = selectPasal.value;
    if (!kitabId || !pasal) return;

    loading.classList.remove('hidden');
    kontenAlkitab.innerHTML = '';

    try {
        const res = await fetch(`${API_URL}/api/verses?book=${kitabId}&chapter=${pasal}`);
        const data = await res.json();
        
        loading.classList.add('hidden');
        kontenAlkitab.innerHTML = data.verses.map(a => `
            <div class="pb-3 border-b border-gray-100 last:border-0">
                <span class="font-bold text-indigo-600 mr-2">${a.verse}</span>
                <span class="text-gray-800 leading-relaxed">${a.content}</span>
            </div>
        `).join('');
    } catch (err) {
        loading.classList.add('hidden');
        kontenAlkitab.innerHTML = `<p class="text-red-500 text-center">Gagal memuat ayat offline atau gangguan server.</p>`;
    }
}

// Event Listener
selectKitab.addEventListener('change', perbaruiPilihanPasal);
selectPasal.addEventListener('change', muatAyat);

// Jalankan saat aplikasi dibuka
muatKitab();

// 5. Logika Tombol Install PWA
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.classList.remove('hidden');
});

installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') installBtn.classList.add('hidden');
        deferredPrompt = null;
    }
});
