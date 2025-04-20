function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/* createCharacter Popup */
document.querySelector("#show-characterForm")
    .addEventListener("click", function(){
        const currentCharacterAmount = localStorage.getItem('currentCharacterAmount');
        if (currentCharacterAmount >= 2) {
            document.querySelector(".characterLimit-popup").classList.add("active");
        } else {
            // Show login popup
            document.querySelector(".character-popup").classList.add("active");
        }
})

document.querySelector(".character-popup .close-btn")
    .addEventListener("click", function(){
        document.querySelector(".character-popup").classList.remove("active");
})

document.querySelector(".characterLimit-popup .close-btn")
    .addEventListener("click", function(){
        document.querySelector(".characterLimit-popup").classList.remove("active");
})

document.querySelector(".levelUp-popup .close-btn")
    .addEventListener("click", function(){
        document.querySelector(".levelUp-popup").classList.remove("active");
})

document.querySelector(".pet1-popup .close-btn")
    .addEventListener("click", function(){
        document.querySelector(".pet1-popup").classList.remove("active");
})

document.querySelector(".pet2-popup .close-btn")
    .addEventListener("click", function(){
        document.querySelector(".pet2-popup").classList.remove("active");
})

document.querySelector(".unEquip-popup .close-btn")
    .addEventListener("click", function(){
    setCookie('tempCharacterName', '', 0)
    document.querySelector(".unEquip-popup").classList.remove("active");
})

document.querySelector(".unEquipUnsuccess-popup .close-btn")
    .addEventListener("click", function(){
        document.querySelector(".unEquipUnsuccess-popup").classList.remove("active");
})

/* unEquip */
function unEquip(character_name) {
    document.cookie = `tempCharacterName = ${character_name}`
    document.querySelector(".unEquip-popup").classList.add("active");
}

function unEquipItem(item_type) {
    const callback = (responseStatus, responseData) => {

        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        if (responseStatus == 200) {
            document.querySelector(".unEquip-popup").classList.remove("active");
            setCookie('tempCharacterName', '', 0)
            window.location.reload()
        } else {
            setCookie('tempCharacterName', '', 0)
            document.querySelector(".unEquip-popup").classList.remove("active");
            document.querySelector(".unEquipUnsuccess-popup").classList.add("active");
        }
    }

    const character_name = getCookie('tempCharacterName')
    const user_id = localStorage.getItem('user_id')

    data = {
        item_type: item_type
    }

    jqueryMethod(`${currentUrl}/api/characters/${user_id}/${character_name}/unequip`, callback, 'PUT', data)
}

/* Level up character */
function levelUpCharacter(character_name) {
    const callback = (responseStatus, responseData) => {

        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        if (responseStatus == 403) {
            document.querySelector(".levelUp-popup").classList.add("active");
        } else {
            window.location.reload()
        }
    }

    const user_id = localStorage.getItem('user_id')

    jqueryMethod(`${currentUrl}/api/characters/${user_id}/${character_name}/level`, callback, 'PUT')
}

/* Evolve Pet */
function evolvePet(character_name) {
    const callback = (responseStatus, responseData) => {

        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        if (responseStatus == 403) {
            document.querySelector(".pet1-popup").classList.add("active");
        } else if (responseStatus == 204) {
            document.querySelector(".pet2-popup").classList.add("active")
        } else {
            window.location.reload()
        }
    }

    const user_id = localStorage.getItem('user_id')

    jqueryMethod(`${currentUrl}/api/characters/${user_id}/${character_name}/pet/evolve`, callback, 'PUT')
}

/* delete Character */
function deleteCharacter(character_name) {
    const callback = (responseStatus, responseData) => {

        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        if (responseStatus == 204) {
            window.location.reload()
        }
    }

    const user_id = localStorage.getItem('user_id')
    const currentCharacterAmount = localStorage.getItem('currentCharacterAmount')
    const newCharacterAmount = currentCharacterAmount - 1

    localStorage.setItem('currentCharacterAmoun', newCharacterAmount)

    console.log(newCharacterAmount)

    jqueryMethod(`${currentUrl}/api/characters/${user_id}/${character_name}`, callback, 'DELETE')
}