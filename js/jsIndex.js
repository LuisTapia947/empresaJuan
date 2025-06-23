document.addEventListener("DOMContentLoaded", function () {
    emailjs.init("3Onu1n-IntMmrajRN");

    $("#pais").countrySelect({
        preferredCountries: ["co", "mx", "es"]
    });

    menuDesplegable();
    scrollSuavePersonalizado();

    const form = document.getElementById("formulario-contacto");

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        limpiarErrores();

        const nombre = document.getElementById("nombre").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const mensaje = document.getElementById("mensaje").value.trim();
        const paisNombre = $("#pais").countrySelect("getSelectedCountryData").name;
        const paisCodigo = obtenerCodigoPais(paisNombre);

        let valido = true;

        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
            mostrarError("nombre", "El nombre solo debe contener letras.");
            valido = false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            mostrarError("correo", "El correo electrónico no es válido.");
            valido = false;
        }

        const regexTelefonos = {
            CO: /^[0-9]{10}$/,
            MX: /^[0-9]{10}$/,
            AR: /^[0-9]{10}$/,
            CL: /^[0-9]{9}$/,
            ES: /^[0-9]{9}$/
        };

        if (!regexTelefonos[paisCodigo]?.test(telefono)) {
            mostrarError("telefono", "Teléfono inválido para " + paisNombre);
            valido = false;
        }

        if (mensaje.length < 10) {
            mostrarError("mensaje", "El mensaje debe tener al menos 10 caracteres.");
            valido = false;
        }

        if (!valido) return;

        const data = { nombre, correo, telefono, pais: paisNombre, mensaje };

        emailjs.send("service_7tiy8gg", "template_w7y1lga", data)
            .then(() => {
                form.reset();
                alert("Mensaje enviado correctamente");
            })
            .catch((error) => {
                console.error("EmailJS error:", error);
                alert("Error al enviar el mensaje.");
                });
                
    });

    function mostrarError(campo, mensaje) {
        const input = document.getElementById(campo);
        const error = document.getElementById(`error-${campo}`);
        if (input) input.classList.add("input-error");
        if (error) error.textContent = mensaje;
    }

    function limpiarErrores() {
        document.querySelectorAll(".error-msg").forEach(el => el.textContent = "");
        document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));
    }

    function obtenerCodigoPais(nombrePais) {
        const mapa = {
            "Colombia": "CO",
            "México": "MX",
            "Argentina": "AR",
            "Chile": "CL",
            "España": "ES"
        };
        return mapa[nombrePais] || "";
    }
});


// === Menú desplegable ===
function menuDesplegable() {
    const menu_button = document.querySelector(".menu-icon");
    const menu = document.querySelector(".navigator ul");

    menu_button.addEventListener("click", function () {
        menu.classList.toggle("show");
    });
}

// === Scroll suave ===
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
