document.addEventListener("DOMContentLoaded", function() {
    const editReviewForm = document.getElementById("editReviewForm");

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
        if (responseStatus == 204) {
            reviewForm.reset()
            window.location.reload()
        }
    };

    editReviewForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const id = localStorage.getItem('reviewId')
        const user_id = localStorage.getItem('user_id');
        const username = localStorage.getItem('username');

        const review_msg2 = document.getElementById("editReviewMsg");
        const review_amt2 = document.getElementById("my-slider2");
    
        const review_msgValue2 = review_msg2.value.trim();
        const review_amtValue2 = (review_amt2.value.trim())*0.05;

        const data = {
            user_id: user_id,
            username: username,
            review_amt: review_amtValue2,
            review_msg: review_msgValue2
        };

        var formReset = true;

        if (review_msgValue2 === '') {
            formReset = false
            setError(review_msg2, 'Comments is required');
        }

        if (formReset) {
            setNormal(review_msg2)

            jqueryMethod(`${currentUrl}/api/reviews/${id}`, callback, "PUT", data)
        }
    })
})