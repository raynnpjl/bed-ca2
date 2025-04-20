document.addEventListener("DOMContentLoaded", function() {
    const noteForm = document.getElementById("noteForm");

    const callback = (responseStatus, responseData) => {

        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        if (responseStatus == 204) {
            //Reset and close the form
            noteForm.reset()
            document.querySelector(".note-popup").classList.remove("active")
            // Redirect or perform further actions for logged-in user
            setCookie('tempCompleteId', '', 0)
            window.location.reload()
        }
    };

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
      }

    noteForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const notes = document.getElementById("notes").value.trim();
        const complete_id = getCookie('tempCompleteId');

        data = {
            notes: notes
        }

        console.log(data)

        jqueryMethod(`${currentUrl}/api/challenges/note/${complete_id}`, callback, "PUT", data)
    })
})