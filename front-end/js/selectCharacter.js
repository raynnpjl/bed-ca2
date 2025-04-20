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
    setCookie('tempBossId', '', 0)
    window.location.href = "selectBoss.html"
}

document.querySelector(".minLvl-popup .close-btn")
    .addEventListener("click", function(){
        document.querySelector(".minLvl-popup").classList.remove("active");
})

document.querySelector(".successFight-popup .close-btn")
    .addEventListener("click", function(){
        document.querySelector(".successFight-popup").classList.remove("active");
        window.location.href = "selectBoss.html"
})

function selectCharacter(character_id) {
    const bossId = getCookie('tempBossId')

    const data = {
        character_id:character_id
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

        const user_id = localStorage.getItem('user_id')

        if (responseStatus == 403) {
            document.querySelector(".minLvl-popup").classList.add("active");
        } else {
            jqueryMethod(`${currentUrl}/api/inventory/${user_id}`, callbackInventory)
            setCookie('tempBossId', '', 0)
            document.querySelector(".successFight-popup").classList.add("active");
        }
    };

    jqueryMethod(`${currentUrl}/api/bosses/${bossId}`, callback, 'POST', data)
}