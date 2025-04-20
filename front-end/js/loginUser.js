document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");

    const setError = (element, message) => {
        const inputControl = element.parentElement
        const errorDisplay = inputControl.querySelector('.error');
  
        errorDisplay.innerText = message;
        inputControl.classList.add('error');
        inputControl.classList.remove('success');
    }
  
    const setSuccess = element => {
        const inputControl = element.parentElement;
        const errorDisplay = inputControl.querySelector('.error')

        errorDisplay.innerText = '';
        inputControl.classList.add('success');
        inputControl.classList.remove('error');
    }
  
        const setNormal = element => {
        const inputControl = element.parentElement
        const errorDisplay = inputControl.querySelector('.error')

        errorDisplay.innerText = '';
        inputControl.classList.remove('success')
    }

    const callback = (responseStatus, responseData) => {

        const username = document.getElementById("loginUsername");
        const password = document.getElementById("loginPassword");
    
        const usernameValue = username.value.trim();
        const passwordValue = password.value.trim();

        const data = {
            username: usernameValue,
            password: passwordValue
        };

        console.log(data)

        const callbackGetUserInfo = (responseStatus, responseData) => {
            console.log("responseStatus:", responseStatus);
            console.log("responseData:", responseData);
        
            if (responseStatus == 200) {
                localStorage.setItem('user_id',responseData.data[0].user_id)
                localStorage.setItem('username', responseData.data[0].username)
                localStorage.setItem('email', responseData.data[0].email)
            }
        }

        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        if (responseStatus == 200) {
            // Check if signup was successful
            if (responseData.token) {
            // Store the token in local storage
            localStorage.setItem("token", responseData.token);
            //Reset and close the form
            loginForm.reset()
            document.querySelector(".login-popup").classList.remove("active")
            // logged user info into cookie
            jqueryMethod(`${currentUrl}/api/users/getuser/${data.username}`, callbackGetUserInfo)
            // Redirect or perform further actions for logged-in user
            window.location.href = "profile.html";
            }
        } else if (responseStatus == 404) {
            setError(username, 'User does not exist')
        } else {
            setSuccess(username)
            setError(password, 'Incorrect password')
        }
    };

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById("loginUsername");
        const password = document.getElementById("loginPassword");
    
        const usernameValue = username.value.trim();
        const passwordValue = password.value.trim();

        const data = {
            username: usernameValue,
            password: passwordValue
        };

        var formReset = true;

        if (usernameValue === '') {
            formReset = false
            setError(username, 'Username is required');
        } else {
            setSuccess(username)
        }
        
        if (passwordValue === '') {
            formReset = false
            setError(password, 'Password is required');
        } else {
            setSuccess(password)
        }

        if (formReset) {
            setNormal(username)
            setNormal(password)

            jqueryMethod(currentUrl + '/api/users/login', callback, "POST", data)
        }
    })
})