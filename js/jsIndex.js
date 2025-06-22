function menuDesplegable() {
    const menu_button = document.querySelector(".menu-icon");
    const menu = document.querySelector(".navigator ul");

    menu_button.addEventListener("click", function () {
        menu.classList.toggle("show");
    });
}

function scrollSuavePersonalizado() {
    const enlaces = document.querySelectorAll('a[href^="#"]');

    enlaces.forEach(enlace => {
        enlace.addEventListener("click", function (e) {
            e.preventDefault();
            const destino = document.querySelector(this.getAttribute("href"));
            if (destino) {
                animarScroll(destino.offsetTop, 1200);

                const menu = document.querySelector(".navigator ul");
                if (menu.classList.contains("show")) {
                    menu.classList.remove("show");
                }
            }
        });
    });
}

function animarScroll(destino, duracion) {
    const inicio = window.scrollY || window.pageYOffset;
    const distancia = destino - inicio;
    const inicioTiempo = performance.now();

    function animar(tiempoActual) {
        const tiempoTranscurrido = tiempoActual - inicioTiempo;
        const progreso = Math.min(tiempoTranscurrido / duracion, 1);

        window.scrollTo(0, inicio + distancia * easeInOutCubic(progreso));

        if (tiempoTranscurrido < duracion) {
            requestAnimationFrame(animar);
        }
    }

    requestAnimationFrame(animar);
}

function easeInOutCubic(t) {
    return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

document.addEventListener("DOMContentLoaded", function () {
    menuDesplegable();
    scrollSuavePersonalizado();
});
