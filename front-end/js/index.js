const token = localStorage.getItem("token");

if (token != null) {
    // Token exists, show navbar after login/register
    window.location.href = 'profile.html'
}

/* Register form */
document.querySelector("#show-register")
    .addEventListener("click", function(){
        // Close login popup if it's open
        document.querySelector(".login-popup").classList.remove("active");
        // Show register popup
        document.querySelector(".register-popup").classList.add("active");
})

document.querySelector(".register-popup .close-btn")
    .addEventListener("click", function(){
        document.querySelector(".register-popup").classList.remove("active");
})

document.querySelector("#show-register2")
    .addEventListener("click", function(){
        // Close login popup if it's open
        document.querySelector(".login-popup").classList.remove("active");
        // Show register popup
        document.querySelector(".register-popup").classList.add("active");
})

document.querySelector(".register-popup .close-btn")
    .addEventListener("click", function(){
        document.querySelector(".register-popup").classList.remove("active");
})

/* Login form */
document.querySelector("#show-login")
    .addEventListener("click", function(){
        // Close register popup if it's open
        document.querySelector(".register-popup").classList.remove("active");
        // Show login popup
        document.querySelector(".login-popup").classList.add("active");
})

document.querySelector(".login-popup .close-btn")
    .addEventListener("click", function(){
        document.querySelector(".login-popup").classList.remove("active");
})