import "./style.css";
import { renderPublicCard } from "./publicCard";
import { renderLogin } from "./login";
import { renderDashboard } from "./dashboard";

const app = document.querySelector("#app");

const urlParams = new URLSearchParams(window.location.search);
const publicId = urlParams.get("p");
const view = urlParams.get("view");

const token = localStorage.getItem("vetToken");

if (publicId) {
  // 1. Ficha Pública por QR
  renderPublicCard(app, publicId);
} else if (view === "login") {
  // 2. Vista de Login
  renderLogin(app);
} else if (view === "dashboard") {
  // 3. Panel de Administración (Protegido con Token)
  if (!token) {
    window.location.href = "/?view=login";
  } else {
    renderDashboard(app);
  }
} else {
  // 4. Pantalla de Bienvenida Principal
  app.innerHTML = `
    <div class="min-h-screen flex items-center justify-center p-4 bg-slate-100">
      <div class="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full text-center border border-slate-200">
        <span class="text-4xl">🐾</span>
        <h1 class="text-2xl font-bold text-slate-800 mt-2">Carnet Digital Veterinario</h1>
        <p class="text-slate-500 text-sm mt-1 mb-4">Gestión de fichas médicas y carnets QR para mascotas.</p>
        
        <div class="space-y-2">
          <a href="/?view=login" class="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow">
            Acceso Veterinaria
          </a>
        </div>
      </div>
    </div>
  `;
}
