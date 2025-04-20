function editUser() {
    document.querySelector(".editUser-popup").classList.add("active");
}

function editPassword() {
    document.querySelector(".editPassword-popup").classList.add("active");
}

document.querySelector(".editUser-popup .close-btn")
    .addEventListener("click", function(){
        document.querySelector(".editUser-popup").classList.remove("active");
})

document.querySelector(".editPassword-popup .close-btn")
    .addEventListener("click", function(){
        document.querySelector(".editPassword-popup").classList.remove("active");
})