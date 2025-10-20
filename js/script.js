// --- Muro de Agradecimientos ---
const mensajeInput = document.getElementById("mensaje");
const btnAgregar = document.getElementById("btn-agregar");
const muro = document.getElementById("muro");

// --- Modal, confeti y audio ---
const modal = document.getElementById("cele-modal");
const closeModalBtn = document.getElementById("close-modal");
const confettiLayer = document.getElementById("confetti-layer");
const audio = document.getElementById("cele-audio");

let mensajes = JSON.parse(localStorage.getItem("muroFelicidad")) || [];
renderMuro();

btnAgregar.addEventListener("click", () => {
    const texto = (mensajeInput?.value || "").trim();
    if (!texto) {
        alert("Escribe algo bonito antes de agregar 💕");
        return;
    }

    const nuevo = { id: Date.now(), texto };
    mensajes.unshift(nuevo);
    localStorage.setItem("muroFelicidad", JSON.stringify(mensajes));
    mensajeInput.value = "";
    renderMuro();

    showCelebration(); // <-- ventana + animación + canción
});

function renderMuro() {
    muro.innerHTML = "";

    if (mensajes.length === 0) {
        muro.innerHTML = "<p style='color:#777;'>Aún no hay mensajes. Sé el primero en compartir gratitud 💖</p>";
        return;
    }

    mensajes.forEach((m) => {
        const div = document.createElement("div");
        div.classList.add("mensaje");
        div.textContent = m.texto;
        muro.appendChild(div);
    });
}

// ======= Celebración: modal + audio + confeti =======
function showCelebration() {
    // Mostrar modal
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");

    // Reproducir audio (el click del botón permite autoplay)
    try {
        audio.currentTime = 0;
        audio.play().catch(() => {
            // Si el navegador bloquea, no pasa nada; el modal igual aparece
            // Puedes mostrar un botón alternativo para reproducir manualmente si quieres.
        });
    } catch (_) { }

    // Lanzar confeti
    makeConfetti(80);

    // Cerrar automáticamente tras unos segundos
    const autoClose = setTimeout(hideCelebration, 3200);

    // Cerrar manual
    const onClose = () => {
        clearTimeout(autoClose);
        hideCelebration();
    };
    closeModalBtn.onclick = onClose;
    // Cerrar si clic fuera de la tarjeta
    modal.addEventListener("click", (e) => {
        if (e.target === modal) onClose();
    }, { once: true });
}

function hideCelebration() {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    clearConfetti();
    // Pausar audio suavemente
    try { audio.pause(); } catch (_) { }
}

function makeConfetti(count = 60) {
    clearConfetti();
    const colors = ["#ff6b6b", "#ffd93d", "#6bcBef", "#a3e635", "#fdba74", "#c084fc"];
    const shapes = ["square", "rect", "rect", "square", "rect"];

    for (let i = 0; i < count; i++) {
        const piece = document.createElement("div");
        piece.className = "confetti";

        // color y tamaño
        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const w = shape === "square" ? rand(8, 12) : rand(8, 10);
        const h = shape === "square" ? w : rand(12, 18);

        piece.style.background = color;
        piece.style.width = w + "px";
        piece.style.height = h + "px";
        piece.style.left = rand(0, 100) + "vw";
        piece.style.top = rand(-8, -2) + "vh";

        // duraciones y trayectorias
        const duration = rand(1200, 2200);
        const endX = (Math.random() > 0.5 ? 1 : -1) * rand(40, 90); // deriva lateral
        const rot = rand(180, 720);

        piece.style.setProperty("--end-x", endX + "px");
        piece.style.setProperty("--rot", rot + "deg");
        piece.style.animationDuration = duration + "ms";

        confettiLayer.appendChild(piece);

        // remover al finalizar
        setTimeout(() => piece.remove(), duration + 60);
    }
}

function clearConfetti() {
    confettiLayer.innerHTML = "";
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
