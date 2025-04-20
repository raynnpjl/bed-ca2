document.addEventListener("DOMContentLoaded", function() {
    const editReviewForm = document.getElementById("editReviewForm");
    const deleteButton = editReviewForm.querySelector('button[type="button"]');

    const callback = (responseStatus, responseData) => {

        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        if (responseStatus == 204) {
            reviewForm.reset()
            localStorage.removeItem('reviewId')
            window.location.reload()
        }
    };

    deleteButton.addEventListener('click', function(event) {
        event.preventDefault();

        const id = localStorage.getItem('reviewId')

        jqueryMethod(`${currentUrl}/api/reviews/${id}`, callback, "DELETE")
    })
})