document.addEventListener("DOMContentLoaded", function () {
    const characterForm = document.getElementById("characterForm");

    const setError = (element, message) => {
      const inputControl = element.parentElement
      const errorDisplay = inputControl.querySelector('.error');

      errorDisplay.innerText = message;
      inputControl.classList.add('error');
    }

    const callback = (responseStatus, responseData) => {
        function setCookie(cname, cvalue, exdays) {
            const d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            let expires = "expires="+ d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }

        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        if (responseStatus == 200) {
            setCookie('tempCharacterName', '', 0)
            setError(characterName, 'Character Name already exist')
        } else {
            characterForm.reset()
            window.location.href = 'selectClass.html'
        }
    }
    characterForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const characterName = document.getElementById("characterName");
      const characterNameValue = characterName.value.trim();
  
      var check = true
      if (characterNameValue === '') {
        check = false
        setError(characterName, 'Character Name is required');
      }

      if (check) {
        document.cookie = `tempCharacterName = ${characterNameValue}`
        jqueryMethod(`${currentUrl}/api/characters/characterExistence/${characterNameValue}`, callback)
      }
    });
  });