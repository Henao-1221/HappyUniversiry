// Utilidades de almacenamiento local
const store = {
  get:(k,def)=>{ try { return JSON.parse(localStorage.getItem(k)) ?? def } catch { return def }},
  set:(k,v)=> localStorage.setItem(k, JSON.stringify(v))
};

// --- Galería ---
const fileInput = document.getElementById('fileInput');
const gallery = document.getElementById('gallery');
const clearGallery = document.getElementById('clearGallery');
const heroPreview = document.getElementById('heroPreview');

function renderGallery(){
  const items = store.get('gallery', []);
  gallery.innerHTML = '';
  items.forEach(({src,caption},i)=>{
    const fig = document.createElement('figure');
    fig.className = 'card-img';
    fig.innerHTML = `<img src="${src}" alt="Foto del festival ${i+1}"><span>${caption||'Sin descripción'}</span>`;
    gallery.appendChild(fig);
  });
  if(items[0]) heroPreview.src = items[0].src;
}

fileInput?.addEventListener('change', async (e)=>{
  const files = [...e.target.files];
  const current = store.get('gallery', []);
  for(const f of files){
    const data = await f.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(data)));
    current.push({src:`data:${f.type};base64,${base64}`, caption: f.name.replace(/\.[^.]+$/,'')});
  }
  store.set('gallery', current);
  renderGallery();
  e.target.value = '';
});

clearGallery?.addEventListener('click', ()=>{
  if(confirm('¿Seguro que quieres limpiar la galería?')){
    store.set('gallery', []);
    renderGallery();
  }
});

// --- Reflexión (150–200 palabras) ---
const reflection = document.getElementById('reflection');
const wordCount = document.getElementById('wordCount');
const reflectionForm = document.getElementById('reflectionForm');
const resetReflection = document.getElementById('resetReflection');

function countWords(t){ return (t.trim().match(/\b\w+\b/gu)||[]).length; }
function updateCount(){ wordCount.textContent = countWords(reflection.value) + ' palabras'; }

reflection?.addEventListener('input', updateCount);
resetReflection?.addEventListener('click', ()=>{ reflection.value=''; updateCount(); });

reflectionForm?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const text = reflection.value.trim();
  const n = countWords(text);
  if(n < 150 || n > 200){
    alert('Tu reflexión debe tener entre 150 y 200 palabras.');
    return;
  }
  store.set('reflection', {text, date: new Date().toISOString()});
  alert('Reflexión guardada ✅');
});

// cargar reflexión guardada si existe
(function preloadReflection(){
  const saved = store.get('reflection', null);
  if(saved?.text){ reflection.value = saved.text; }
  updateCount();
})();

// --- Interacción: Contador de sonrisas ---
const smileBtn = document.getElementById('smileBtn');
const smileCount = document.getElementById('smileCount');
const resetSmile = document.getElementById('resetSmile');

function renderSmile(){ smileCount.textContent = store.get('smiles', 0); }
smileBtn?.addEventListener('click', ()=>{ store.set('smiles', store.get('smiles',0)+1); renderSmile(); });
resetSmile?.addEventListener('click', ()=>{ if(confirm('¿Reiniciar contador?')){ store.set('smiles', 0); renderSmile(); }});
renderSmile();

// --- Interacción: Micro-animación de burbuja ---
const bubble = document.getElementById('bubble');
const playground = document.querySelector('.playground');

playground?.addEventListener('pointermove', (e)=>{
  const rect = playground.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width;
  const y = (e.clientY - rect.top) / rect.height;
  const tx = (x*100);       // 0..100
  const ty = (y*100);       // 0..100
  bubble.style.transform = `translate(calc(${tx}% - 50%), calc(${ty}% - 50%)) scale(1.02)`;
});
playground?.addEventListener('pointerleave', ()=>{
  bubble.style.transform = 'translate(-50%,-50%)';
});

// Accesibilidad: enfoque visible por teclado
const aStyle = document.createElement('style');
aStyle.textContent=':focus{outline:3px dashed var(--accent);outline-offset:2px}';
document.head.appendChild(aStyle);
