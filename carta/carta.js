/* Pinta la carta desde carta-data.js en el idioma elegido
   y oculta los platos que llevan los alérgenos marcados. */
(function () {
  "use strict";

  var C = window.CARTA;
  var IDIOMAS = ["es", "en", "fr"];
  var LOCALE = { es: "es-ES", en: "en-GB", fr: "fr-FR" };
  var state = { lang: "es", fuera: [] };

  function guardar() {
    try { localStorage.setItem("carta-demo", JSON.stringify(state)); } catch (e) {}
  }
  function cargar() {
    try {
      var s = JSON.parse(localStorage.getItem("carta-demo") || "null");
      if (s && IDIOMAS.indexOf(s.lang) >= 0) state.lang = s.lang;
      if (s && Array.isArray(s.fuera)) state.fuera = s.fuera.filter(function (a) { return C.alergenos[a]; });
      if (s) return;
    } catch (e) {}
    var nav = (navigator.language || "es").slice(0, 2).toLowerCase();
    if (IDIOMAS.indexOf(nav) >= 0) state.lang = nav;
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function precio(v) {
    return new Intl.NumberFormat(LOCALE[state.lang], { style: "currency", currency: "EUR" }).format(v);
  }

  function textos() {
    var t = C.textos[state.lang];
    document.documentElement.lang = state.lang;
    document.querySelectorAll("[data-t]").forEach(function (n) {
      var v = t[n.getAttribute("data-t")];
      if (typeof v === "string") n.textContent = v;
    });
    document.querySelectorAll("[data-lang]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === state.lang));
    });
    document.title = t.titulo + " · " + C.local;
  }

  function nav() {
    var box = document.querySelector("[data-nav]");
    box.textContent = "";
    C.secciones.forEach(function (s) {
      var a = el("a", "secciones__link", s.nombre[state.lang]);
      a.href = "#" + s.id;
      box.appendChild(a);
    });
  }

  function chips() {
    var box = document.querySelector("[data-chips]");
    box.textContent = "";
    Object.keys(C.alergenos).forEach(function (k) {
      var b = el("button", "chip", C.alergenos[k][state.lang]);
      b.type = "button";
      b.setAttribute("aria-pressed", String(state.fuera.indexOf(k) >= 0));
      b.addEventListener("click", function () {
        var i = state.fuera.indexOf(k);
        if (i >= 0) state.fuera.splice(i, 1); else state.fuera.push(k);
        guardar(); pintar();
      });
      box.appendChild(b);
    });
  }

  function carta() {
    var t = C.textos[state.lang];
    var box = document.querySelector("[data-carta]");
    box.textContent = "";
    var ocultos = 0;

    C.secciones.forEach(function (s) {
      var sec = el("section", "seccion");
      sec.id = s.id;
      sec.appendChild(el("h2", "seccion__titulo", s.nombre[state.lang]));
      var lista = el("ul", "platos");

      s.platos.forEach(function (p) {
        var fuera = p.alergenos.some(function (a) { return state.fuera.indexOf(a) >= 0; });
        if (fuera) { ocultos++; return; }

        var li = el("li", "plato");
        var txt = el("div", "plato__txt");
        txt.appendChild(el("h3", "plato__nombre", p.nombre[state.lang]));
        txt.appendChild(el("p", "plato__desc", p.desc[state.lang]));

        var al = el("p", "plato__alergenos");
        if (p.alergenos.length) {
          p.alergenos.forEach(function (a) { al.appendChild(el("span", "alergeno", C.alergenos[a][state.lang])); });
        } else {
          al.appendChild(el("span", "alergeno alergeno--ninguno", t.sinAlergenos));
        }
        txt.appendChild(al);

        var pr = el("dl", "plato__precios");
        Object.keys(p.precios).forEach(function (f) {
          var fila = el("div", "precio");
          fila.appendChild(el("dt", "precio__formato", t.formatos[f]));
          fila.appendChild(el("dd", "precio__valor", precio(p.precios[f])));
          pr.appendChild(fila);
        });

        li.appendChild(txt);
        li.appendChild(pr);
        lista.appendChild(li);
      });

      if (!lista.children.length) sec.appendChild(el("p", "seccion__vacia", t.ninguno));
      else sec.appendChild(lista);
      box.appendChild(sec);
    });

    var cuenta = document.querySelector("[data-cuenta]");
    cuenta.hidden = !state.fuera.length;
    cuenta.textContent = state.fuera.length ? "· " + t.ocultos(ocultos) : "";
    document.querySelector("[data-quitar]").hidden = !state.fuera.length;
  }

  function pintar() { textos(); nav(); chips(); carta(); }

  function init() {
    cargar();
    document.querySelector("[data-local]").textContent = C.local;
    document.querySelector("[data-ciudad]").textContent = C.ciudad;
    document.querySelectorAll("[data-lang]").forEach(function (b) {
      b.addEventListener("click", function () { state.lang = b.getAttribute("data-lang"); guardar(); pintar(); });
    });
    document.querySelector("[data-quitar]").addEventListener("click", function () { state.fuera = []; guardar(); pintar(); });
    if (state.fuera.length) document.querySelector("[data-filtro]").open = true;
    pintar();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
