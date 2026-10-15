/* Dibuja un QR en cada elemento [data-qr].
   El destino sale del atributo data-destino del <script>, relativo
   a la raíz de los ejemplos, así que vale para cualquier dominio. */
(function () {
  "use strict";

  var script = document.currentScript;
  var destino = (script && script.getAttribute("data-destino")) || "carta/";
  var raiz = script ? new URL(".", script.src) : new URL(".", window.location.href);

  function draw() {
    if (typeof window.qrcode !== "function") return;
    var url = new URL(destino, raiz).href;
    var qr = window.qrcode(0, "M");
    qr.addData(url);
    qr.make();
    var svg = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });

    document.querySelectorAll("[data-qr]").forEach(function (el) {
      el.innerHTML = svg;
      el.setAttribute("role", "img");
      el.setAttribute("aria-label", "Código QR que abre la carta en el móvil");
    });
    document.querySelectorAll("[data-qr-url]").forEach(function (el) { el.textContent = url; });

    var local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname) || window.location.protocol === "file:";
    document.querySelectorAll("[data-qr-warning]").forEach(function (el) { el.hidden = !local; });

    var print = document.querySelector("[data-print]");
    if (print) print.addEventListener("click", function () { window.print(); });
  }

  try {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", draw);
    else draw();
  } catch (e) { console.warn("[qr]", e); }
})();
