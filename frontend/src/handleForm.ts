import { loadView } from "./handleRoutes.js"
import {renderUserWidget} from "./userWidget.js"
import { BASE_PATH } from "./handleRoutes.js";
import { updateUIBasedOnAuth } from "./auth.js";
import { getUserByEmail, saveUser } from "./localDb.js";

export function setupRegisterListeners(): void{
    const signInForm = document.getElementById("signInForm") as HTMLFormElement;
    const closeform = document.getElementById("closeForm") as HTMLButtonElement;
    
    const lastnameInput = document.getElementById("lastname") as HTMLInputElement;
    const firstnameInput = document.getElementById("firstname") as HTMLInputElement;
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;

    signInForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const lastname = lastnameInput.value.trim();
        const firstname = firstnameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        const User = {
            firstName: firstname,
            lastName: lastname,
            userName: "",
            email: email,
            password: password,
            avatar: `${BASE_PATH}/img/avatar.jpg`,
        };
        const foundUser = getUserByEmail(email);
        if (foundUser !== undefined) {
            emailInput.classList.add("border-red-500");
            emailInput.value = "";
            emailInput.placeholder = "Email already used";
            emailInput.focus();
        }
        else {
            if (lastname === "" || firstname === "" || email === "" || password === "") {
                if (lastname === "") {
                    lastnameInput.value = "";
                    lastnameInput.placeholder = "Lastname required";
                    lastnameInput.focus();
                }
                if (firstname === "") {
                    firstnameInput.value = "";
                    firstnameInput.placeholder = "Firstname required";
                    firstnameInput.focus();
                }
                if (email === "") {
                    emailInput.value = "";
                    emailInput.placeholder = "Email required";
                    emailInput.focus();
                }
                if (password === "") {
                    passwordInput.value = "";
                    passwordInput.placeholder = "Password required";
                    passwordInput.focus();
                }
            } else {
                saveUser(User);
                alert("Account created!");
                history.replaceState({}, "", "/");
                loadView("/");
            }
        }
    })
    closeform.addEventListener("click", () => {
        signInForm.classList.add("hidden");
        history.replaceState({}, "", "/");
    });
    // signInForm.addEventListener("click", (e) => {
    //     if (e.target === signInForm) {
    //         signInForm.remove();
    //         history.replaceState({}, "", "/");
    //     }
    // })
}

export function removeErrorStyleLogIn(input: HTMLInputElement, style: string): void{
    input.classList.remove(style);
}

export function setupLoginListeners(): void{
    const loginForm = document.getElementById("logInForm") as HTMLFormElement;
    const loginModal = document.getElementById("loginModal") as HTMLDivElement;
    
    const emailInput = document.getElementById("lastname") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    
    emailInput.addEventListener("click", () => removeErrorStyleLogIn(emailInput, "border-red-500"));
    passwordInput.addEventListener("click", () => removeErrorStyleLogIn(passwordInput, "border-red-500"));

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        const foundUser = getUserByEmail(email);
        if (foundUser?.email === email && foundUser?.password === password) {
            sessionStorage.setItem("isLoggedIn", "true");
            alert("Connected!");
            history.replaceState({}, "", "/");
            loadView("/");
            renderUserWidget(foundUser);
            updateUIBasedOnAuth();
        }
        else {
            alert("User doesn't exist, please register first");
            // add a link to register
            emailInput.value = "";
        }
    })
    loginModal.addEventListener("click", (e) => {
        if (e.target === loginModal) {
            loginModal.remove();
            history.replaceState({}, "", "/");
        }
    })
}