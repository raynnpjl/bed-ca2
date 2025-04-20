document.addEventListener("DOMContentLoaded", function() {
    const editPasswordForm = document.getElementById("editPasswordForm");

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

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const callback = (responseStatus, responseData) => {

        const user_id = localStorage.getItem('user_id')
        const newPassword = document.getElementById('newPassword')
        const newPasswordValue = newPassword.value.trim()
        const currentPassword = document.getElementById("currentPassword");

        const callbackPassword = (responseStatus, responseData) => {
            console.log("responseStatus:", responseStatus);
            console.log("responseData:", responseData);
        
            if (responseStatus == 200) {
                document.querySelector(".editPassword-popup").classList.remove("active")
                window.location.reload()
            }
        }

        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        data = {
            password: newPasswordValue
        }

        if (responseStatus == 200) {
            // Check if signup was successful
            if (responseData.token) {
            // Store the token in local storage
            localStorage.setItem("token", responseData.token);
            // Change Password
            jqueryMethod(`${currentUrl}/api/users/password/${user_id}`, callbackPassword, 'PUT', data)
            }
        } else {
            setError(currentPassword, 'Incorrect Password')
        };
    }

    editPasswordForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = localStorage.getItem('username')

        const currentPassword = document.getElementById("currentPassword");
        const newPassword = document.getElementById("newPassword");
        const confirmNewPassword = document.getElementById("confirmNewPassword");
    
        const currentPasswordValue = currentPassword.value.trim();
        const newPasswordValue = newPassword.value.trim();
        const confirmNewPasswordValue = confirmNewPassword.value.trim();

        data = {
            username: username,
            password: currentPasswordValue
        }

        var formReset = true;

        if (currentPasswordValue === '') {
            formReset = false
            setError(currentPassword, 'Password is required');
        } else {
            setSuccess(currentPassword)
        }
    
        if (newPasswordValue === '') {
        formReset = false
        setError(newPassword, 'New password is required');
        }   else {
        setSuccess(newPassword);
        }

        if (confirmNewPasswordValue === '') {
        formReset = false
        setError(confirmNewPassword, 'Confirm new password is required');
        }   else if (confirmNewPasswordValue !== newPasswordValue) {
            formReset = false
            setError(confirmNewPassword, "Passwords doesn't match")
        }   else {
            setSuccess(confirmNewPassword);
        }

        if (formReset) {
            setNormal(currentPassword)
            setNormal(newPassword)
            setNormal(confirmNewPassword)

            jqueryMethod(currentUrl + '/api/users/login', callback, "POST", data)
        }
    })
})