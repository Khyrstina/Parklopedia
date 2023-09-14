import { getParkInfo, getLatLon } from './parkAPI.js';
import { initializeSlides, plusSlides } from './slideshow.js';
import { getAlertsInformation } from './alerts.js';


let latitude = '';
let longitude = '';

document.addEventListener('DOMContentLoaded', () => {
  const parkID = sessionStorage.getItem('parkIDSpecific');
  getParkInfo(parkID).then((park) => {
    initializeSlides(park);
  });
  fetchParkDetails(parkID);
})

// back button for images
document.querySelector('.prev').addEventListener('click', () => {
  plusSlides(-1);
});

// next button for images
document.querySelector('.next').addEventListener('click', () => {
  plusSlides(1);
});



async function fetchParkDetails(parkId) {
  let park = await getParkInfo(parkId);
  const parkNameHeader = document.getElementById('parkName');
  parkNameHeader.textContent = park[0].fullName;

  // Get today's date in yyyy-mm-dd format
  const parkName = park[0].fullName;
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
    todaysOperatingHours = 'Special operating hours for today not found.';
  }

  const entranceFees = park[0].entranceFees;
  let feeInformation = '';
  if (entranceFees && entranceFees.length > 0) {
    entranceFees.forEach((fee) => {
      const feeTitle = fee.title;
      const feeCost = fee.cost;

      feeInformation += `<p>${feeTitle}: <br> Cost: ${feeCost}</p>`;
    });
  } else {
    feeInformation = 'No entrance fee information could be retrieved for this park.';

  }

  let html = `


            <div class="info">

                    <h3>Park Description: </h3>
                    <p class="description">${park[0].description || ''}</p>  
                    <h3>Seasonal Information: </h3>
                    <p>${park[0].weatherInfo}</p>
                    <h3>Special Operating Hours in Effect: </h3>
                    <p>${todaysOperatingHours}</p>
                    <h3>Entrance Fees: </h3> 
                    <p> ${feeInformation} </p>
                    <button class='npsPageButton'><a href="${park[0].url || ''}">Click here for the NPS entry on this park.</a></button>
            </div>     

    ` ;

  let parkContainer = document.querySelector('.mainParkInformation');
  parkContainer.innerHTML = html;


  // Begin .weather 
  const weatherStats = document.querySelector('.weather');
  latitude = park[0].latitude;
  longitude = park[0].longitude;
  weatherStats.textContent = getLatLon(latitude, longitude);


  // Begin .contact
  const contactInformation = document.querySelector('.contact');


  let addressHTML = `<h4>Address: </h4><p> ${park[0].addresses[0]?.line1} ${park[0].addresses[0]?.line2}, ${park[0].addresses[0]?.city}, ${park[0].addresses[0]?.stateCode}, ${park[0].addresses[0]?.postalCode} </p>`;
  let phoneHTML = `<h4>Phone Number: </h4><p> ${park[0].contacts.phoneNumbers[0]?.phoneNumber} </p>`;
  let emailHTML = `<h4>Email Address: </h4> <p> ${park[0].contacts.emailAddresses[0].emailAddress} </p>`;
  contactInformation.innerHTML = addressHTML + phoneHTML + emailHTML;

  //Begin .alerts
  const alertsInformation = await getAlertsInformation(parkName);
  const alertInformation = document.querySelector('.alerts');
  alertInformation.innerHTML = alertsInformation;

}


