# Documentación Frontend Carnet Salud Digital

## Paso 1: Creart el proyecto Frontend con Vite

_Abrir el terminal en la carpeta raiz (al mismo nivel o fuera del backend) y ejecutar:_

```bash
# Crear el proyecto con Vite indicando Vanilla JavaScript
npm create vite@latest vet-carnet-frontend -- --template vanilla

# Entrar a la carpeta del frontend
cd vet-carnet-frontend

# Instalar las dependencias iniciales
npm install
```

## Paso 2: Instalar e Inicializar Tailwind CSS

_Dentro de la carpeta vet-carnet-frontend, instalamos Tailwind y sus herramientas de procesamiento:_

```bash
# Instalar Tailwind CSS v3, PostCSS y Autoprefixer como dependencias de desarrollo
npm install -D tailwindcss@3 postcss autoprefixer
```

## Paso 3: Archivos de configuración

_tailwind.config.js_
_1. Crear el archivo tailwind.config.js en la raíz de vet-carnet-frontend:_

```JavaScript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

_postcss.config.js_
_2. Crear el archivo postcss.config.js en la raíz de vet-carnet-frontend:_

```JavaScript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

_vite.config.js_
_4. Asegurar que el archivo vite.config.js en la raíz quede limpio para procesar PostCSS de manera nativa:_

```JavaScript
import { defineConfig } from 'vite';

export default defineConfig({});
```

## 4. Configurar style.css y declarar directivas de base de Tailwind

_src/style.css_

```CSS
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 5. Ajustar Estructura Base y Prueba de Renderizado:

_1. Actualizar el punto de entrada HTML en la raíz del proyecto:_
_index.html_

```HTML
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Carnet Digital Veterinario 🐾</title>
  </head>
  <body class="bg-slate-100 min-h-screen text-slate-800 antialiased">
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

_2. Inyectar un contenedor de prueba para validar que las utilidades de CSS, bordes redondeados y sombras de Tailwind se apliquen correctamente:_

```JavaScript
import './style.css';

document.querySelector('#app').innerHTML = `
  <div class="min-h-screen flex items-center justify-center p-4 bg-slate-100">
    <div class="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full text-center border border-slate-200">
      <span class="text-4xl">🐾</span>
      <h1 class="text-2xl font-bold text-slate-800 mt-2">Carnet Digital Veterinario</h1>
      <p class="text-slate-500 text-sm mt-1">Vite + Vanilla JS + Tailwind v3 ok</p>
      <button class="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow">
        ¡Todo funcionando!
      </button>
    </div>
  </div>
`;
```

## Paso 6: Verificación del Entorno de Desarrollo

_Ejecutar el servidor local de Vite:_

```Bash
npm run dev
```

## Paso 7: Implementar la Ficha Pública Móvil

**Creación de módulo para:**
_1. Lee el identificador público (publicId) desde la URL._

