document.addEventListener("DOMContentLoaded", function() {
    const reviewForm = document.getElementById("reviewForm");

    const setError = (element, message) => {
        const inputControl = element.parentElement
        const errorDisplay = inputControl.querySelector('.error');
  
        errorDisplay.innerText = message;
        inputControl.classList.add('error');
        inputControl.classList.remove('success');
    }

    const setNormal = element => {
        const inputControl = element.parentElement
        const errorDisplay = inputControl.querySelector('.error')

        errorDisplay.innerText = '';
        inputControl.classList.remove('success')
    }

    const callback = (responseStatus, responseData) => {

        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        if (responseStatus == 200) {
            reviewForm.reset()
            localStorage.setItem('reviewId', responseData.data[0].id)
            window.location.reload()
        }
    };

    // When submit button is pressed, POST into reviews db then reload page to get the new reviews
    reviewForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const user_id = localStorage.getItem('user_id');
        const username = localStorage.getItem('username');

        const review_msg = document.getElementById("reviewMsg");
        const review_amt = document.getElementById("my-slider");
    
        const review_msgValue = review_msg.value.trim();
        const review_amtValue = (review_amt.value.trim())*0.05;

        const data = {
            user_id: user_id,
            username: username,
            review_amt: review_amtValue,
            review_msg: review_msgValue
        };

        var formReset = true;

        if (review_msgValue === '') {
            formReset = false
            setError(review_msg, 'Comments is required');
        }

        if (formReset) {
            setNormal(review_msg)

            jqueryMethod(currentUrl + '/api/reviews/', callback, "POST", data)
        }
    })
})