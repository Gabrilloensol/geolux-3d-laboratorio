# GeoLux 3D: Laboratorio interactivo de cuerpos geométricos

Aplicación web educativa profesional para explorar cuerpos geométricos en 3D con mouse, pantalla touch o lápiz Paperlux. Está pensada para segundo ciclo básico, proyección en aula y uso colaborativo.

## Funciones principales

- Exploración 3D manipulable con React Three Fiber y Three.js.
- Cuerpos incluidos: cubo, prisma rectangular, prisma triangular, pirámide cuadrangular, pirámide triangular, cilindro, cono y esfera.
- Modos visuales: sólido, translúcido, solo aristas y educativo con etiquetas.
- Herramientas táctiles grandes: rotación automática, vista guiada, reset, caras, aristas, vértices, red geométrica, objeto real, sonido, pausa de animaciones y pantalla completa.
- Redes geométricas animadas para todos los cuerpos, con aclaración conceptual para la esfera.
- Modo desafío con alternativas, selección táctil de partes del cuerpo, retroalimentación inmediata, puntos y resumen final.
- Modo clase con inicio, desarrollo y cierre para guiar una sesión completa con conversación oral, roles Paperlux y equipos colaborativos.
- Modo docente con objetivo de aprendizaje, sugerencias de uso con Paperlux, preguntas orales y actividades de inicio/cierre.
- Diseño responsive, sin backend y sin APIs externas obligatorias.

## Créditos

Desarrollada por Gabriel Vergara.

## Requisitos

- Node.js 18 o superior.
- npm 9 o superior.

## Instalación

```bash
npm install
```

## Ejecutar en desarrollo

```bash
npm run dev
```

Luego abre la URL que entrega Vite, normalmente:

```text
http://localhost:5173
```

## Crear versión de producción

```bash
npm run build
```

El resultado queda en la carpeta `dist/`.

## Probar la versión compilada

```bash
npm run preview
```

## Nota de depuración

La configuración de Vite incluye una protección específica para desarrollo en Windows: mantiene desactivada la preoptimización problemática de dependencias y sirve React, ReactDOM, Scheduler y React Reconciler como módulos ES durante `npm run dev`. Esto corrige la pantalla blanca causada por imports CommonJS crudos en el navegador, sin cambiar el build de producción para Netlify.

Si algo falla durante la carga, la app muestra un fallback visible en vez de quedar en blanco.

## Si aparece pantalla blanca

1. Detén el servidor y vuelve a ejecutar `npm install`.
2. Ejecuta `npm run dev` y abre `http://localhost:5173`.
3. Abre la consola del navegador:
   - Chrome/Edge en Windows: `F12` o `Ctrl + Shift + I`.
   - Revisa la pestaña `Console` para errores rojos.
   - Revisa la pestaña `Network` y recarga la página para confirmar que no haya archivos con estado 404 o 500.
4. Si ves errores relacionados con `react/index.js`, `react-reconciler` o imports CommonJS, confirma que estás usando este `vite.config.mjs`.
5. Si la escena 3D falla, debe aparecer el mensaje visible: “GeoLux 3D no pudo cargar correctamente. Revisa la consola del navegador.”

## Deploy en Netlify

Opción 1: desde repositorio

1. Sube el proyecto a GitHub, GitLab o Bitbucket.
2. En Netlify, elige “Add new site” y conecta el repositorio.
3. Usa estos valores:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Publica el sitio.

Opción 2: deploy manual

1. Ejecuta `npm run build`.
2. En Netlify, arrastra la carpeta `dist/` al área de deploy manual.

El archivo `netlify.toml` ya incluye la configuración de build y redirección para aplicaciones SPA.

## Uso sugerido en aula

1. Inicia en “Explorar” y pide a estudiantes que predigan caras, aristas y vértices antes de tocar la figura.
2. Usa Paperlux para que un estudiante gire el cuerpo mientras el curso verbaliza lo que aparece.
3. Activa “Red geométrica” para conectar el cuerpo 3D con su despliegue plano.
4. Usa “Modo clase” para conducir inicio, exploración guiada y cierre metacognitivo.
5. Cambia a “Modo desafío” para comprobar comprensión con retroalimentación inmediata.
6. Abre “Modo docente” para ajustar presentación, reiniciar progreso o apoyar la mediación.
