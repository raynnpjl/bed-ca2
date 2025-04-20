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

/* Review form */
document.querySelector(".review-popup .close-btn")
    .addEventListener("click", function(){
        document.querySelector(".review-popup").classList.remove("active");
})

function openReviewForm() {
    document.querySelector(".review-popup").classList.add("active");
}

/* Edit Review form */
document.querySelector(".edit-popup .close-btn")
    .addEventListener("click", function(){
        document.querySelector(".edit-popup").classList.remove("active");
})

function openEditForm() {
    document.querySelector(".edit-popup").classList.add("active");
}

/* Slider */
const mySlider = document.getElementById("my-slider");
const sliderValue = document.getElementById("slider-value")

const mySlider2 = document.getElementById("my-slider2");
const sliderValue2 = document.getElementById("slider-value2")

function slider() {
    valPercent = (mySlider.value / mySlider.max) * 100;
    mySlider.style.background = `linear-gradient(to right, #3264fe, ${valPercent}%, #d5d5d5 ${valPercent}%)`;
    sliderValue.textContent = (mySlider.value) * 0.05
}

function slider2() {
    valPercent = (mySlider2.value / mySlider2.max) * 100;
    mySlider2.style.background = `linear-gradient(to right, #3264fe, ${valPercent}%, #d5d5d5 ${valPercent}%)`;
    sliderValue2.textContent = (mySlider2.value) * 0.05
}
slider();
slider2();