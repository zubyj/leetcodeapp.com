window.onload = function () {
    let cards = document.getElementsByClassName("card");

    for (let i = 0; i < cards.length; i++) {
        cards[i].onclick = function () {
            this.querySelector('.btn').click();
        };
    }
};