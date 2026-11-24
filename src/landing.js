// src/landing.js

//
const DEMO_PET_PUBLIC_ID = "d8a874b5"; // Reemplaza esto con un publicId real de una ficha de mascota para la demo.

export function renderLanding(container) {
  const demoCardUrl =
    DEMO_PET_PUBLIC_ID !== "d8a874b5"
      ? `/?p=${DEMO_PET_PUBLIC_ID}`
      : "/?view=login";

  container.innerHTML = `
    <div class="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <!-- Navbar -->
      <header class="bg-white/90 backdrop-blur border-b border-slate-200 sticky top-0 z-20">
        <div class="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg shadow-sm">🐾</span>
            <div>
              <span class="font-extrabold text-slate-900 tracking-tight text-base block leading-none">Carnet Salud Digital</span>
              <span class="text-[11px] text-emerald-700 font-semibold">Gestión Veterinaria & QR</span>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <a href="${demoCardUrl}" class="hidden sm:inline-block text-xs font-semibold text-slate-600 hover:text-emerald-700 px-3 py-2 transition-colors">
              Ver Carnet Demo
            </a>
            <a href="/?view=login" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-colors">
              Acceso Clínicas
            </a>
          </div>
        </div>
      </header>

      <!-- Hero Section -->
      <main class="flex-1">
        <section class="max-w-5xl mx-auto px-4 pt-12 pb-14 md:pt-16 md:pb-20">
          <div class="grid md:grid-cols-12 gap-10 items-center">
            <!-- Texto Principal -->
            <div class="md:col-span-7 space-y-5 text-center md:text-left">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                Plataforma Cloud para Clínicas Veterinarias
              </div>

              <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                El historial sanitario de tus pacientes, siempre en un <span class="text-emerald-600">código QR</span>.
              </h1>

              <p class="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto md:mx-0">
                Digitaliza vacunas, desparasitaciones y controles clínicos en segundos. Entrega a cada tutor una credencial móvil accesible 24/7 desde cualquier smartphone, sin instalar aplicaciones.
              </p>

              <div class="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 pt-2">
                <a href="${demoCardUrl}" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all">
                  <span>📱</span> Ver Carnet de Ejemplo
                </a>
                <a href="/?view=login" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm px-6 py-3.5 rounded-xl border border-slate-300 transition-colors">
                  <span>🔐</span> Ingresar al Panel
                </a>
              </div>

              <p class="text-xs text-slate-400 pt-1">
                ¿Quieres explorar el sistema completo? Usa el modo <a href="/?view=login&demo=1" class="text-emerald-700 font-semibold underline hover:text-emerald-800">Acceso Demo Interactivo</a>.
              </p>
            </div>

            <!-- Mockup Visual del Carnet -->
            <div class="md:col-span-5 flex justify-center">
              <div class="w-full max-w-[300px] bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                <div class="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white flex items-center justify-between">
                  <div>
                    <p class="text-[10px] uppercase tracking-wider opacity-85 font-semibold">Carnet Sanitario</p>
                    <p class="font-bold text-sm">Clínica Veterinaria Demo</p>
                  </div>
                  <span class="bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">✓ Al día</span>
                </div>
                <div class="p-5 space-y-4">
                  <div class="flex items-center gap-3.5">
                    <div class="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-3xl shrink-0">
                      🐕
                    </div>
                    <div>
                      <h3 class="font-extrabold text-slate-900 text-lg leading-tight">Max</h3>
                      <p class="text-xs text-slate-500">Canino • Mestizo • 3 años</p>
                      <span class="inline-block mt-1 text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Chip: 981020000451</span>
                    </div>
                  </div>

                  <div class="border-t border-slate-100 pt-3 space-y-2">
                    <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Últimos Registros</p>
                    <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex justify-between items-center">
                      <div>
                        <p class="text-xs font-bold text-slate-800">Vacuna Óctuple</p>
                        <p class="text-[10px] text-slate-500">Aplicada: 12 Oct 2026</p>
                      </div>
                      <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Vigente</span>
                    </div>
                    <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex justify-between items-center">
                      <div>
                        <p class="text-xs font-bold text-slate-800">Antirrábica Anual</p>
                        <p class="text-[10px] text-slate-500">Aplicada: 12 Oct 2026</p>
                      </div>
                      <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Vigente</span>
                    </div>
                  </div>

                  <a href="${demoCardUrl}" class="block text-center w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl transition-colors">
                    Abrir ficha real en vivo →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Cómo Funciona (3 Pasos) -->
        <section class="bg-white border-y border-slate-200 py-14">
          <div class="max-w-5xl mx-auto px-4">
            <div class="text-center max-w-xl mx-auto mb-10">
              <h2 class="text-2xl font-extrabold text-slate-900">Simple para la clínica, útil para el tutor</h2>
              <p class="text-sm text-slate-500 mt-1.5">Pensado para agilizar la atención en consulta y evitar carnets de papel extraviados.</p>
            </div>

            <div class="grid sm:grid-cols-3 gap-6">
              <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-extrabold flex items-center justify-center text-sm">1</span>
                <h3 class="font-bold text-slate-900 text-base">Crea la ficha del paciente</h3>
                <p class="text-xs text-slate-600 leading-relaxed">Registra fotografía, microchip, datos del tutor y cada vacuna o control aplicado desde un panel limpio y rápido.</p>
              </div>

              <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-extrabold flex items-center justify-center text-sm">2</span>
                <h3 class="font-bold text-slate-900 text-base">Genera y descarga su QR</h3>
                <p class="text-xs text-slate-600 leading-relaxed">Cada mascota obtiene un código QR único listo para imprimir, adherir al carnet físico o grabar en su placa identificatoria.</p>
              </div>

              <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-extrabold flex items-center justify-center text-sm">3</span>
                <h3 class="font-bold text-slate-900 text-base">Acceso móvil inmediato</h3>
                <p class="text-xs text-slate-600 leading-relaxed">Al escanear el QR, cualquier persona o veterinario visualiza el historial actualizado y puede contactar al tutor por WhatsApp en caso de extravío.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- CTA Clínicas Piloto -->
        <section class="max-w-5xl mx-auto px-4 py-14">
          <div class="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div class="space-y-2 text-center md:text-left max-w-lg">
              <h2 class="text-xl sm:text-2xl font-extrabold">¿Tienes una clínica o consulta veterinaria?</h2>
              <p class="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Implementa carnets digitales personalizados con el nombre de tu clínica. Solicita una cuenta piloto gratuita para evaluar el sistema con tus pacientes.
              </p>
            </div>
            <div class="flex flex-col sm:flex-row gap-3 shrink-0">
              <a href="/?view=login&demo=1" class="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-5 py-3.5 rounded-xl transition-colors text-center">
                Probar Panel Demo
              </a>
              <a href="mailto:renato.lopez.espinoza@gmail.com?subject=Solicitud%20Cuenta%20Piloto%20-%20Carnet%20Salud%20Digital" class="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-5 py-3.5 rounded-xl transition-colors text-center border border-white/15">
                Solicitar Acceso Clínica
              </a>
            </div>
          </div>
        </section>
      </main>

      <!-- Footer -->
      <footer class="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p>Carnet Salud Digital • Desarrollado por <a href="https://renlespinoza.github.io/Portafolio/" target="_blank" rel="noopener noreferrer" class="font-semibold text-slate-700 hover:text-emerald-600 underline">Renato López Espinoza</a></p>
      </footer>
    </div>
  `;
}
