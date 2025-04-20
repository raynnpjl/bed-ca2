const token = localStorage.getItem("token");

if (token != null) {
    const user_id = localStorage.getItem('user_id')

    const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        if(responseStatus == 200) {
            //Show Edit Review Button
            document.querySelector(".addReview").classList.remove("active");
            document.querySelector(".editReview").classList.add("active");
        } else {
            //Show Edit Add Button
            document.querySelector(".editReview").classList.remove("active");
            document.querySelector(".addReview").classList.add("active");
        }
    }

    // Token exists, show add/edit review button
    jqueryMethod(`${currentUrl}/api/reviews/user_id/${user_id}`, callback,)
}