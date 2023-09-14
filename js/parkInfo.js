import { apiKey } from './config.js';


let latitude = '';
let longitude = '';

document.addEventListener('DOMContentLoaded', () => {
    const parkID = sessionStorage.getItem('parkIDSpecific');
    fetchParkDetails(parkID);
})

async function getParkInfo(parkID) {
    const apiUrl = `https://developer.nps.gov/api/v1/parks?limit=1&start=0&q=${parkID}&api_key=${apiKey}`;
    try {
        let resp = await fetch(apiUrl);
        let data = await resp.json();

        return data.data; 
    }
    catch (error) {
        console.log(error);
    }
}


async function fetchParkDetails(parkId) {
    let park = await getParkInfo(parkId); 
    const parkNameHeader = document.getElementById('parkName');
    parkNameHeader.textContent = park[0].fullName;

    // Get today's date in yyyy-mm-dd format
const today = new Date().toISOString().split('T')[0];

let todaysOperatingHours = '';
// Find the operating hours for today
const operatingHoursToday = park[0].operatingHours.find((hours) => {
  return hours.exceptions.some((exception) => {
    return today >= exception.startDate && today <= exception.endDate;
  });
});

if (operatingHoursToday) {
  const { description } = operatingHoursToday;
  todaysOperatingHours = description;
} else {
  todaysOperatingHours = 'Operating hours for today not found.';
}

    let html = `


            <div class="info">

                    <h3>Park Description: </h3>
                    <p class="description">${park[0].description || ''}</p>  
                    <h3>Seasonal Information: </h3>
                    <p>${park[0].weatherInfo}</p>
                    <p><a href="${park[0].url || ''}">Click here for the NPS entry on this park.</a> </p>
                    <h3>Today's Operating Hours: </h3>
                    <p>${todaysOperatingHours}</p>
            </div>     

    ` ;

    let parkContainer = document.querySelector('.mainParkInformation');
    parkContainer.innerHTML = html;
    
    const weatherStats = document.querySelector('.weather');
    latitude = park[0].latitude;
    longitude = park[0].longitude;
    weatherStats.textContent = getLatLon(latitude, longitude);

  

    const contactInformation = document.querySelector('.contact');
    const entranceFees = park[0].entranceFees;
    let feeInformation = '';
    if (entranceFees && entranceFees.length > 0) {
      entranceFees.forEach((fee) => {
        const feeTitle = fee.title;
        const feeDescription = fee.description;
        const feeCost = fee.cost;

        feeInformation += `<p>${feeTitle}: ${feeDescription} - Cost: ${feeCost}</p>`;
      });
    } else {
      feeInformation = 'No entrance fee information could be retrieved for this park.';
    
    }


    let addressHTML = `<h4>Address: </h4><p> ${park[0].addresses[0]?.line1} ${park[0].addresses[0]?.line2}, ${park[0].addresses[0]?.city}, ${park[0].addresses[0]?.stateCode}, ${park[0].addresses[0]?.postalCode} </p>`;
    let phoneHTML = `<h4>Phone Number: </h4><p> ${park[0].contacts.phoneNumbers[0]?.phoneNumber} </p>`;
    let feesHTML = '<h4>Entrance Fees: </h4>' + `<p> ${feeInformation} </p>`;
    contactInformation.innerHTML = addressHTML + phoneHTML + feesHTML;
    

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
  
  function getLatLon(latitude, longitude){
    let latLon = 'Latitude: ' + latitude + '\n' +' Longitude: ' + longitude;
    return latLon;
  }
  