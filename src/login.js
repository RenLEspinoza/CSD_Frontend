import { API_URL } from "./config.js";

export function renderLogin(appContainer) {
  appContainer.innerHTML = `
    <div class="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div class="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-slate-200">
        
        <div class="text-center mb-6">
          <span class="text-4xl">🔐</span>
          <h2 class="text-2xl font-bold text-slate-800 mt-2">Acceso Veterinaria</h2>
          <p class="text-xs text-slate-500 mt-1">Ingresa tus credenciales para administrar mascotas y fichas.</p>
        </div>

        <form id="loginForm" class="space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Correo Electrónico</label>
            <input 
              type="email" 
              id="email" 
              required 
              placeholder="juanita@vet.com"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              required 
              placeholder="••••••••"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          <div id="errorMessage" class="hidden p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 text-center font-medium"></div>

          <button 
            type="submit" 
            id="submitBtn"
            class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors text-sm flex items-center justify-center gap-2"
          >
            <span>Iniciar Sesión</span>
          </button>

          <button 
            type="button" 
            id="btn-fill-demo" 
            class="w-full mt-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs transition-colors border border-slate-200"
          >
            🧪 Usar cuenta de demostración
          </button>
        </form>

        <div class="mt-6 text-center border-t border-slate-100 pt-4">
          <a href="/" class="text-xs text-slate-400 hover:text-slate-600 font-medium">← Volver al inicio</a>
        </div>

      </div>
    </div>
  `;

  const loginForm = appContainer.querySelector("#loginForm");
  const emailInput = appContainer.querySelector("#email");
  const passwordInput = appContainer.querySelector("#password");
  const errorMessage = appContainer.querySelector("#errorMessage");
  const submitBtn = appContainer.querySelector("#submitBtn");

  const fillDemoCredentials = () => {
    const currentEmail = appContainer.querySelector("#email");
    const currentPassword = appContainer.querySelector("#password");
    const currentError = appContainer.querySelector("#errorMessage");
    if (!currentEmail || !currentPassword) return;

    currentEmail.value = "demo@carnetvet.cl";
    currentPassword.value = "DemoVet2026";
    currentError?.classList.add("hidden");
    currentEmail.dispatchEvent(new Event("input", { bubbles: true }));
    currentPassword.dispatchEvent(new Event("input", { bubbles: true }));
  };

  // Delegación de eventos sobre el contenedor para evitar listeners perdidos al re-renderizar
  appContainer.addEventListener("click", (e) => {
    const demoBtn = e.target.closest("#btn-fill-demo");
    if (!demoBtn) return;

    e.preventDefault();
    fillDemoCredentials();
  });

  // Si viene desde ?view=login&demo=1, rellena automáticamente al cargar
  if (new URLSearchParams(window.location.search).get("demo") === "1") {
    fillDemoCredentials();
  }

  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMessage.classList.add("hidden");
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Cargando...</span>`;

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      localStorage.setItem("vetToken", data.token);
      localStorage.setItem("vetUser", JSON.stringify(data.user));

      window.location.href = "/?view=dashboard";
    } catch (err) {
      errorMessage.textContent = err.message;
      errorMessage.classList.remove("hidden");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Iniciar Sesión</span>`;
    }
  });
}
