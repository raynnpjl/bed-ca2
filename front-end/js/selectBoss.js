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

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

document.querySelector(".noCharacter-popup .close-btn")
    .addEventListener("click", function(){
        document.querySelector(".noCharacter-popup").classList.remove("active");
})

function selectBoss(boss) {
    const currentCharacterAmount = localStorage.getItem('currentCharacterAmount')
    if (currentCharacterAmount == 0) {
        document.querySelector(".noCharacter-popup").classList.add("active");
    } else {
        document.cookie = `tempBossId = ${boss}`
        window.location.href = 'selectCharacter.html'
    }
}