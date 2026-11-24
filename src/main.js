// src/main.js

import "./style.css";
import { renderPublicCard } from "./publicCard";
import { renderLogin } from "./login";
import { renderDashboard } from "./dashboard";
import { renderLanding } from "./landing";

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
  // 4. Landing Page Principal
  renderLanding(app);
}
