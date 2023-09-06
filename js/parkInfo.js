const parkNameHeader = document.getElementById('parkName');
let apiKey = '';


document.addEventListener('DOMContentLoaded', () => {
    const parkID = sessionStorage.getItem('parkIDSpecific');
    fetchParkDetails(parkID);
})

async function getParkInfo(parkID) {
    const apiUrl = `https://developer.nps.gov/api/v1/parks?limit=1&start=0&q=${parkID}&api_key=${apiKey}`;
    try {
        let resp = await fetch(apiUrl);
        let data = await resp.json();
        console.log(apiUrl);

        return data.data; 
    }
    catch (error) {
        console.log(error);
        console.log(apiUrl);
    }
}


async function fetchParkDetails(parkId) {
    let park = await getParkInfo(parkId); 

    let html = `

            <h2 class="parkFullNameHeader">${park[0].fullName}</h2> <br>


            <div class="info">

                    <p> ${park[0].images[0]?.caption || ''}</p>
                    <p><a href="${park[0].url || ''}">Click here for the NPS entry on this park.</a> </p>
                    <p>Park ID: ${park[0].id} </p>
                    <p>Address: ${park[0].addresses[0]?.line1} ${park[0].addresses[0]?.line2}, ${park[0].addresses[0]?.city}, 
                    ${park[0].addresses[0]?.postalCode || ''}</p>
                    <p>Phone Number: ${park[0].contacts.phoneNumbers[0]?.phoneNumber || ''}</p>
                    <p class="description">${park[0].description || ''}</p>  

            </div>     

    `;

    let parkContainer = document.querySelector('.parkInfoContainer');
    parkContainer.innerHTML = html;

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

let slideIndex = 0;

function plusSlides(offset) {
    slideIndex += offset;
    showSlides(slideIndex);
  }
  
  // back button for images
  document.querySelector('.prev').addEventListener('click', () => {
    plusSlides(-1);
  });
  //next button for images
  document.querySelector('.next').addEventListener('click', () => {
    plusSlides(1);
  });
  
  function showSlides(index) {
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
  
