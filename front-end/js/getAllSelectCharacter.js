function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);

    localStorage.setItem('currentCharacterAmount',responseData.data.currentCharacterAmount)
  
    const characterList = document.getElementById("characterList");
    responseData.data.characterList.forEach((character) => {
        var type;
        if (character.character_class == 'Mage' || character.character_class == 'Summoner') {
            character.type = character.mana
            type = 'mana'
        } else {
            character.type = character.energy
            type ='energy'
        }
        const displayItem = document.createElement("div");
        displayItem.className = "character"
        displayItem.innerHTML = `
            <img src="img/${character.character_class}.webp" alt="${character.character_class}.webp">
                    <div class="details">
                        <div class="name">
                            ${character.character_name}
                        </div>
                        <div class="title">
                            <button id="${character.character_id}" onclick = "selectCharacter(this.id)">Select</button>
                            ${character.character_class} | Lvl ${character.lvl}
                        </div>
                        <div class="specification">
                            <div>
                                <p>HP</p>
                                <p>${character.hp}</p>
                            </div>
                            <div>
                                <p>ATK</p>
                                <p>${character.atk}</p>
                            </div>
                            <div>
                                <p>ATK SPEED</p>
                                <p>${character.atk_spd}</p>
                            </div>
                            <div>
                                <p>AGILITY</p>
                                <p>${character.movement_spd}</p>
                            </div>
                            <div>
                                <p>${type.toUpperCase()}</p>
                                <p>${character.type}</p>
                            </div>
                        </div>
                        <div class="specification">
                            <div>
                                <p>PASSIVE</p>
                                <p>${character.passive}</p>
                            </div>
                            <div>
                                <p>SKILL 1</p>
                                <p>${character.skill1}</p>
                            </div>
                            <div>
                                <p>SKILL 2</p>
                                <p>${character.skill2}</p>
                            </div>
                            <div>
                                <p>PET</p>
                                <p>${character.pet_name}</p>
                            </div>
                            <div>
                                <p>PET LVL</p>
                                <p>${character.pet_lvl}</p>
                            </div>
                        </div>
                        <div class="specification">
                            <div>
                                <p>HELMET</p>
                                <p>${character.helmet}</p>
                            </div>
                            <div>
                                <p>CHESTPLATE</p>
                                <p>${character.chestplate}</p>
                            </div>
                            <div>
                                <p>LEGGINGS</p>
                                <p>${character.leggings}</p>
                            </div>
                            <div>
                                <p>WEAPON</p>
                                <p>${character.weapon}</p>
                            </div>
                            <div>
                                <p>FACTION</p>
                                <p>${character.faction}</p>
                            </div>
                        </div>
                </div>
                `
        characterList.appendChild(displayItem)
        });
    };

const user_id = localStorage.getItem('user_id')

jqueryMethod(`${currentUrl}/api/characters/${user_id}`, callback)
