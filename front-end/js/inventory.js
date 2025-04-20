function goEquip(item) {
    document.cookie = `tempItem = ${item}`
    window.location.href = 'characterEquip.html'
}