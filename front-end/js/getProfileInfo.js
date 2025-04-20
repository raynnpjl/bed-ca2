const callbackProfile = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);
  
    const profileList = document.getElementById("profileList");
    const userProfile = (responseData.data)[0]
    const displayItem = document.createElement("div");
    displayItem.className = "profile-content"
    displayItem.innerHTML = `
            <h1>Hi, <span>${userProfile.username}</span></h1>
            <h3>Skillpoints: ${userProfile.skillpoints}</h3>
            <p>Email: ${userProfile.email}</p>
            <a href="dashboard.html">
                <button>Start Playing!</button>
            </a>
            <button onclick="editUser()">Edit user</button>
            <button onclick="editPassword()">Change password</button>
            `
    profileList.appendChild(displayItem)
  };


const user_id = localStorage.getItem('user_id')

jqueryMethod(`${currentUrl}/api/users/${user_id}`, callbackProfile)
