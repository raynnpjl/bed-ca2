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

/* Go Back */
function goBack() {
    setCookie('tempItem', '', 0)
    window.location.href = "inventory.html"
}

document.querySelector(".equipped-popup .close-btn")
    .addEventListener("click", function(){
        document.querySelector(".equipped-popup").classList.remove("active");
        setCookie('tempItem', '', 0)
        window.location.href = "inventory.html"
})

document.querySelector(".equipment-popup .close-btn")
    .addEventListener("click", function(){
        document.querySelector(".equipment-popup").classList.remove("active");
})

function equip(character_name) {
    const item = getCookie('tempItem')
    const user_id = localStorage.getItem('user_id')

    const data = {
        item: item
    }

    const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        const callbackInventory = (responseStatus, responseData) => {
            console.log("responseStatus:", responseStatus);
            console.log("responseData:", responseData);
        
            if (responseStatus == 200) {
                document.cookie = `inventoryItem = ${JSON.stringify(responseData.data[0].items)}`
                document.cookie = `inventoryGold = ${responseData.data[0].gold}`
            }
        };
        
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

        const user_id = localStorage.getItem('user_id')

        if (responseStatus == 403) {
            document.querySelector(".equipment-popup").classList.add("active");
        } else {
            setCookie('inventoryItem', '', 0)
            setCookie('inventoryGold', '', 0)
            jqueryMethod(`${currentUrl}/api/inventory/${user_id}`, callbackInventory)
            document.querySelector(".equipped-popup").classList.add("active")
        }
    };

    jqueryMethod(`${currentUrl}/api/characters/${user_id}/${character_name}/equip`, callback, 'PUT', data)
}