_2. Consulta la API del backend (http://localhost:3000/api/pets/public/:publicId)._

_3. Renderiza una interfaz dinámica con el perfil del animal, datos de contacto del tutor y la lista de vacunas o controles registrados._

**1. CREAR MÓDULO src/publicCard.js**

```JavaScript
export async function renderPublicCard(appContainer, publicId) {
  // Estado de carga inicial (Skeleton)
  appContainer.innerHTML = `
    <div class="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div class="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-slate-200">
        <div class="animate-pulse flex flex-col items-center">
          <div class="w-20 h-20 bg-slate-200 rounded-full mb-4"></div>
          <div class="h-6 bg-slate-200 rounded w-1/2 mb-2"></div>
          <div class="h-4 bg-slate-200 rounded w-1/3 mb-6"></div>
          <div class="h-10 bg-slate-200 rounded w-full"></div>
        </div>
        <p class="text-xs text-slate-400 mt-4 font-medium">Cargando carnet digital...</p>
      </div>
    </div>
  `;

  try {
    const response = await fetch(`http://localhost:3000/api/pets/public/${publicId}`);

    if (!response.ok) {
      throw new Error('Carnet no encontrado o código inválido');
    }

    const pet = await response.json();

    // Icono según especie
    const iconMap = {
      Perro: '🐶',
      Gato: '🐱',
      Conejo: '🐰',
      Ave: '🦜'
    };
    const petIcon = iconMap[pet.species] || '🐾';

    // Formatear historial de vacunas
    const recordsList = pet.MedicalRecords && pet.MedicalRecords.length > 0
      ? pet.MedicalRecords.map(rec => `
          <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between">
            <div>
              <div class="flex items-center gap-2">
                <span class="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                <p class="font-semibold text-slate-800 text-sm">${rec.title}</p>
              </div>
              <p class="text-xs text-slate-500 mt-1">Aplicada: ${rec.dateApplied}</p>
              ${rec.notes ? `<p class="text-xs text-slate-400 italic mt-0.5">${rec.notes}</p>` : ''}
            </div>
            ${rec.nextDueDate ? `
              <span class="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                Próx: ${rec.nextDueDate}
              </span>
            ` : ''}
          </div>
        `).join('')
      : `<p class="text-xs text-slate-400 text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">No hay registros médicos cargados aún.</p>`;

    // Renderizado del carnet digital
    appContainer.innerHTML = `
      <div class="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200/80">

          <!-- Encabezado del Carnet -->
          <div class="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white text-center relative">
            <span class="absolute top-4 right-4 text-xs font-semibold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white">
              VERIFICADO
            </span>
            <div class="w-24 h-24 bg-white text-4xl flex items-center justify-center rounded-full mx-auto shadow-lg ring-4 ring-white/30 border-2 border-white">
              ${pet.photoUrl ? `<img src="${pet.photoUrl}" class="w-full h-full object-cover rounded-full" />` : petIcon}
            </div>
            <h2 class="text-2xl font-bold mt-3">${pet.name}</h2>
            <p class="text-emerald-100 text-xs tracking-wide uppercase font-medium">${pet.species} • ${pet.breed || 'Sin raza especificada'}</p>
          </div>

          <!-- Detalles de la Mascota -->
          <div class="p-6 space-y-5">

            <div class="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center">
              <div>
                <p class="text-[10px] uppercase font-bold text-slate-400">Microchip</p>
                <p class="text-xs font-semibold text-slate-700">${pet.microchip || 'No registrado'}</p>
              </div>
              <div>
                <p class="text-[10px] uppercase font-bold text-slate-400">Nacimiento</p>
                <p class="text-xs font-semibold text-slate-700">${pet.birthDate || 'No informado'}</p>
              </div>
            </div>

            <!-- Datos del Tutor -->
            <div class="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
              <p class="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1">Tutor Responsable</p>
              <div class="flex items-center justify-between mt-1">
                <div>
                  <p class="text-sm font-bold text-slate-800">${pet.ownerName}</p>
                  <p class="text-xs text-slate-500">${pet.ownerPhone}</p>
                </div>
                <a href="tel:${pet.ownerPhone}" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3 rounded-xl shadow-sm transition-colors flex items-center gap-1">
                  📞 Llamar
                </a>
              </div>
            </div>

            <!-- Historial Médico -->
            <div>
              <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Historial de Vacunas y Controles</h3>
              <div class="space-y-2">
                ${recordsList}
              </div>
            </div>

          </div>

          <!-- Pie del Carnet -->
          <div class="bg-slate-50 p-3 text-center border-t border-slate-100">
            <p class="text-[11px] text-slate-400 font-medium">Carnet Digital Oficial 🐾 • ID: <span class="font-mono text-slate-600 font-bold">${pet.publicId}</span></p>
          </div>

        </div>
      </div>
    `;

  } catch (err) {
    appContainer.innerHTML = `
      <div class="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div class="bg-white p-6 rounded-3xl shadow-xl max-w-sm w-full text-center border border-slate-200">
          <span class="text-4xl">❌</span>
          <h2 class="text-lg font-bold text-slate-800 mt-2">Carnet no encontrado</h2>
          <p class="text-xs text-slate-500 mt-1">${err.message}</p>
        </div>
      </div>
    `;
  }
}
```

**2. Actualizar el enrutador básico en src/main.js**

```JavaScript
import './style.css';
import { renderPublicCard } from './publicCard';

