import { API_URL } from "./config.js";

export async function renderDashboard(appContainer) {
  const token = localStorage.getItem("vetToken");
  const user = JSON.parse(localStorage.getItem("vetUser") || "{}");

  let currentPetId = null;
  let editingPetId = null;
  let editingRecordId = null;
  let allPets = [];

  const speciesBackgrounds = {
    Perro:
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80",
    Gato: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80",
    Conejo:
      "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80",
    Ave: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80",
    Otro: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=600&q=80",
  };

  appContainer.innerHTML = `
    <div class="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div class="max-w-5xl mx-auto space-y-6">
        
        <!-- Header -->
        <div class="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-slate-800">Panel Veterinario 🐾</h1>
            <p class="text-xs text-slate-500 mt-1">
              Bienvenido/a, <span class="font-bold text-emerald-600">${user.vetName || "Doctor/a"}</span>
            </p>
          </div>
          <div class="flex items-center gap-3">
            <button id="openRegisterModal" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow transition-colors flex items-center gap-2">
              <span>+ Nueva Mascota</span>
            </button>
            <button id="logoutBtn" class="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold py-2.5 px-3 rounded-xl transition-colors">
              Salir
            </button>
          </div>
        </div>

        <!-- Listado + Buscador en tiempo real -->
        <div class="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h2 class="text-sm font-bold text-slate-400 uppercase tracking-wider">Pacientes Registrados</h2>
              <p id="petsCounter" class="text-[11px] text-slate-400 mt-0.5"></p>
            </div>
            <div class="relative w-full sm:w-72">
              <span class="absolute inset-y-0 left-3 flex items-center text-slate-400 text-xs">🔍</span>
              <input 
                type="text" 
                id="searchInput" 
                placeholder="Buscar mascota, tutor o microchip..." 
                class="w-full pl-8 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50 focus:bg-white transition-colors"
              />
            </div>
          </div>
          
          <div id="petsContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <p class="text-xs text-slate-400 col-span-full text-center py-8">Cargando pacientes...</p>
          </div>
        </div>

      </div>
    </div>

    <!-- Modal 1: Crear / Editar Mascota -->
    <div id="petModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm hidden items-center justify-center p-4 z-50">
      <div class="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h3 id="petModalTitle" class="text-lg font-bold text-slate-800">Registrar Paciente</h3>
          <button id="closeModal" class="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
        </div>

        <form id="createPetForm" class="space-y-3">
          <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
            <img id="photoPreview" src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=200&q=70" alt="Vista previa" class="w-16 h-16 rounded-xl object-cover border border-white shadow-sm shrink-0" />
            <div class="flex-1 min-w-0">
              <label class="block text-[11px] font-bold uppercase text-slate-600 mb-1">Fotografía del Paciente</label>
              <input type="file" id="petPhoto" accept="image/jpeg,image/png,image/webp" class="block w-full text-[11px] text-slate-500 file:mr-2.5 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200 cursor-pointer" />
              <p class="text-[10px] text-slate-400 mt-1">JPG, PNG o WEBP (máx. 5 MB)</p>
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Nombre de la Mascota *</label>
            <input type="text" id="petName" required placeholder="Ej: Paltita" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Especie *</label>
              <select id="petSpecies" required class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
                <option value="Conejo">Conejo</option>
                <option value="Ave">Ave</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Raza</label>
              <input type="text" id="petBreed" placeholder="Ej: Bombay" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">N° Microchip</label>
              <input type="text" id="petMicrochip" placeholder="988000000..." class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Fecha Nacimiento</label>
              <input type="date" id="petBirthDate" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
          </div>

          <hr class="border-slate-100 my-2" />

          <div>
            <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Nombre Tutor *</label>
            <input type="text" id="ownerName" required placeholder="Ej: Renato López" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>

          <div>
            <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Teléfono Tutor *</label>
            <input type="text" id="ownerPhone" required placeholder="+56912345678" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>

          <div id="formError" class="hidden p-2.5 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 text-center"></div>

          <button type="submit" id="savePetBtn" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow text-xs transition-colors mt-2">
            Guardar Paciente y Generar QR
          </button>
        </form>

        <div id="qrResult" class="hidden text-center space-y-3 pt-2">
          <div class="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col items-center">
            <p class="text-xs font-bold text-emerald-900 mb-2">¡Paciente Creado Exitosamente! 🎉</p>
            <img id="qrImage" src="" alt="Código QR Mascota" class="w-40 h-40 rounded-xl shadow border border-white" />
            <p class="text-[10px] text-slate-500 mt-2 font-mono" id="qrPublicId"></p>
          </div>
          <a id="downloadQrBtn" download="carnet-qr.png" href="" class="block w-full bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold py-2 rounded-xl shadow transition-colors">
            Descargar Imagen QR
          </a>
          <button id="finishBtn" class="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 rounded-xl transition-colors">
            Cerrar y Volver al Listado
          </button>
        </div>

      </div>
    </div>

    <!-- Modal 2: Crear / Editar Registro Médico -->
    <div id="vaccineModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm hidden items-center justify-center p-4 z-50">
      <div class="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h3 id="vaccineModalTitle" class="text-lg font-bold text-slate-800">Agregar Registro Médico 💉</h3>
          <button id="closeVaccineModal" class="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
        </div>

        <form id="createVaccineForm" class="space-y-3">
          <div>
            <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Tipo de Registro *</label>
            <select id="vacType" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none">
              <option value="Vacuna">Vacuna</option>
              <option value="Procedimiento">Procedimiento / Desparasitación</option>
              <option value="Control">Control Clínico</option>
            </select>
          </div>

          <div>
            <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Título *</label>
            <input type="text" id="vacTitle" required placeholder="Ej: Triple Felina, Antirrábica, Desparasitación" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Fecha Aplicación *</label>
              <input type="date" id="vacDateApplied" required class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Próxima Dosis</label>
              <input type="date" id="vacNextDueDate" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1">Observaciones / Notas</label>
            <textarea id="vacNotes" rows="2" placeholder="Lote, marca o comentarios adicionales..." class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none resize-none"></textarea>
          </div>

          <div id="vaccineError" class="hidden p-2.5 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 text-center"></div>

          <button type="submit" id="saveVaccineBtn" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow text-xs transition-colors mt-2">
            Guardar Registro Médico
          </button>
        </form>
      </div>
    </div>

    <!-- Modal 3: Ver, Editar o Eliminar Historial Médico de un Paciente -->
    <div id="historyModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm hidden items-center justify-center p-4 z-50">
      <div class="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 max-h-[88vh] flex flex-col">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 id="historyModalTitle" class="text-lg font-bold text-slate-800">Historial Clínico</h3>
            <p class="text-[11px] text-slate-400">Edita o elimina registros aplicados al paciente</p>
          </div>
          <button id="closeHistoryModal" class="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
        </div>

        <div id="historyListContainer" class="flex-1 overflow-y-auto space-y-2.5 pr-1"></div>

        <div class="pt-4 mt-4 border-t border-slate-100 flex justify-between gap-2">
          <button id="addFromHistoryBtn" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl shadow transition-colors">
            + Nuevo Registro
          </button>
          <button id="doneHistoryBtn" class="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl transition-colors">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  `;

  // Referencias DOM
  const petsContainer = document.getElementById("petsContainer");
  const petsCounter = document.getElementById("petsCounter");
  const searchInput = document.getElementById("searchInput");
  const petModal = document.getElementById("petModal");
  const petModalTitle = document.getElementById("petModalTitle");
  const savePetBtn = document.getElementById("savePetBtn");
  const petPhotoInput = document.getElementById("petPhoto");
  const photoPreview = document.getElementById("photoPreview");
  const petSpeciesSelect = document.getElementById("petSpecies");
  const vaccineModal = document.getElementById("vaccineModal");
  const vaccineModalTitle = document.getElementById("vaccineModalTitle");
  const saveVaccineBtn = document.getElementById("saveVaccineBtn");
  const historyModal = document.getElementById("historyModal");
  const historyModalTitle = document.getElementById("historyModalTitle");
  const historyListContainer = document.getElementById("historyListContainer");
  const closeHistoryModal = document.getElementById("closeHistoryModal");
  const doneHistoryBtn = document.getElementById("doneHistoryBtn");
  const addFromHistoryBtn = document.getElementById("addFromHistoryBtn");
  const openRegisterModal = document.getElementById("openRegisterModal");
  const closeModal = document.getElementById("closeModal");
  const closeVaccineModal = document.getElementById("closeVaccineModal");
  const createPetForm = document.getElementById("createPetForm");
  const createVaccineForm = document.getElementById("createVaccineForm");
  const formError = document.getElementById("formError");
  const vaccineError = document.getElementById("vaccineError");
  const qrResult = document.getElementById("qrResult");
  const qrImage = document.getElementById("qrImage");
  const qrPublicId = document.getElementById("qrPublicId");
  const downloadQrBtn = document.getElementById("downloadQrBtn");
  const finishBtn = document.getElementById("finishBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  const todayStr = new Date().toISOString().split("T")[0];

  const resolvePetPhoto = (pet) => {
    if (pet.photoUrl) {
      return pet.photoUrl.startsWith("http")
        ? pet.photoUrl
        : `${API_URL}${pet.photoUrl}`;
    }
    return speciesBackgrounds[pet.species] || speciesBackgrounds.Otro;
  };

  const formatDateShort = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  petPhotoInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      photoPreview.src = URL.createObjectURL(file);
    }
  };

  petSpeciesSelect.onchange = () => {
    if (!petPhotoInput.files.length && !editingPetId) {
      photoPreview.src =
        speciesBackgrounds[petSpeciesSelect.value] || speciesBackgrounds.Otro;
    }
  };

  openRegisterModal.onclick = () => {
    editingPetId = null;
    petModalTitle.textContent = "Registrar Paciente";
    savePetBtn.textContent = "Guardar Paciente y Generar QR";
    createPetForm.reset();
    photoPreview.src = speciesBackgrounds.Perro;
    createPetForm.classList.remove("hidden");
    qrResult.classList.add("hidden");
    formError.classList.add("hidden");
    petModal.classList.remove("hidden");
    petModal.classList.add("flex");
  };

  const hideModal = () => {
    editingPetId = null;
    petModal.classList.add("hidden");
    petModal.classList.remove("flex");
  };

  closeModal.onclick = hideModal;
  finishBtn.onclick = () => {
    hideModal();
    loadPets();
  };

  const hideVaccineModal = () => {
    editingRecordId = null;
    vaccineModal.classList.add("hidden");
    vaccineModal.classList.remove("flex");
  };

  closeVaccineModal.onclick = hideVaccineModal;

  const hideHistoryModal = () => {
    historyModal.classList.add("hidden");
    historyModal.classList.remove("flex");
  };

  closeHistoryModal.onclick = hideHistoryModal;
  doneHistoryBtn.onclick = hideHistoryModal;

  addFromHistoryBtn.onclick = () => {
    hideHistoryModal();
    openCreateVaccineModal(currentPetId);
  };

  function openCreateVaccineModal(petId) {
    currentPetId = petId;
    editingRecordId = null;
    vaccineModalTitle.textContent = "Agregar Registro Médico 💉";
    saveVaccineBtn.textContent = "Guardar Registro Médico";
    createVaccineForm.reset();
    document.getElementById("vacDateApplied").value = todayStr;
    vaccineError.classList.add("hidden");
    vaccineModal.classList.remove("hidden");
    vaccineModal.classList.add("flex");
  }

  function openPetHistoryModal(petId) {
    currentPetId = petId;
    const pet = allPets.find((p) => String(p.id) === String(petId));
    if (!pet) return;

    const records = pet.MedicalRecords || [];
    historyModalTitle.textContent = `Historial de ${pet.name} (${records.length})`;

    if (records.length === 0) {
      historyListContainer.innerHTML = `
        <div class="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p class="text-xs font-bold text-slate-600">Sin registros médicos todavía</p>
          <p class="text-[11px] text-slate-400 mt-1">Haz clic en "+ Nuevo Registro" para agregar el primero.</p>
        </div>
      `;
    } else {
      historyListContainer.innerHTML = records
        .map(
          (rec) => `
          <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start justify-between gap-3">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1.5">
                <span class="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">${rec.type || "Vacuna"}</span>
                <span class="text-[10px] text-slate-500 font-medium">${formatDateShort(rec.dateApplied)}</span>
              </div>
              <p class="text-xs font-bold text-slate-800 mt-1 truncate">${rec.title}</p>
              ${rec.notes ? `<p class="text-[11px] text-slate-500 mt-0.5 line-clamp-2">${rec.notes}</p>` : ""}
              ${rec.nextDueDate ? `<p class="text-[10px] font-semibold text-emerald-700 mt-1">Próxima: ${formatDateShort(rec.nextDueDate)}</p>` : ""}
            </div>
            <div class="flex items-center gap-1 shrink-0">
              <button 
                data-record-id="${rec.id}"
                class="edit-record-btn bg-white hover:bg-amber-500 hover:text-white text-slate-700 text-[11px] p-1.5 rounded-lg border border-slate-200 shadow-sm transition-colors"
                title="Editar registro"
              >
                ✏️
              </button>
              <button 
                data-record-id="${rec.id}"
                data-record-title="${rec.title}"
                class="delete-record-btn bg-white hover:bg-red-600 hover:text-white text-slate-700 text-[11px] p-1.5 rounded-lg border border-slate-200 shadow-sm transition-colors"
                title="Eliminar registro"
              >
                🗑️
              </button>
            </div>
          </div>
        `,
        )
        .join("");

      // Eventos editar registro médico
      historyListContainer
        .querySelectorAll(".edit-record-btn")
        .forEach((btn) => {
          btn.onclick = (e) => {
            const recId = e.currentTarget.getAttribute("data-record-id");
            const rec = records.find((r) => String(r.id) === String(recId));
            if (!rec) return;

            hideHistoryModal();
            editingRecordId = rec.id;
            vaccineModalTitle.textContent = "Editar Registro Médico";
            saveVaccineBtn.textContent = "Actualizar Registro";

            document.getElementById("vacType").value = rec.type || "Vacuna";
            document.getElementById("vacTitle").value = rec.title || "";
            document.getElementById("vacDateApplied").value = rec.dateApplied
              ? rec.dateApplied.split("T")[0]
              : "";
            document.getElementById("vacNextDueDate").value = rec.nextDueDate
              ? rec.nextDueDate.split("T")[0]
              : "";
            document.getElementById("vacNotes").value = rec.notes || "";

            vaccineError.classList.add("hidden");
            vaccineModal.classList.remove("hidden");
            vaccineModal.classList.add("flex");
          };
        });

      // Eventos eliminar registro médico
      historyListContainer
        .querySelectorAll(".delete-record-btn")
        .forEach((btn) => {
          btn.onclick = async (e) => {
            const recId = e.currentTarget.getAttribute("data-record-id");
            const recTitle = e.currentTarget.getAttribute("data-record-title");

            if (!confirm(`¿Eliminar el registro "${recTitle}"?`)) return;

            try {
              const res = await fetch(`${API_URL}/api/records/${recId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              });
              const data = await res.json();
              if (!res.ok)
                throw new Error(data.message || "Error al eliminar registro");

              await loadPets();
              openPetHistoryModal(currentPetId);
            } catch (err) {
              alert(err.message);
            }
          };
        });
    }

    historyModal.classList.remove("hidden");
    historyModal.classList.add("flex");
  }

  logoutBtn.onclick = () => {
    localStorage.removeItem("vetToken");
    localStorage.removeItem("vetUser");
    window.location.href = "/?view=login";
  };

  function renderPetCards(petsList) {
    petsCounter.textContent = `Mostrando ${petsList.length} de ${allPets.length} pacientes`;

    if (petsList.length === 0) {
      petsContainer.innerHTML = `
        <div class="col-span-full text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <span class="text-3xl">🐶</span>
          <p class="text-xs font-bold text-slate-600 mt-2">No se encontraron pacientes</p>
          <p class="text-[11px] text-slate-400">Intenta con otro término o registra una nueva mascota.</p>
        </div>
      `;
      return;
    }

    petsContainer.innerHTML = petsList
      .map((pet) => {
        const bgImage = resolvePetPhoto(pet);
        const recordsCount = (pet.MedicalRecords || []).length;
        const speciesIcon =
          pet.species === "Gato"
            ? "🐱"
            : pet.species === "Conejo"
              ? "🐰"
              : pet.species === "Ave"
                ? "🦜"
                : "🐶";

        return `
        <div class="group relative overflow-hidden rounded-2xl border border-white/60 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[235px]">
          
          <div 
            class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" 
            style="background-image: url('${bgImage}');"
          ></div>

          <div class="relative z-10 flex-1 flex flex-col justify-between p-4 bg-white/70 backdrop-blur-[2px] group-hover:bg-white/60 transition-colors">
            <div>
              <div class="flex items-center justify-between gap-2">
                <span class="text-lg bg-white/90 w-8 h-8 rounded-xl flex items-center justify-center shadow-sm border border-white">
                  ${speciesIcon}
                </span>
                <div class="flex items-center gap-1">
                  <button 
                    data-public-id="${pet.publicId}" 
                    data-pet-name="${pet.name}"
                    class="download-card-qr text-[10px] font-bold bg-white/90 hover:bg-slate-800 hover:text-white text-slate-700 px-2 py-1 rounded-full shadow-sm border border-slate-200/80 transition-colors"
                    title="Descargar Código QR"
                  >
                    ⬇ QR
                  </button>
                  <a 
                    href="/?p=${pet.publicId}" 
                    target="_blank" 
                    class="text-[10px] font-mono bg-emerald-500/90 hover:bg-emerald-600 text-white font-bold px-2 py-1 rounded-full shadow-sm transition-colors"
                  >
                    Carnet ↗
                  </a>
                </div>
              </div>

              <div class="flex items-start justify-between gap-2 mt-3">
                <div>
                  <h3 class="font-extrabold text-slate-900 text-base tracking-tight leading-tight">${pet.name}</h3>
                  <p class="text-xs font-medium text-slate-700">${pet.species} • ${pet.breed || "Sin raza"}</p>
                </div>
                <div class="flex items-center gap-1">
                  <button 
                    data-pet-id="${pet.id}" 
                    class="edit-pet-btn bg-white/85 hover:bg-amber-500 hover:text-white text-slate-700 text-[11px] p-1.5 rounded-lg shadow-sm border border-slate-200/70 transition-colors"
                    title="Editar datos o foto"
                  >
                    ✏️
                  </button>
                  <button 
                    data-pet-id="${pet.id}" 
                    data-pet-name="${pet.name}"
                    class="delete-pet-btn bg-white/85 hover:bg-red-600 hover:text-white text-slate-700 text-[11px] p-1.5 rounded-lg shadow-sm border border-slate-200/70 transition-colors"
                    title="Eliminar paciente"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              ${pet.microchip ? `<p class="text-[10px] font-mono text-slate-600 mt-1 bg-white/60 inline-block px-2 py-0.5 rounded-md">Chip: ${pet.microchip}</p>` : ""}

              <div class="mt-3 pt-2.5 border-t border-slate-900/10 text-xs">
                <p class="text-slate-700 font-medium">Tutor: <span class="font-bold text-slate-900">${pet.ownerName}</span></p>
                <p class="text-slate-600 text-[11px] font-medium">${pet.ownerPhone}</p>
              </div>
            </div>
            
            <div class="mt-4 grid grid-cols-2 gap-1.5">
              <button 
                data-pet-id="${pet.id}" 
                class="view-history-btn bg-white/90 hover:bg-white text-slate-800 text-[11px] font-bold py-2 px-2 rounded-xl transition-colors shadow-sm border border-slate-200/80 flex items-center justify-center gap-1"
              >
                <span>📋 Historial (${recordsCount})</span>
              </button>
              <button 
                data-pet-id="${pet.id}" 
                class="add-vaccine-btn bg-slate-900/90 hover:bg-slate-900 text-white text-[11px] font-bold py-2 px-2 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1"
              >
                <span>💉 + Vacuna</span>
              </button>
            </div>
          </div>
        </div>
      `;
      })
      .join("");

    document.querySelectorAll(".view-history-btn").forEach((btn) => {
      btn.onclick = (e) => {
        openPetHistoryModal(e.currentTarget.getAttribute("data-pet-id"));
      };
    });

    document.querySelectorAll(".add-vaccine-btn").forEach((btn) => {
      btn.onclick = (e) => {
        openCreateVaccineModal(e.currentTarget.getAttribute("data-pet-id"));
      };
    });

    document.querySelectorAll(".edit-pet-btn").forEach((btn) => {
      btn.onclick = (e) => {
        const id = e.currentTarget.getAttribute("data-pet-id");
        const pet = allPets.find((p) => String(p.id) === String(id));
        if (!pet) return;

        editingPetId = pet.id;
        petModalTitle.textContent = `Editar a ${pet.name}`;
        savePetBtn.textContent = "Guardar Cambios";

        createPetForm.reset();
        photoPreview.src = resolvePetPhoto(pet);
        document.getElementById("petName").value = pet.name || "";
        document.getElementById("petSpecies").value = pet.species || "Perro";
        document.getElementById("petBreed").value = pet.breed || "";
        document.getElementById("petMicrochip").value = pet.microchip || "";
        document.getElementById("petBirthDate").value = pet.birthDate
          ? pet.birthDate.split("T")[0]
          : "";
        document.getElementById("ownerName").value = pet.ownerName || "";
        document.getElementById("ownerPhone").value = pet.ownerPhone || "";

        createPetForm.classList.remove("hidden");
        qrResult.classList.add("hidden");
        formError.classList.add("hidden");
        petModal.classList.remove("hidden");
        petModal.classList.add("flex");
      };
    });

    document.querySelectorAll(".delete-pet-btn").forEach((btn) => {
      btn.onclick = async (e) => {
        const id = e.currentTarget.getAttribute("data-pet-id");
        const petName = e.currentTarget.getAttribute("data-pet-name");

        if (
          !confirm(
            `¿Seguro que deseas eliminar a "${petName}" y todo su historial médico? Esta acción no se puede deshacer.`,
          )
        ) {
          return;
        }

        try {
          const res = await fetch(`${API_URL}/api/pets/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });

          const data = await res.json();
          if (!res.ok)
            throw new Error(data.message || "Error al eliminar el paciente");

          loadPets();
        } catch (err) {
          alert(err.message);
        }
      };
    });

    document.querySelectorAll(".download-card-qr").forEach((btn) => {
      btn.onclick = async (e) => {
        const button = e.currentTarget;
        const publicId = button.getAttribute("data-public-id");
        const petName = button.getAttribute("data-pet-name");
        const originalText = button.textContent;

        try {
          button.textContent = "⏳...";
          button.disabled = true;

          const res = await fetch(`${API_URL}/api/pets/public/${publicId}/qr`);
          const data = await res.json();
          if (!res.ok) throw new Error("Error al obtener QR");

          const link = document.createElement("a");
          link.href = data.qrCodeImage;
          link.download = `QR-${petName}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (err) {
          alert("No se pudo descargar el QR de esta mascota.");
        } finally {
          button.textContent = originalText;
          button.disabled = false;
        }
      };
    });
  }

  searchInput.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase().trim();
    const filtered = allPets.filter(
      (pet) =>
        pet.name.toLowerCase().includes(term) ||
        pet.ownerName.toLowerCase().includes(term) ||
        (pet.microchip && pet.microchip.toLowerCase().includes(term)),
    );
    renderPetCards(filtered);
  });

  async function loadPets() {
    try {
      const res = await fetch(`${API_URL}/api/pets/my-pets`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("vetToken");
        localStorage.removeItem("vetUser");
        window.location.href = "/?view=login";
        return;
      }

      if (!res.ok) throw new Error("Error al cargar la lista de pacientes.");

      allPets = await res.json();
      renderPetCards(allPets);
    } catch (err) {
      petsContainer.innerHTML = `<p class="text-xs text-red-500 col-span-full text-center">${err.message}</p>`;
    }
  }

  createPetForm.onsubmit = async (e) => {
    e.preventDefault();
    formError.classList.add("hidden");

    const formData = new FormData();
    formData.append("name", document.getElementById("petName").value.trim());
    formData.append("species", document.getElementById("petSpecies").value);
    formData.append("breed", document.getElementById("petBreed").value.trim());
    formData.append(
      "microchip",
      document.getElementById("petMicrochip").value.trim(),
    );
    formData.append("birthDate", document.getElementById("petBirthDate").value);
    formData.append(
      "ownerName",
      document.getElementById("ownerName").value.trim(),
    );
    formData.append(
      "ownerPhone",
      document.getElementById("ownerPhone").value.trim(),
    );

    if (petPhotoInput.files[0]) {
      formData.append("photo", petPhotoInput.files[0]);
    }

    const isEditing = Boolean(editingPetId);
    const url = isEditing
      ? `${API_URL}/api/pets/${editingPetId}`
      : `${API_URL}/api/pets`;
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Error al guardar la mascota");

      if (isEditing) {
        hideModal();
        loadPets();
      } else {
        createPetForm.classList.add("hidden");
        qrImage.src = data.qrCodeImage;
        downloadQrBtn.href = data.qrCodeImage;
        downloadQrBtn.download = `QR-${data.pet.name}.png`;
        qrPublicId.textContent = `ID Público: ${data.pet.publicId}`;
        qrResult.classList.remove("hidden");
      }
    } catch (err) {
      formError.textContent = err.message;
      formError.classList.remove("hidden");
    }
  };

  // Submit Vacuna / Procedimiento (Crear o Editar según editingRecordId)
  createVaccineForm.onsubmit = async (e) => {
    e.preventDefault();
    vaccineError.classList.add("hidden");

    const vaccineData = {
      petId: currentPetId,
      type: document.getElementById("vacType").value || "Vacuna",
      title: document.getElementById("vacTitle").value.trim(),
      dateApplied: document.getElementById("vacDateApplied").value,
      nextDueDate: document.getElementById("vacNextDueDate").value || null,
      notes: document.getElementById("vacNotes").value.trim() || null,
    };

    const isEditingRec = Boolean(editingRecordId);
    const url = isEditingRec
      ? `${API_URL}/api/records/${editingRecordId}`
      : `${API_URL}/api/records`;
    const method = isEditingRec ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(vaccineData),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Error al guardar el registro médico");

      hideVaccineModal();
      await loadPets();
      if (isEditingRec) {
        openPetHistoryModal(currentPetId);
      }
    } catch (err) {
      vaccineError.textContent = err.message;
      vaccineError.classList.remove("hidden");
    }
  };

  loadPets();
}
