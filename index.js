window.onload = function () {
    let cards = document.getElementsByClassName("card");
    let imageTriggers = document.getElementsByClassName("img-modal-trigger");
    let images = Array.from(imageTriggers).map(trigger => trigger.querySelector('img').src);
    let currentImageIndex = 0;
    let modalImage = document.getElementById('modalImage');
    let prevButton = document.getElementById('prevButton');
    let nextButton = document.getElementById('nextButton');

    for (let i = 0; i < cards.length; i++) {
        cards[i].onclick = function () {
            this.querySelector('.btn').click();
        };
    }

    for (let i = 0; i < imageTriggers.length; i++) {
        imageTriggers[i].onclick = function () {
            currentImageIndex = this.getAttribute('data-img-index');
            modalImage.src = images[currentImageIndex];
        };
    }

    prevButton.onclick = function () {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        modalImage.src = images[currentImageIndex];
    };

    nextButton.onclick = function () {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        modalImage.src = images[currentImageIndex];
    };
};

document.addEventListener("DOMContentLoaded", function () {
    const text = "A free & open source browser extension";
    const typewriterText = document.getElementById('typewriter-text');
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            typewriterText.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }

    typeWriter();
})
