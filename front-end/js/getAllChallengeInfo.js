const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);
  
    const challengeList = document.getElementById("challengeList");
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
                        <div id="title${challenge.challenge_id}"class="title">${challenge.challenge_name}</div>
                        <div id="detail${challenge.challenge_id}" class="detail">
                            ${challenge.challenge}
                        </div>
                        <div class="points">
                            <b>Skillpoints</b>: ${challenge.skillpoints}
                        </div>
                        <div class="button">
                            <button id="${challenge.challenge_id}" onClick="completeChallenge(this.id)">Complete</button>
                        </div>
                    </div>
                </div>
                `
        challengeList.appendChild(displayItem)
    });
  };

jqueryMethod(`${currentUrl}/api/challenges`, callback)
