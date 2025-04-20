const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);
  
    const classList = document.getElementById("classList");
    responseData.data.forEach((classEle) => {
        var type;
        if (classEle.class == 'Mage' || classEle.class == 'Summoner') {
            classEle.type = classEle.mana
            type = 'mana'
        } else {
            classEle.type = classEle.energy
            type ='energy'
        }
      const displayItem = document.createElement("div");
        displayItem.className = "item"
        displayItem.innerHTML = `
                <img src="img/${classEle.class}.webp" alt="${classEle.class}.png">
                <div class="intro">
                    <div class="title">
                        <span>CLASS</span>
                    </div>
                    <div class="topic">
                        ${classEle.class}
                    </div>
                    <div class="desc">
                        ${classEle.description}
                    </div>
                    <button onclick = "seeMore()" class="seeMore">
                        More details
                    </button>
                    <button id="${classEle.class}" class="seeMore" onclick = "selectClass(this.id)">
                        Select
                    </button>
                </div>
                <div class="detail">
                    <div class="title">
                        ${classEle.class}
                    </div>
                    <div class="desc">
                        ${classEle.description}
                    </div>
                    <div class="specifications">
                        <div>
                            <p>HP</p>
                            <p>${classEle.hp}</p>
                        </div>
                        <div>
                            <p>ATK</p>
                            <p>${classEle.atk}</p>
                        </div>
                        <div>
                            <p>ATK SPEED</p>
                            <p>${classEle.atk_spd}</p>
                        </div>
                        <div>
                            <p>AGILITY</p>
                            <p>${classEle.movement_spd}</p>
                        </div>
                        <div>
                            <p>${type.toUpperCase()}</p>
                            <p>${classEle.type}</p>
                        </div>
                    </div>
                </div>
                `
        classList.appendChild(displayItem)
    });
  };

jqueryMethod(`${currentUrl}/api/classes`, callback)
