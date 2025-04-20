const callbackGear = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);

    const inventoryList = document.getElementById("inventoryList");
    const putGold = document.getElementById("putGold")

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const inventoryItem = JSON.parse(getCookie('inventoryItem'))
    const inventoryGold = getCookie('inventoryGold')

    const displayGold = document.createElement("span");
    displayGold.innerHTML = `
         | Gold: ${inventoryGold}
    `

    putGold.appendChild(displayGold)

    inventoryItem.forEach((item) => {
        responseData.data.forEach((gear) => {
            if (gear.item == item) {
                var type;
                if (gear.part == 'weapon') {
                    type = gear.category
                } else {
                    type = gear.part
                }

                var rarity;
                if (gear.rarity == 'Common') {
                    rarity = '#A9A9A9'
                } else if (gear.rarity == 'Rare') {
                    rarity = '#0000FF'
                } else if (gear.rarity == 'Epic') {
                    rarity = '#BF40BF'
                } else {
                    rarity = '#FFBF00'
                }

                const displayItem = document.createElement("div");
                displayItem.innerHTML = `
                        <div class="card" style="--color: ${rarity}">
                            <div class="card-info">
                                <div class="title">
                                <img src="img/${type}.png" alt="${type}.png">
                                <br>
                                ${gear.item}
                                </div>
                                <div class="detail">
                                    <b><span style="color: ${rarity}">${gear.rarity}</span></b>
                                    <br>
                                    ${gear.item_desc}
                                </div>
                                <div class="points">
                                    <b>Type</b>: ${type.charAt(0).toUpperCase() + type.slice(1)}
                                </div>
                                <div class="button">
                                    <button id="${gear.item}" onClick="goEquip(this.id)">Equip</button>
                                </div>
                            </div>
                        </div>
                        `
                inventoryList.appendChild(displayItem)
            }
        })
    })
  };

jqueryMethod(`${currentUrl}/api/bosses/drops_info`, callbackGear)
