function openNoteForm(complete_id) {
    document.cookie = `tempCompleteId = ${complete_id}`
    document.querySelector(".note-popup").classList.add("active");
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

document.querySelector(".note-popup .close-btn")
    .addEventListener("click", function(){
    setCookie('tempCompleteId', '', 0)
    document.querySelector(".note-popup").classList.remove("active");
})