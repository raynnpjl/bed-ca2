function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

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

function goBack() {
    setCookie('tempCharacterName', '', 0)
    window.location.href = "character.html"
}

function selectClass(characterClass) {
    document.cookie = `tempCharacterClass = ${characterClass}`
    window.location.href = 'selectPet.html'
}