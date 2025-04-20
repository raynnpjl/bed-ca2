/* Class carousel */
let nextButton = document.getElementById('next');
let prevButton = document.getElementById('prev');
let backButton = document.getElementById('back');
let seeMoreButtons = document.querySelectorAll('.seeMore');
let carousel = document.querySelector('.carousel')
let listHTML = document.querySelector('.carousel .list')

nextButton.onclick = function() {
    showSlider('next')
}

prevButton.onclick = function() {
    showSlider('prev')
}

let unAcceptClick;
const showSlider = (type) => {
    nextButton.style.pointerEvents = 'none';
    nextButton.style.pointerEvents = 'none';

    carousel.classList.remove('prev', 'next')

    let items = document.querySelectorAll('.carousel .list .item');
    if (type === 'next') {
        listHTML.appendChild(items[0]);
        carousel.classList.add(type)
    } else {
        let positionLast = items.length - 1;
        listHTML.prepend(items[positionLast]);
        carousel.classList.add(type)
    }

    clearTimeout(unAcceptClick)
    unAcceptClick = setTimeout(() => {
        nextButton.style.pointerEvents = 'auto';
        prevButton.style.pointerEvents = 'auto';
    }, 2000);
}

/* seeMoreButtons.forEach(button => {
    button.onclick = function() {
        carousel.classList.add('showDetail');
    }
}) */

backButton.onclick = function() {
    carousel.classList.remove('showDetail')
}

//function for seeMore button onclick
function seeMore() {
    carousel.classList.add('showDetail')
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
