# Reglas del proyecto

## Datos del proyecto

- **Nombre:** sabores (Restaurante Sabores SJR)
- **Stack / lenguaje principal:** Angular 20 + TypeScript
- **Cómo correrlo en local:** `npm start` (`ng serve`)
- **Cómo correr los tests:** `npm test` (`ng test`, Karma + Jasmine)

## Estructura de carpetas y nombres

- Mantener una carpeta raíz clara por tipo de contenido (`src/`,
  `public/`, `source-photos/`) — no mezclar código con imágenes sueltas o
  archivos de recursos en la raíz del repo (mover fotos como
  `807284732_...jpeg` a `source-photos/` o `public/`).
- Un archivo, una responsabilidad. Si un componente/servicio crece hasta
  mezclar varias responsabilidades, dividirlo en vez de seguir agregando.
- Componentes, servicios y directivas en `PascalCase` para la clase y
  `kebab-case` para el nombre de archivo (convención estándar de Angular
  CLI) — no mezclar estilos de nombres dentro del mismo proyecto.
- Agrupar por función/dominio (`feature`) antes que por tipo técnico
  cuando el proyecto crezca, en vez de carpetas genéricas `components/`,
  `services/` con todo mezclado.
- Nada de carpetas "misc", "otros", "varios" o "temp" — si algo no encaja
  en la estructura, falta una carpeta con nombre claro, no una genérica.

## Limpieza de código viejo y muerto

- Borrar código no usado en vez de comentarlo. El historial de git ya
  guarda la versión anterior.
- No dejar componentes, servicios o rutas muertas (creadas para pruebas o
  features descartadas) en `src/`.
- Eliminar imports, variables, inputs/outputs y archivos sin uso antes de
  dar una tarea por terminada (apoyarse en el compilador de TypeScript y
  el linter de Angular).
- Los `TODO` y `FIXME` deben tener dueño o contexto claro; si no, se
  borran o se convierten en tarea real.
- No dejar implementaciones a medias mezcladas con el resto del código —
  debe quedar explícito como work-in-progress si algo queda incompleto.
- Antes de borrar o refactorizar un componente/servicio, confirmar que no
  se usa en otro módulo (buscar referencias en todo `src/`).
- Revisar periódicamente `source-photos/` y `public/` para quitar
  imágenes que ya no se usan en el sitio.

## Commits y control de versiones

- Un commit = un cambio lógico. No mezclar una feature con limpieza de
  código no relacionada en el mismo commit.
- Mensajes de commit explican el **por qué**, no solo el qué.
- No commitear `console.log` de debug, código comentado, ni carpetas
  generadas (`node_modules/`, `dist/`, `.angular/`) — confirmar que estén
  en `.gitignore`.
- Revisar `git status`/`git diff` antes de cada commit para confirmar que
  solo se incluye lo esperado, especialmente con imágenes grandes sueltas
  en la raíz.
- Preferir commits y PRs pequeños y enfocados sobre cambios gigantes que
  mezclan varios temas.

## Estilo y calidad de código

- Sin comentarios que expliquen el "qué" cuando el código ya es legible.
  Comentar solo el "por qué" cuando no es obvio.
- No añadir inputs, servicios o configuración "por si se necesita
  después". Resolver el problema actual.
- Manejar errores y validar en los bordes del sistema (formularios,
  llamadas HTTP) — no en cada capa interna.
- Preferir componentes simples y explícitos sobre abstracciones
  prematuras que solo se usan una vez.
- Respetar la configuración de `prettier` ya definida en `package.json`
  (comillas simples, ancho de línea 100, parser Angular para HTML) —
  correr el formateador antes de commitear.
- Todo cambio de lógica relevante debería tener un test (`ng test`) o al
  menos verificación manual documentada.
