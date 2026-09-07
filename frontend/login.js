import { login } from "./api.js"

// this is seperate from everything else since it's just login
const loginForm = document.querySelector("#login-form form");
console.log(loginForm);
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(loginForm);

    try {
        await login({ "password": data.get("password")});
        window.location.href = "/index.html";
        init();
    } catch (err) {
        document.querySelector("#login-error").textContent = "Incorrect password."
    }
    
})