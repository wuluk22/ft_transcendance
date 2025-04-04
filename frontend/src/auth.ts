import { loadView } from "./handleRoutes.js";

export function isLoggedIn(): boolean {
    return sessionStorage.getItem("isLoggedIn") === "true";
}

export function logout(): void {
    sessionStorage.setItem("isLoggedIn", "false");
    sessionStorage.removeItem("user1");
    history.replaceState({}, "", "/");
    loadView("/");
    updateUIBasedOnAuth();
}

export function updateUIBasedOnAuth(): void {
    const registerBtn = document.getElementById("signInBtn");
    const loginBtn = document.getElementById("logInBtn");
    const gameBtn = document.getElementById("gameBtn");
    const userWidgetMenu = document.getElementById("userWidget");

    if (isLoggedIn()) {
      if (registerBtn) registerBtn.classList.add("hidden");
      if (loginBtn) loginBtn.classList.add("hidden");
      if (gameBtn) gameBtn.classList.remove("hidden");
    } else {
      if (registerBtn) registerBtn.classList.remove("hidden");
      if (loginBtn) loginBtn.classList.remove("hidden");
      if (gameBtn) gameBtn.classList.add("hidden");
      if (userWidgetMenu) userWidgetMenu.classList.add("hidden");
    }
  }