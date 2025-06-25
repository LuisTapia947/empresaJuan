document.addEventListener("DOMContentLoaded", function () {
  // === Validar jQuery y el plugin countrySelect ===
  if (typeof $ === "undefined" || typeof $.fn.countrySelect !== "function") {
    console.error("❌ jQuery o countrySelect no están disponibles.");
    return;
  }

  const $paisInput = $("#pais");
  if ($paisInput.length === 0) {
    console.error("❌ No se encontró el input con id='pais'.");
    return;
  }

  // === Inicializar EmailJS de forma segura ===
  let emailJsDisponible = false;
  try {
    if (typeof emailjs !== "undefined") {
      emailjs.init("XpnFNAYwdCp7ltXIm");
      emailJsDisponible = true;
      console.log("✅ EmailJS inicializado correctamente.");
    } else {
      console.warn("⚠️ EmailJS no está definido.");
    }
  } catch (error) {
    console.error("❌ Error al inicializar EmailJS:", error);
  }

  // === Inicializar countrySelect ===
  $paisInput.countrySelect({
    preferredCountries: ["co", "mx", "es"],
    defaultCountry: "co"
  });

  console.log("✅ countrySelect cargado correctamente.");

  // === Menú hamburguesa ===
  const menu_button = document.querySelector(".menu-icon");
  const menu = document.querySelector(".navigator ul");

  if (menu_button && menu) {
    menu_button.addEventListener("click", () => {
      menu.classList.toggle("show");
    });
  }

  // === Validación y envío del formulario ===
  const form = document.getElementById("formulario-contacto");

  if (!form) {
    console.warn("⚠️ No se encontró el formulario con id='formulario-contacto'");
    return;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    limpiarErrores();

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    let paisNombre = "";
    let paisCodigo = "";

    try {
      const dataPais = $paisInput.countrySelect("getSelectedCountryData");
      paisNombre = dataPais.name;
      paisCodigo = obtenerCodigoPais(paisNombre);
    } catch (error) {
      mostrarError("pais", "No se pudo obtener el país seleccionado.");
      console.error("❌ Error al obtener país:", error);
      return;
    }

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
      mostrarError("telefono", `Teléfono inválido para ${paisNombre}`);
      valido = false;
    }

    if (mensaje.length < 10) {
      mostrarError("mensaje", "El mensaje debe tener al menos 10 caracteres.");
      valido = false;
    }

    if (!valido) return;

    const data = { nombre, correo, telefono, pais: paisNombre, mensaje };

    if (!emailJsDisponible) {
      alert("No se puede enviar el mensaje: EmailJS no está disponible.");
      return;
    }

    try {
      document.getElementById("spinner").classList.remove("oculto");

      await emailjs.send("service_7tiy8gg", "template_w7y1lga", data);

      form.reset();
      document.getElementById("spinner").classList.add("oculto");
      document.getElementById("mensaje-exito").classList.remove("oculto");

      setTimeout(() => {
        document.getElementById("mensaje-exito").classList.add("oculto");
      }, 5000);
    } catch (error) {
      console.error("❌ Error al enviar con EmailJS:", error);
      alert("Error al enviar el mensaje. Intenta de nuevo más tarde.");
      document.getElementById("spinner").classList.add("oculto");
    }
  });

  // === Funciones auxiliares ===
  function mostrarError(campo, mensaje) {
    const input = document.getElementById(campo);
    const error = document.getElementById(`error-${campo}`);
    if (input) input.classList.add("input-error");
    if (error) error.textContent = mensaje;
  }

  function limpiarErrores() {
    document.querySelectorAll(".error-msg").forEach(el => el.textContent = "");
    document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));
    document.getElementById("mensaje-exito").classList.add("oculto");
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

