document.addEventListener("DOMContentLoaded", function() {
    const logoutButton = document.getElementById("logoutButton")
    
    const token = localStorage.getItem("token");

    if (token != null) {
        // Token exists, show navbar after login/register
        document.querySelector(".before").classList.remove("active");
        document.querySelector(".after").classList.add("active");
        document.querySelector(".registerButton").classList.remove("active")
    } else {
        // Token does not exists, show navbar before login/register
        document.querySelector(".before").classList.add("active");
        document.querySelector(".after").classList.remove("active");
        document.querySelector(".registerButton").classList.add("active")
    }

    logoutButton.addEventListener("click", function () {
        // Remove the token from local storage and redirect user to index.html
/*         localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        localStorage.removeItem("currentCharacterAmount") */
        localStorage.clear()
        // Remove all cookie from the document
        document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
        window.location.href = "index.html"
    })
})