const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);
  
    const classList = document.getElementById("classList");
    responseData.data.forEach((pet) => {
      const displayItem = document.createElement("div");
        displayItem.className = "item"
        displayItem.innerHTML = `
                <img src="img/${pet.pet_3rd_evolution}.webp" alt="${pet.pet_3rd_evolution}.png">
                <div class="intro">
                    <div class="title">
                        <span>PET</span>
                    </div>
                    <div class="topic">
                        ${pet.pet_3rd_evolution}
                    </div>
                    <div class="desc">
                        ${pet.pet_desc}
                    </div>
                    <button onclick = "seeMore()" class="seeMore">
                        More details
                    </button>
                    <button id="${pet.pet_1st_evolution}" class="seeMore" onclick = "selectPet(this.id)">
                        Select
                    </button>
                </div>
                <div class="detail">
                    <div class="title">
                        ${pet.pet_3rd_evolution}
                    </div>
                    <div class="desc">
                        ${pet.pet_desc}
                    </div>
                    <div class="specifications">
                        <div>
                            <p>First Evolution</p>
                            <p>${pet.pet_1st_evolution}</p>
                        </div>
                        <div>
                            <p>Second Evolution</p>
                            <p>${pet.pet_2nd_evolution}</p>
                        </div>
                        <div>
                            <p>Third Evolution</p>
                            <p>${pet.pet_3rd_evolution}</p>
                        </div>
                    </div>
                </div>
                `
        classList.appendChild(displayItem)
    });
  };

jqueryMethod(`${currentUrl}/api/pets`, callback)
