function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const completedCallback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);
  
    const completedList = document.getElementById("completedList");
    responseData.data.forEach((challenge) => {
        var challenge_name = challenge.challenge_name

        var difficultyColor;
        if (challenge_name == 'Easy') {
            difficultyColor = '#09c372'
        } else if (challenge_name == 'Normal') {
            difficultyColor = '#ffa500'
        } else if (challenge_name == 'Hard') {
            difficultyColor = '#ff3860'
        } else if (challenge_name == 'Hardcore') {
            difficultyColor = '#b71c1c'
        }

      const displayItem = document.createElement("div");
        displayItem.innerHTML = `
                <div class="card" style="--color: ${difficultyColor}">
                    <div class="card-info">
                        <div class="title">${challenge.challenge_name}</div>
                        <div id="detail${challenge.challenge_id}" class="detail">
                            ${challenge.challenge}
                        </div>
                        <div class="date">
                            ${new Date(challenge.creation_date)}
                        </div>
                        <div class="notes">
                            <span>${challenge.notes}</span>
                        </div>
                        <div class="button">
                            <button id="${challenge.complete_id}" onClick="openNoteForm(this.id)">Add note</button>
                        </div>
                    </div>
                </div>
                `
        completedList.appendChild(displayItem)
    });
  };

const user_id = localStorage.getItem('user_id')

jqueryMethod(`${currentUrl}/api/challenges/${user_id}`, completedCallback)
