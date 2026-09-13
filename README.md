# 🐾 Gato y Crunchy — Pitch Bible Interactiva

**Trabajo de Fin de Grado (TFG)**  
**Autor:** Marc Gil Mayor  

---

## 🚀 Cómo Iniciar y Visualizar el Proyecto (Guía para Profesores y Evaluadores)

Para acceder y explorar el cuento interactivo, **no es necesario instalar dependencias ni ejecutar compilaciones:**

### 👉 Opción 1 (Directa y Recomendada):
1. Abre la carpeta del proyecto.
2. **Haz doble clic en el archivo `index.html`** (o clic derecho > *Abrir con* > Google Chrome, Microsoft Edge, Mozilla Firefox o Safari).
3. El proyecto interactivo se abrirá automáticamente en tu navegador.

### 👉 Opción 2 (Servidor Local de Desarrollo):
Si utilizas **Visual Studio Code**:
1. Abre la carpeta en VS Code.
2. Haz clic derecho sobre `index.html` y pulsa en **"Open with Live Server"**.

O bien, mediante terminal:
```bash
npx serve .
# o con python:
python -m http.server 8000
```

> ⚠️ **Nota de Audio:** Al abrir la página, interactúa (haciendo un primer clic o toque) para que el navegador habilite la reproducción de efectos sonoros y audio según las políticas estándar de autoplay de los navegadores.

---

## 📁 Estructura del Proyecto

```text
Gil_Marc_GatoyCrunchy/
│
├── index.html       <- ENTRADA AL CUENTO INTERACTIVO (Doble clic para abrir)
├── style.css        <- Hoja de estilos, maquetación y diseño visual
├── script.js        <- Interactividad, audio y animaciones
├── README.md        <- Instrucciones de acceso para profesores
│
├── assets/          <- Recursos multimedia (audio, fondos, objetos, personajes, ui)
└── scripts/         <- Scripts auxiliares de desarrollo
```

---
*Trabajo de Fin de Grado — Marc Gil Mayor*
