# Ejemplos para las visitas a bares y tabancos

Web estática para enseñar en el móvil cuando visitas un local. El local que sale, «Tabanco La Muestra», es inventado, igual que sus platos, precios y alérgenos.

## Verla en local

```bash
node tools/serve.js
```

y abrir http://localhost:8766/

## Qué hay

- `index.html`: portada con los tres ejemplos, un QR para que el dueño abra la carta en su propio móvil y los precios.
- `carta/`: carta en español, inglés y francés con los 14 alérgenos. Coge el idioma del móvil, se puede cambiar arriba, y el filtro oculta los platos con los alérgenos que marques. Todo sale de `carta/carta-data.js`.
- `carta/qr.html`: hoja A4 con cuatro cartelitos para las mesas.
- `ficha/`: antes y después de una ficha de Google Maps (simulación, no es una captura de Google). En el móvil se cambia con las pestañas; en el ordenador salen las dos a la vez.

## Para usarla con un cliente real

Copiar `carta/` a la carpeta del cliente, cambiar `carta-data.js` (nombre, platos, precios y alérgenos) y que el dueño **confirme los alérgenos** antes de publicar. La traducción al inglés y al francés hay que revisarla plato por plato.

## Pendiente

- [ ] **Publicarla** (GitHub Pages o Netlify). Sin publicar, el QR solo funciona en este ordenador.
- [ ] Tu teléfono o WhatsApp en la portada (`data-todo="contacto"`).
- [ ] Enlace a la web de Alfredo cuando esté publicada (`data-todo="url-alfredo"`), y preguntarle antes si te deja enseñarla.
