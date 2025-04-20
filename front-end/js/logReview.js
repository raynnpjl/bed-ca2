const callbackReview = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);
    console.log(responseData[0])

    if (responseStatus == 200) {
        localStorage.setItem(`reviewId`, responseData.data[0].id)
    }
  };


const user_idReview = localStorage.getItem('user_id')

jqueryMethod(`${currentUrl}/api/reviews/user_id/${user_idReview}`, callbackReview)
