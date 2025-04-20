const callbackInventory = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);

    if (responseStatus == 200) {
        document.cookie = `inventoryItem = ${JSON.stringify(responseData.data[0].items)}`
        document.cookie = `inventoryGold = ${responseData.data[0].gold}`
    }
  };

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const user_idInventory = localStorage.getItem('user_id')

jqueryMethod(`${currentUrl}/api/inventory/${user_idInventory}`, callbackInventory)