const app = document.querySelector('#app');

// Obtener el parametro publicId de la URL (Ejemplo: http://localhost:5173/?p=a1b2c3d4)
const urlParams = new URLSearchParams(window.location.search);
const publicId = urlParams.get('p');

if (publicId) {
  renderPublicCard(app, publicId);
} else {
  app.innerHTML = `
    <div class="min-h-screen flex items-center justify-center p-4 bg-slate-100">
      <div class="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full text-center border border-slate-200">
        <span class="text-4xl">🐾</span>
        <h1 class="text-2xl font-bold text-slate-800 mt-2">Carnet Digital Veterinario</h1>
        <p class="text-slate-500 text-sm mt-1">Ingresa un ID de prueba en la URL para consultar un carnet.</p>
        <div class="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-left">
          <p class="text-xs text-slate-400 font-bold uppercase">Ejemplo de consulta:</p>
          <code class="text-xs text-emerald-600 font-mono block mt-1 break-all">http://localhost:5173/?p=TU_PUBLIC_ID</code>
        </div>
      </div>
    </div>
  `;
}
```

**3. Probar la Integración**
_1.- Inicia el servidor backend (node index.js o npm run dev en la carpeta del servidor)._

_2.- Asegúrate de que el frontend esté corriendo (npm run dev en vet-carnet-frontend)._

_3.- Abre el navegador y consulta la URL agregando un publicId existente registrado en tu base de datos:_

```HTTP
http://localhost:5173/?p=a1b2c3d4
```

_Reemplazar a1b2c3d4 por el identificador real que retorna la API al crear una mascota, o consultar en base de datos._

### 1. Módulo `src/publicCard.js`

- Maneja estado de carga (Skeleton Loader) mientras realiza el `fetch` al backend.
- Renderiza encabezado con icono dinámico según la especie (`Perro`, `Gato`, etc.).
- Muestra bloque de datos del tutor con botón directo de llamada (`tel:`).
- Despliega el historial de vacunas y controles médicos ordenados por fecha.
- Maneja excepciones e interfaces de error si el `publicId` es inexistente o no válido.

### 2. Enrutador básico en `src/main.js`

- Captura los parámetros de búsqueda de la URL (`window.location.search`).
- Si detecta `?p=PUBLIC_ID`, invoca la función `renderPublicCard()`.
- Si se ingresa a la raíz sin parámetros, despliega una pantalla de bienvenida informativa con un ejemplo de uso.

## Paso 8: Módulo de Autenticación y Manejo de Sesión (Login)

Se implementó el formulario de acceso para veterinarias y el control de rutas según el estado del token JWT.

### 1. Módulo `src/login.js`

- Renderiza el formulario de inicio de sesión estilizado con Tailwind CSS.
- Captura credenciales (`email` y `password`) y envía una petición `POST` a `/api/auth/login`.
- Al recibir respuesta exitosa (status 200/201), almacena el `token` de sesión y los datos del usuario en el `localStorage` del navegador.
- Incluye validación de errores visual (mensajes de credenciales inválidas) y estado de carga dinámico en el botón.

### 2. Enrutador y Control de Guardias en `src/main.js`

- Verifica la presencia de `vetToken` antes de permitir la entrada al panel administrativo (`?view=dashboard`).
- Si un usuario no autenticado intenta acceder al dashboard, es redirigido automáticamente a la vista de login (`?view=login`).
- Implementa la función de **Cierre de Sesión (Logout)**, que elimina las llaves del `localStorage` y reinicia el flujo hacia el login.

## Paso 9: Módulo de Dashboard y Generación de QR en Vivo

Se implementó el panel de administración privado y la lógica completa para el registro de nuevos pacientes con previsualización y descarga de carnet digital QR.

### 1. Módulo `src/dashboard.js`

- **Consulta de pacientes (`GET /api/pets`):** Envía el token JWT en el encabezado `Authorization: Bearer <token>` para recuperar y listar las mascotas registradas por la veterinaria.
- **Formulario Modal de Registro:** Interfaz dinámica para capturar datos de la mascota (nombre, especie, raza, microchip, nacimiento) y del tutor (nombre, teléfono).
- **Petición `POST /api/pets`:** Envía la información al backend y recibe la mascota creada junto con el campo `qrCodeImage` (string en formato Base64 `data:image/png;base64,...`).
- **Descarga de QR:** Inyecta la cadena Base64 directamente en el atributo `href` de un enlace `<a>` con la propiedad `download`, permitiendo al usuario descargar el archivo PNG con un solo clic.

### 2. Enrutador Integrado en `src/main.js`

- Conecta la ruta `?view=dashboard` directamente con la función `renderDashboard(app)` previa validación de la sesión activa en `localStorage`.

## Paso 10: Módulo de Registro de Vacunas e Historial Médico

Se implementó la funcionalidad para que el personal médico de la veterinaria registre atenciones, vacunas y controles directamente desde el panel de administración, reflejando las actualizaciones de forma inmediata en la ficha pública del paciente.

1. Ajuste de Enrutamiento con la API Backend
   Se alinearon las peticiones del frontend con la estructura de endpoints expuesta por el servidor Express:

Obtención de Pacientes: GET /api/pets/my-pets (Ruta protegida que requiere el encabezado Authorization: Bearer <token>).

Creación de Vacunas / Controles: POST /api/records (Procesa petId, title, dateApplied, nextDueDate y notes).

2. Módulo src/dashboard.js (Actualizado)
   Se incorporaron las siguientes mejoras al panel principal:

Modal de Registro Médico: Formulario para capturar el título de la vacuna/procedimiento, fecha de aplicación, fecha de la próxima dosis sugerida y observaciones del profesional.

Acción por Paciente: Cada tarjeta de mascota en el listado incluye el botón 💉 Registrar Vacuna, el cual vincula dinámicamente el petId correspondiente al enviar el formulario.

Formateo de Fechas: Asignación automática de la fecha actual en los campos de entrada de tipo date para agilizar la carga de datos.

Feedback Inmediato: Tras una respuesta exitosa (201 Created), la interfaz notifica la confirmación y reconsulta la lista de pacientes para reflejar el estado más reciente.

## Paso 11: Pulir la Interfaz y Probar el Flujo Completo

Para dar por cerrada la integración del frontend con el backend, hagamos una prueba de extremo a extremo:

Crear una nueva mascota:

Haz clic en + Nueva Mascota.

Completa el formulario con datos de prueba (ej: "Pelusa", Gato, Tutor: "Renato López").

Genera el QR y prueba el botón Descargar Imagen QR.

Agregar una vacuna:

En la tarjeta del nuevo paciente, presiona 💉 Registrar Vacuna.

Agrega la vacuna (ej: "Triple Felina", fecha de hoy y próxima dosis en 1 año).

Verificar la vista pública:

Haz clic en Ver Carnet ↗ en la esquina de la tarjeta.

Confirma que la ficha pública muestre los datos actualizados de la mascota y el historial de vacunas recién creado.

## Resolución de Integración: Módulo de Registros Médicos

- **Causa del Error 500/400:** Discrepancia entre la clave `petId` enviada en el body de la petición desde el frontend y la variable requerida en el controlador del backend (`Pet.findOne({ where: { id } })`), sumado a la falta del atributo obligatorio `type`.
- **Solución Aplicada:**
  1. Se estandarizó el payload en `src/dashboard.js` para enviar los campos `petId`, `type`, `title`, `dateApplied`, `nextDueDate` y `notes`.
  2. Se ajustó la lectura en el controlador del backend para consumir directamente `req.body.petId`.
- **Resultado:** Inserción exitosa de registros médicos (`201 Created`) y actualización dinámica en la ficha pública del paciente.
