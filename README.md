# Migración desde CodePen

Abrir VS Code en la carpeta del proyecto.

Abrir la terminal integrada (Ctrl+ `).

Comprobar estado git: git status.

Crear un branch de backup automático (ej.: backup/pre-ilustracion-YYYYMMDD).

Hacer commit de ese backup y push al remote (GitHub).

Crear un branch nuevo para cambios (feature/ilustracion), trabajar ahí.

Probar local (abrir index.html / servidor local).

Si todo ok → merge o crear PR a main.

Si algo rompe → git switch backup/pre-ilustracion-YYYYMMDD o revert.
