function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
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
    setCookie('tempCharacterClass', '', 0)
    window.location.href = "selectClass.html"
}

function selectPet(characterPet) {
    const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        setCookie('tempCharacterName', '', 0)
        setCookie('tempCharacterClass', '', 0)
        window.location.href = 'character.html'
    };

    const user_id = localStorage.getItem('user_id');
    const character_name = getCookie('tempCharacterName');
    const character_class = getCookie('tempCharacterClass');
    const pet_name = characterPet

    const data = {
        user_id: user_id,
        character_name: character_name,
        character_class: character_class,
        pet_name: pet_name
    }

    jqueryMethod(`${currentUrl}/api/characters`, callback, 'POST', data)
}