import {logout} from "./auth.js"
import { loadView } from "./handleRoutes.js";
import { updateUIBasedOnAuth } from "./auth.js";
import { loadTemplate } from "./utils/handleTemplate.js";
import { BASE_PATH } from "./handleRoutes.js";
import { User } from "./localDb.js";

let isOpen = false;

export async function renderUserWidget(user: User) {
  const template = await loadTemplate(`${BASE_PATH}/views/templates/userWidgetMenu.tpl.html`);
  if (!template) {
    console.error("Template not found");
    return;
  }
  const clone = template.content.cloneNode(true) as HTMLElement;
  const userName = user.userName ? user.userName : user.email;

  try { 
    clone.querySelector("#userName")!.textContent = userName;
    clone.querySelector(".avatar")!.setAttribute("src", user.avatar || `${BASE_PATH}/img/defaultAvatar.png`);
  } catch (error) {
    console.error("Error setting user name or avatar:", error);
  }
  
  const container = document.getElementById("userWidgetContainer");
  if (!container) {
    console.error("Container not found");
    return;
  }
  container.innerHTML = "";
  container.appendChild(clone);



  const dropDownBtn = document.querySelector("#userWidget button");
  const dropDownMenu = document.querySelector("#userWidget > div.absolute");
  if (dropDownBtn && dropDownMenu) {
      dropDownBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (isOpen)
              closeMenu();
          else
              openMenu();
      });

      document.addEventListener("click", (e) => {
          if (isOpen && !dropDownMenu.contains(e.target as Node))
              closeMenu();
      })
  }

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
      logout();
  });

  document.getElementById("settingsBtn")?.addEventListener("click", () => {
    closeMenu();
    history.pushState({}, "", "/settings");
    loadView("/settings");
  });

  document.getElementById("scoresBtn")?.addEventListener("click", () => {
      alert("redirection to scores");
  });
}

function closeMenu() {
  const dropDownBtn = document.querySelector("#userWidget button");
  const dropDownMenu = document.querySelector("#userWidget > div.absolute");
  if (dropDownBtn && dropDownMenu) {
    dropDownMenu.classList.remove("opacity-100", "translate-y-0", "block");
    dropDownMenu.classList.add("opacity-0", "translate-y-1");
    isOpen = false;
  }
}

function openMenu() {
  const dropDownBtn = document.querySelector("#userWidget button");
  const dropDownMenu = document.querySelector("#userWidget > div.absolute");
  if (dropDownBtn && dropDownMenu) {
      dropDownMenu.classList.remove("opacity-0", "translate-y-1");
      dropDownMenu.classList.add("opacity-100", "translate-y-0", "block");
      dropDownMenu.classList.add("transition", "ease-out", "duration-200");
      isOpen = true;
  }
}

export async function setupSettingsForm() {
  const template = await loadTemplate(`${BASE_PATH}/views/templates/settingsUserWidgetMenu.tpl.html`);
  if (!template) {
    console.error("settingsUserWidgetMenu template not found");
    return;
  }
  const clone = template.content.cloneNode(true) as HTMLElement;

  const userJson = sessionStorage.getItem("user1");
  if (!userJson) return;
  const user = JSON.parse(userJson);
  const userName = user.userName ? user.userName : user.email;
  try { 
    clone.querySelector("#userName")!.textContent = userName;
    clone.querySelector(".avatar")!.setAttribute("src", user.avatar || `${BASE_PATH}/img/defaultAvatar.png`);
  } catch (error) {
    console.error("Error setting user name or avatar:", error);
  }

  const container = document.getElementById("settingsContainer");
  if (!container) {
    console.error("Container not found");
    return;
  }
  container.innerHTML = "";
  container.appendChild(clone);


  const settingsForm = document.getElementById("settingsForm");
  const emailInput = document.getElementById("email") as HTMLInputElement;
  const usernameInput = document.getElementById("username") as HTMLInputElement;
  const avatarInput = document.getElementById("avatar") as HTMLInputElement;

  settingsForm!.addEventListener("submit", (e) => {
    e.preventDefault();

    const enteredEmail = emailInput.value.trim();
    const storageEmail = user.email;

    if (enteredEmail.toLowerCase() !== storageEmail.toLowerCase()) {
      emailInput.classList.add("border", "border-red-500", "focus:border-red-500");
      emailInput.value = "";
      emailInput.placeholder = "Email incorrect";
      emailInput.focus();
      return;
    }

    user.userName = usernameInput.value.trim();
    if (avatarInput.files && avatarInput.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        user.avatar = reader.result as string;
        sessionStorage.setItem("user1", JSON.stringify(user));
        finishSettingsUpdate();
      };
      reader.readAsDataURL(avatarInput.files[0]);
    } else {
      sessionStorage.setItem("user1", JSON.stringify(user));
      finishSettingsUpdate();
    }
  });

  function finishSettingsUpdate() {
    if (container)
        container.innerHTML = "";
    history.replaceState({}, "", "/");
    loadView("/");
    renderUserWidget(user);
    updateUIBasedOnAuth();
  }

  emailInput.addEventListener("input", () => {
    emailInput.classList.remove("border-red-500", "focus:border-red-500");
    emailInput.placeholder = "";
  });
}
