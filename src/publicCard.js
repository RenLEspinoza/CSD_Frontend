import { API_URL } from "./config.js";

export async function renderPublicCard(appContainer, publicId) {
  appContainer.innerHTML = `
    <div class="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div class="text-center space-y-3">
        <div class="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">Cargando Carnet Digital...</p>
      </div>
    </div>
  `;

  try {
    const res = await fetch(`${API_URL}/api/pets/public/${publicId}`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "No se encontró el carnet solicitado.");
    }

    const pet = data.pet || data;
    const records =
      pet.MedicalRecords || pet.medicalRecords || data.records || [];

    const speciesFallbacks = {
      Perro:
        "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=85",
      Gato: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=85",
      Conejo:
        "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=85",
      Ave: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=800&q=85",
      Otro: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=800&q=85",
    };

    const heroPhotoUrl = pet.photoUrl
      ? pet.photoUrl.startsWith("http")
        ? pet.photoUrl
        : `${API_URL}${pet.photoUrl}`
      : speciesFallbacks[pet.species] || speciesFallbacks.Otro;

    const formatDate = (dateStr) => {
      if (!dateStr) return null;
      const date = new Date(dateStr);
      return date.toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      });
    };

    const calculateAge = (birthDateStr) => {
      if (!birthDateStr) return "Edad no registrada";
      const birth = new Date(birthDateStr);
      const now = new Date();
      let years = now.getFullYear() - birth.getFullYear();
      let months = now.getMonth() - birth.getMonth();
      if (months < 0) {
        years--;
        months += 12;
      }
      if (years > 0)
        return `${years} ${years === 1 ? "año" : "años"}${months > 0 ? `, ${months} m` : ""}`;
      return `${months} ${months === 1 ? "mes" : "meses"}`;
    };

    const cleanPhone = (pet.ownerPhone || "").replace(/\D/g, "");
    const waMessage = encodeURIComponent(
      `Hola ${pet.ownerName}, acabo de escanear el Carnet Digital QR de ${pet.name}.`,
    );
    const waUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${waMessage}`
      : "#";

    const sortedRecords = [...records].sort(
      (a, b) => new Date(b.dateApplied) - new Date(a.dateApplied),
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const hasOverdue = sortedRecords.some(
      (rec) => rec.nextDueDate && new Date(rec.nextDueDate) < today,
    );

    const overallStatusBadge = hasOverdue
      ? `<span class="bg-amber-500/95 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">⚠️ Refuerzo pendiente</span>`
      : `<span class="bg-emerald-500/95 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">✓ Al día</span>`;

    appContainer.innerHTML = `
      <div class="min-h-screen bg-gradient-to-b from-slate-200 via-slate-100 to-slate-200 py-6 px-4 flex justify-center">
        <div class="w-full max-w-md space-y-4">

          <!-- Tarjeta 1: Credencial Hero Panorámica -->
          <div class="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white">
            
            <div class="relative h-64 w-full bg-slate-800">
              <img 
                src="${heroPhotoUrl}" 
                alt="${pet.name}" 
                class="w-full h-full object-cover object-center"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/25 to-black/30"></div>

              <!-- Badges superiores -->
              <div class="absolute top-4 inset-x-4 flex justify-between items-center">
                <span class="inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/20">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Carnet Salud Digital
                </span>
                ${overallStatusBadge}
              </div>

              <!-- Nombre, especie, edad e ID -->
              <div class="absolute bottom-4 inset-x-5 text-white">
                <div class="flex items-end justify-between gap-2">
                  <div>
                    <h1 class="text-3xl font-extrabold tracking-tight leading-none drop-shadow-sm">${pet.name}</h1>
                    <p class="text-xs text-slate-200 font-medium mt-1.5">
                      ${pet.species} • ${pet.breed || "Sin raza"} • <span class="text-emerald-300 font-bold">${calculateAge(pet.birthDate)}</span>
                    </p>
                  </div>
                  <span class="text-[11px] font-mono bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15 text-slate-100 shrink-0">
                    #${pet.publicId}
                  </span>
                </div>
              </div>
            </div>

            <!-- Datos de Identificación y Tutor -->
            <div class="p-5 space-y-4">
              <div class="grid grid-cols-2 gap-2.5">
                <div class="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wide">Nacimiento</p>
                  <p class="text-xs font-bold text-slate-800 mt-0.5">
                    ${formatDate(pet.birthDate) || "No registrado"}
                  </p>
                </div>
                <div class="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <p class="text-[10px] font-bold uppercase text-slate-400 tracking-wide">Microchip</p>
                  ${
                    pet.microchip
                      ? `<button id="copyChipBtn" data-chip="${pet.microchip}" class="text-xs font-mono font-bold text-slate-800 mt-0.5 flex items-center gap-1.5 hover:text-emerald-600 transition-colors" title="Copiar número">
                          <span class="truncate">${pet.microchip}</span>
                          <span class="text-[11px]">📋</span>
                        </button>`
                      : `<p class="text-xs font-bold text-slate-400 mt-0.5">Sin chip</p>`
                  }
                </div>
              </div>

              <!-- Bloque Tutor Responsable -->
              <div class="bg-emerald-50/75 rounded-2xl p-4 border border-emerald-100 space-y-3">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-[10px] font-bold uppercase text-emerald-700 tracking-wider">Tutor Responsable</p>
                    <p class="text-sm font-extrabold text-slate-800 mt-0.5">${pet.ownerName}</p>
                    <p class="text-xs font-mono text-slate-600">${pet.ownerPhone}</p>
                  </div>
                  <div class="w-10 h-10 rounded-xl bg-emerald-100/90 text-emerald-700 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-2 pt-0.5">
                  <a 
                    href="tel:${pet.ownerPhone}" 
                    class="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                  >
                    <span>📞 Llamar</span>
                  </a>
                  <a 
                    href="${waUrl}" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                  >
                    <span>💬 WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Tarjeta 2: Historial Clínico -->
          <div class="bg-white rounded-3xl shadow-xl p-5 border border-slate-100">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h2 class="text-sm font-extrabold text-slate-800 uppercase tracking-wide">Historial Clínico 💉</h2>
                <p class="text-[11px] text-slate-400">Vacunas y procedimientos verificados</p>
              </div>
              <span class="bg-slate-100 text-slate-600 text-[11px] font-bold px-2.5 py-1 rounded-full">
                ${sortedRecords.length} ${sortedRecords.length === 1 ? "registro" : "registros"}
              </span>
            </div>

            ${
              sortedRecords.length === 0
                ? `
                  <div class="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <span class="text-2xl">🩺</span>
                    <p class="text-xs font-bold text-slate-600 mt-2">Sin registros clínicos aún</p>
                    <p class="text-[11px] text-slate-400 mt-0.5">Las vacunas y procedimientos aparecerán aquí.</p>
                  </div>
                `
                : `
                  <div class="relative pl-5 border-l-2 border-emerald-200 space-y-4 my-2">
                    ${sortedRecords
                      .map((rec) => {
                        const recType = rec.type || "Vacuna";
                        const isVaccine = recType.toLowerCase() === "vacuna";
                        const typeBadgeClass = isVaccine
                          ? "text-emerald-700 bg-emerald-100/70"
                          : "text-teal-700 bg-teal-100/70";
                        const dotClass = isVaccine
                          ? "bg-emerald-500"
                          : "bg-teal-500";

                        let statusBadge = "";
                        if (rec.nextDueDate) {
                          const nextDate = new Date(rec.nextDueDate);
                          const isOverdue = nextDate < today;
                          statusBadge = isOverdue
                            ? `<span class="inline-block bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">⚠️ Refuerzo vencido: ${formatDate(rec.nextDueDate)}</span>`
                            : `<span class="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">✅ Próxima: ${formatDate(rec.nextDueDate)}</span>`;
                        }

                        return `
                        <div class="relative bg-slate-50 rounded-2xl p-3.5 border border-slate-200/70">
                          <span class="absolute -left-[27px] top-4 w-3 h-3 rounded-full ${dotClass} ring-4 ring-white"></span>
                          
                          <div class="flex items-start justify-between gap-2">
                            <div>
                              <span class="text-[9px] font-bold uppercase tracking-wider ${typeBadgeClass} px-1.5 py-0.5 rounded">${recType}</span>
                              <h3 class="text-sm font-bold text-slate-800 mt-1">${rec.title}</h3>
                            </div>
                            <span class="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200 shrink-0">
                              ${formatDate(rec.dateApplied)}
                            </span>
                          </div>

                          ${rec.notes ? `<p class="text-xs text-slate-600 mt-1.5 leading-relaxed">${rec.notes}</p>` : ""}
                          
                          ${statusBadge ? `<div class="mt-2.5">${statusBadge}</div>` : ""}
                        </div>
                      `;
                      })
                      .join("")}
                  </div>
                `
            }
          </div>

          <!-- Footer -->
