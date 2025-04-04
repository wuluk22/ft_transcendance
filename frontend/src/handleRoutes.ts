import { setupRegisterListeners, setupLoginListeners } from "./handleForm.js";
import { updateUIBasedOnAuth, isLoggedIn } from "./auth.js";
import {setupSettingsForm} from "./userWidget.js";

export const BASE_PATH = window.location.origin + window.location.pathname.split("/").slice(0, -1).join("/");
const currentPath = window.location.pathname as staticRoute;
type staticRoute = "/login" | "/register" | "/";
type dynamicRoute = "/settings" | "/scores" | "/game";
type Route = staticRoute | dynamicRoute;

const routes: Record<staticRoute, string> = {
  "/": `${BASE_PATH}/views/home.html`,
  "/register": `${BASE_PATH}/views/signInForm.html`,
  "/login": `${BASE_PATH}/views/logInForm.html`,
};

export async function loadView(path: Route) {
  const container = document.getElementById("FormContainer");
  const pongCanva = document.getElementById("renderCanvas");
  // container settings ??

  if (container) container.innerHTML = "";
  if (pongCanva) {
    pongCanva.classList.add("hidden");
    pongCanva!.style.pointerEvents = "none";
  }
  
  if (path === "/settings") {
    if (!isLoggedIn()) {
      alert("You need to be logged to acces to settings");
      history.replaceState({}, "", "/");
      loadView("/");
      updateUIBasedOnAuth();
      return;
    }
    console.log("settings");
    await setupSettingsForm();
    console.log("settings done");
    updateUIBasedOnAuth();
    const loginModalSet = document.getElementById("loginModalSettings");
    if (loginModalSet) {
      loginModalSet.addEventListener("click", (e) => {
        if (e.target === loginModalSet) {
            loginModalSet.remove();
            history.replaceState({}, "", "/");
        }
      })
    }
  }
  if (path === "/game") {
    const title = document.getElementById("gameBtn");
    if (!isLoggedIn()) {
      alert("You need to be logged to play");
      history.replaceState({}, "", "/");
      loadView("/");
      updateUIBasedOnAuth();
      return;
    }
  if (pongCanva) {
    pongCanva.classList.remove("hidden");
    pongCanva.style.pointerEvents = "auto";
  } else {
      console.error("Game canvas not found!");
    }
    updateUIBasedOnAuth();
    title!.classList.add("hidden");
  }

  const viewPath = routes[path as staticRoute];
  console.log("viewPath", viewPath);
  if (!viewPath) {
    console.error(`View not found for path: ${path}`);
    return;
  }
  try {
    const response = await fetch(viewPath);
    const html = await response.text();
    
    if (path === "/login" || path === "/register") {
      container!.innerHTML = html;
      if (path === "/login") setupLoginListeners();
      if (path === "/register") setupRegisterListeners();
    }
    if (path === "/") container!.innerHTML = html;
  } catch (err) {
    container!.innerHTML = "<p>View not found</p>";
  }
}

function navigateTo(path: Route) {
  history.pushState({}, "", path);
  loadView(path);
  updateUIBasedOnAuth();
}

function setupNavLinks() {
  const buttons = document.querySelectorAll("[data-route]");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const route = (btn as HTMLButtonElement).dataset.route as Route;
      navigateTo(route);
    });
  });
}

window.addEventListener("popstate", () => {
  const path = window.location.pathname as Route;
  loadView(path);
});

document.addEventListener("DOMContentLoaded", () => {
  setupNavLinks();
  if(routes[currentPath])
    loadView(currentPath);
  else {
    history.replaceState({}, "", "/");
    loadView("/");
  }
});
