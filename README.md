# Migración desde CodePen

Sigue estos pasos para pasar un Pen de CodePen a este repositorio:

1. Abre tu Pen en CodePen y copia el HTML, CSS y JS.
2. Pega el HTML dentro de `index.html` (reemplaza el comentario correspondiente).
3. Pega el CSS dentro de `css/style.css`.
4. Pega el JS dentro de `js/main.js`.
5. Si usas imágenes, crea la carpeta `assets/` y actualiza las rutas en el HTML/CSS.

Cómo ver el sitio localmente:

- Opción (VS Code): instala la extensión "Live Server" y haz clic en "Go Live".

- Opción (Python 3): desde PowerShell en la carpeta del proyecto:

```powershell
cd "d:\CODING VS\LucaBlako-site"
python -m http.server 8000
# y luego abre http://localhost:8000
```

- Opción (Node): instala `http-server` una vez y corre:

```powershell
npm install -g http-server
cd "d:\CODING VS\LucaBlako-site"
http-server -c-1
# abre la URL que muestre el comando (por defecto http://127.0.0.1:8080)
```

Si quieres, puedo:
- Copiar directamente el contenido si pegas aquí tu HTML/CSS/JS.
- Mover automáticamente assets (imágenes/fuentes) si me indicas las URLs o subes los ficheros.
- Configurar un pequeño `package.json` si quieres usar build tools.
