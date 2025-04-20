document.addEventListener("DOMContentLoaded", function() {
    const editUserForm = document.getElementById("editUserForm");

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

    const isValidEmail = email => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const callback = (responseStatus, responseData) => {

        const username = document.getElementById("editUsername");
        const email = document.getElementById("editEmail");
    
        const usernameValue = username.value.trim();
        const emailValue = email.value.trim();

        const data = {
            username: usernameValue,
            email: emailValue
        };

        const callbackGetUserInfo = (responseStatus, responseData) => {
            console.log("responseStatus:", responseStatus);
            console.log("responseData:", responseData);
        
            if (responseStatus == 200) {
                localStorage.setItem('user_id', `${responseData.data[0].user_id}`)
                localStorage.setItem('username', `${responseData.data[0].username}`)
                localStorage.setItem('email', `${responseData.data[0].email}`)
            }
        }

        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        if (responseStatus == 409) {
            setError(username, 'Username already exist')
        } else if (responseStatus == 403) {
            setError(email, 'Email already exist')
        } else {
            // logged user info into cookie
            jqueryMethod(`${currentUrl}/api/users/getuser/${data.username}`, callbackGetUserInfo)
            document.querySelector(".editUser-popup").classList.remove("active");
            window.location.reload()
        }
    };

    editUserForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const user_id = localStorage.getItem('user_id')

        const username = document.getElementById("editUsername");
        const email = document.getElementById("editEmail");
    
        const usernameValue = username.value.trim();
        const emailValue = email.value.trim();

        data = {
            username: usernameValue,
            email: emailValue
        }

        var formReset = true;

        if (usernameValue === '') {
            formReset = false
            setError(username, 'Username is required');
        } else {
            setSuccess(username)
        }
    
        if (emailValue === '') {
        formReset = false
        setError(email, 'Email is required');
        } else if (!isValidEmail(emailValue)) {
        formReset = false
        setError(email, 'Not a valid email address')
        } else {
        setSuccess(email);
        }

        if (formReset) {
            setNormal(username)
            setNormal(email)

            jqueryMethod(`${currentUrl}/api/users/edit/${user_id}`, callback, "PUT", data)
        }
    })
})