<div class="text-center py-2 space-y-1">
  ${pet.User?.vetName ? `<p class="text-[11px] text-slate-500 font-medium">Emitido por <span class="font-bold text-slate-700">${pet.User.vetName}</span></p>` : ""}
  <a href="/?view=login" class="inline-block text-[10px] text-slate-400 hover:text-emerald-600 transition-colors">
    Portal Veterinario • Carnet Salud Digital
  </a>
</div>

        </div>
      </div>
    `;

    const copyChipBtn = document.getElementById("copyChipBtn");
    if (copyChipBtn) {
      copyChipBtn.onclick = async () => {
        const chip = copyChipBtn.getAttribute("data-chip");
        await navigator.clipboard.writeText(chip);
        const originalHTML = copyChipBtn.innerHTML;
        copyChipBtn.innerHTML = `<span class="text-emerald-600">¡Copiado! ✓</span>`;
        setTimeout(() => {
          copyChipBtn.innerHTML = originalHTML;
        }, 1500);
      };
    }
  } catch (err) {
    appContainer.innerHTML = `
      <div class="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-xl border border-slate-200 space-y-3">
          <span class="text-4xl block">❌</span>
          <h2 class="text-lg font-extrabold text-slate-800">Carnet no encontrado</h2>
          <p class="text-xs text-slate-500">${err.message}</p>
          <a href="/" class="inline-block mt-2 bg-slate-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors">
            Volver al inicio
          </a>
        </div>
      </div>
    `;
  }
}
