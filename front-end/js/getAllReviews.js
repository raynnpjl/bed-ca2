const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);
  
    const reviewList = document.getElementById("reviewList");
    const user_id = localStorage.getItem('user_id')
    responseData.data.forEach((review) => {
        const stars = []
        for (var i=0;i<5;i++) {
            if (i<review.review_amt) {
                stars.push('fa-solid fa-star')
            } else {
                stars.push('fa-regular fa-star')
            }
        }
      const displayItem = document.createElement("div");
        displayItem.className = "reviews-box"
        displayItem.innerHTML = `
                <div class="box-top">
                    <div class="profile">
                        <div class="profile-img">
                            <img src="img/pfp.jpg"/>
                        </div>
                        <div class="name-user">
                            <strong>${review.username}</strong>
                        </div>
                    </div>
                    <div class="reviews-star">
                        <i class="${stars[0]}"></i>
                        <i class="${stars[1]}"></i>
                        <i class="${stars[2]}"></i>
                        <i class="${stars[3]}"></i>
                        <i class="${stars[4]}"></i>
                    </div>
                </div>
                <div class="reviews-comment">
                    <p>${review.review_msg}</p>
                </div>
                `
        if (user_id == review.user_id) {
            reviewList.insertBefore(displayItem, reviewList.childNodes[0]);
        } else {
            reviewList.appendChild(displayItem)
        }
    });
  };

jqueryMethod(`${currentUrl}/api/reviews`, callback)
