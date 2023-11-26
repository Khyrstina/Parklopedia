let slideIndex = 0;
let slideshowContainer = document.querySelector(".imagesContainer");
let slideshowArray = [];

export function initializeSlides(park) {
  if (park[0].images && park[0].images.length > 0) {
    for (let i = 0; i < park[0].images.length; i++) {
      let imageURL = park[0].images[i].url;
      let imageCaption = park[0].images[i].caption;
      let imageURLObject = { imageURL, imageCaption };
      slideshowArray.push(imageURLObject);
    }
    showSlides();
  }
}

export function plusSlides(offset) {
  slideIndex += offset;
  showSlides(slideIndex);
}

export function showSlides(index) {
  if (index < 0) {
    slideIndex = slideshowArray.length - 1;
  } else if (index >= slideshowArray.length) {
    slideIndex = 0;
  }
  let currentImage = slideshowArray[slideIndex].imageURL;
  slideshowContainer.style.backgroundImage = `url(${currentImage})`;
  slideshowContainer.title = slideshowArray[slideIndex].imageCaption;
}
