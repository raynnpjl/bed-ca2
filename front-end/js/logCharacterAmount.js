const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);

    localStorage.setItem('currentCharacterAmount',responseData.data.currentCharacterAmount)
};

jqueryMethod(`${currentUrl}/api/characters/${user_id}`, callback)
