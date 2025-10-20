// ---------- Utilidades ----------
const $ = (sel) => document.querySelector(sel);

const store = {
  get(key, fallback){ try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch{ return fallback; } },
  set(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
};

// ---------- Contador de sonrisas ----------
const COUNT_KEY = "felicidad_count";
const GOAL = 10;

const countEl = $("#count");
const barEl = $("#bar");
const metaEl = $("#meta");
const btnSmile = $("#btn-sonrisa");
const sparkLayer = $("#spark-layer");

let count = store.get(COUNT_KEY, 0);
renderCount();

btnSmile.addEventListener("click", () => {
  count++;
  store.set(COUNT_KEY, count);
  renderCount();
  burstSparks();
});

function renderCount(){
  countEl.textContent = count;
  const pct = Math.min(100, Math.round((count / GOAL) * 100));
  barEl.style.width = pct + "%";
  metaEl.textContent = pct >= 100 ? "¡Meta lograda! Sigue sumando sonrisas 😄" : `Meta diaria: ${GOAL} sonrisas`;
}

// pequeñas chispas/emoji que flotan al sumar
const EMOJI = ["😊","✨","💚","🌟","🎉","😄","🫶","💫"];
function burstSparks(){
  for(let i=0;i<10;i++){
    const s = document.createElement("div");
    s.className = "spark";
    s.textContent = EMOJI[Math.floor(Math.random()*EMOJI.length)];
    const x = Math.random()*100;         // posición horizontal %
    const y = 70 + Math.random()*10;     // posición vertical inicial %
    s.style.left = x + "%";
    s.style.top = y + "%";
    s.style.transform = `translateY(0) rotate(${(Math.random()*30-15)}deg)`;
    sparkLayer.appendChild(s);
    setTimeout(()=> s.remove(), 1000);
  }
}

// ---------- Ideas de micro-acciones ----------
const ideas = [
  "Envía un mensaje de agradecimiento a alguien que te ayudó hoy.",
  "Toma 3 respiraciones profundas mirando por la ventana.",
  "Camina 5 minutos y observa algo bello del campus.",
  "Comparte un chiste con un compañero de clase.",
  "Escribe 2 cosas por las que te sientas agradecido ahora.",
  "Bebe agua y estírate 30 segundos.",
  "Cambia tu fondo de pantalla por una foto que te haga sonreír.",
  "Pon una canción que te anime y escucha 1 minuto."
];

const btnIdea = $("#btn-idea");
const ideaEl = $("#idea");

btnIdea.addEventListener("click", () => {
  const next = ideas[Math.floor(Math.random()*ideas.length)];
  ideaEl.textContent = next;
});
