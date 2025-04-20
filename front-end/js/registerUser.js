document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");

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

    const callback = (responseStatus, responseData) => {

      const username = document.getElementById("registerUsername");
      const usernameValue = username.value.trim();

      const email = document.getElementById("registerEmail");

      const callbackGetUserInfo = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
      
        if (responseStatus == 200) {
            localStorage.setItem("user_id", responseData.data[0].user_id)
            localStorage.setItem("username", responseData.data[0].username)
            localStorage.setItem("email", responseData.data[0].email)
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
          registerForm.reset()
          document.querySelector(".login-popup").classList.remove("active")

          // logged user info into cookie
          jqueryMethod(`${currentUrl}/api/users/getuser/${usernameValue}`, callbackGetUserInfo)
          
          // Redirect or perform further actions for logged-in user
          window.location.href = "profile.html";
        }
      } else {
        setError(username, 'Username or email is already taken')
        setError(email, 'Username or email is already taken')
      }
    };
  
    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const username = document.getElementById("registerUsername");
      const email = document.getElementById("registerEmail");
      const password = document.getElementById("registerPassword");
      const confirmPassword = document.getElementById("registerConfirmPassword");
  
      const usernameValue = username.value.trim();
      const emailValue = email.value.trim();
      const passwordValue = password.value.trim();
      const confirmPasswordValue = confirmPassword.value.trim();

      const data = {
        username: usernameValue,
        email: emailValue,
        password: passwordValue
      };

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

      if (passwordValue === '') {
        formReset = false
        setError(password, 'Password is required');
      } else {
        setSuccess(password)
      }

      if (confirmPasswordValue === '') {
        formReset = false
        setError(confirmPassword, 'Please confirm your password');
      }  else if (confirmPasswordValue !== passwordValue) {
        formReset = false
        setError(confirmPassword, "Passwords doesn't match")
      } else {
        setSuccess(confirmPassword)
      }

      if (formReset) {
        setNormal(username)
        setNormal(email)
        setNormal(password)
        setNormal(confirmPassword)

        jqueryMethod(currentUrl + '/api/users', callback, "POST", data)
      }
    });
  });