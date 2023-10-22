
let slideIndex = 0;

export function initializeSlides(park) {
    let slideshowContainer = document.querySelector('.slideshow-container');


    // Clearing previous images
    slideshowContainer.innerHTML = '';

    if (park[0].images && park[0].images.length > 0) {


    
        for (let i = 0; i < park[0].images.length; i++) {
            let imgElement = document.createElement('img');
            imgElement.src = park[0].images[i].url;
            imgElement.alt = park[0].images[i].caption || '';

            // Create a new slide
            let slide = document.createElement('div');
            slide.classList.add('mySlides');
            slide.appendChild(imgElement);

            slideshowContainer.appendChild(slide);

        }

        showSlides(0);
    }
}

export function plusSlides(offset) {
    slideIndex += offset;
    showSlides(slideIndex);
}

export function showSlides(index) {
    let slides = document.querySelectorAll('.mySlides');

    if (index < 0) {
        slideIndex = slides.length - 1;
    } else if (index >= slides.length) {
        slideIndex = 0;
    }

    slides.forEach((slide) => {
        slide.style.display = 'none';
    });

    slides[slideIndex].style.display = 'block';
}




