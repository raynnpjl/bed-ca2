const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);
  
    const bossList = document.getElementById("bossList");
    responseData.data.forEach((bossEle) => {
      const displayItem = document.createElement("div");
        displayItem.className = "item"
        displayItem.innerHTML = `
                <img src="img/${bossEle.dungeon_name}.webp" alt="${bossEle.dungeon_name}.png">
                <div class="intro">
                    <div class="title">
                        <span>BOSS</span>
                    </div>
                    <div class="topic">
                        ${bossEle.dungeon_name}
                    </div>
                    <div class="desc">
                        ${bossEle.dungeon_desc}
                    </div>
                    <button onclick = "seeMore()" class="seeMore">
                        More details
                    </button>
                    <button id="${bossEle.dungeon_id}" onclick = "selectBoss(this.id)" class="seeMore">
                        Fight
                    </button>
                </div>
                <div class="detail">
                    <div class="title">
                        ${bossEle.dungeon_name}
                    </div>
                    <div class="desc">
                        ${bossEle.dungeon_desc}
                    </div>
                    <div class="specifications">
                        <div>
                            <p>Min Lvl</p>
                            <p>${bossEle.min_lvl}</p>
                        </div>
                        <div>
                            <p>Drops</p>
                            <p>${bossEle.drops[0]}</p>
                            <p>${bossEle.drops[1]}</p>
                            <p>${bossEle.drops[2]}</p>
                        </div>
                        <div>
                            <p>Gold</p>
                            <p>${bossEle.gold}</p>
                        </div>
                        <div>
                            <p>Pet Lvl</p>
                            <p>${bossEle.pet_lvl}</p>
                        </div>
                    </div>
                </div>
                `
        bossList.appendChild(displayItem)
    });
  };

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const user_id = localStorage.getItem('user_id')

jqueryMethod(`${currentUrl}/api/bosses`, callback)
