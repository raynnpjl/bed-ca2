function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function completeChallenge(id) {
    const challenge_id = id
    const user_id = localStorage.getItem('user_id')
    const challenge = document.getElementById(`detail${id}`).textContent.trim()
    const challenge_name = document.getElementById(`title${id}`).textContent.trim()

    const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
    };

    const postData = {
        user_id: user_id,
        challenge_name: challenge_name,
        challenge: challenge,
        completed: true
    }

    jqueryMethod(`${currentUrl}/api/challenges/${challenge_id}`, callback, 'POST', postData)
    window.location.reload()
}