import { getParkInfo } from './parkAPI.js';
import { initializeSlides, plusSlides} from './slideshow.js';
import { getAlertsInformation } from './alerts.js';
import { getWeatherInfo } from './weatherAPI.js';
import { findCorrectIcon, findCorrectStatus } from './weatherIcon.js';
import { getThingsToDoInformation } from './findAmenityLocations.js';


let latitude = '';
let longitude = '';
export let fourCharacterParkCode = '';

const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const generateURLButton = document.getElementById('generateURL');
const amenitiesHTML = document.getElementById('availableAmenitiesId');



document.addEventListener('DOMContentLoaded', () => {
  const parkID = sessionStorage.getItem('parkIDSpecific');
  getParkInfo(parkID).then((park) => {
    initializeSlides(park);
  });
  fetchParkDetails(parkID);
});

prevButton.addEventListener('click', (event) => {
  event.preventDefault();
  plusSlides(-1);
});

nextButton.addEventListener('click', (event) => {
  event.preventDefault();
  plusSlides(1);
});

generateURLButton.addEventListener('click', async function() {
  amenitiesHTML.innerHTML = '';
  const selectedAmenities = Array.from(document.querySelectorAll('input[type="checkbox"]'))
    .filter(checkbox => checkbox.checked)
    .map(checkbox => ({
      header: checkbox.id, // Use checkbox.id as the header
      amenityCodes: checkbox.value.split(','), // Split checkbox.value into an array of amenity codes
    }));

  for (const { header, amenityCodes } of selectedAmenities) {
    await getThingsToDoInformation(fourCharacterParkCode, header, amenityCodes);
  }
});

async function fetchParkDetails(parkId) {
  let park = await getParkInfo(parkId);
  const parkNameHeader = document.getElementById('parkName');
  parkNameHeader.textContent = park[0].fullName;
  fourCharacterParkCode = park[0].parkCode.toUpperCase();


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
    todaysOperatingHours = 'Special operating hours for today not found.';
  }

  //Check for Fee information
  const entranceFees = park[0].entranceFees;
  let feeInformation = '';
  



  if (entranceFees && entranceFees.length > 0) {
    entranceFees.forEach((fee) => {
      const feeTitle = fee.title;
      const feeCost = fee.cost;

      feeInformation +=                  
      `<tr>
      <td>${feeTitle}</td>
      <td>$${feeCost}</td>
      </tr>`;

    
    });
  } else {
    feeInformation += `<tr>
    <td>No Fee Information Could Be Found</td>
    <td>?</td>
    </tr>`;

  }

// Main Park Information Area

const parkDescriptionText = document.getElementById('parkDescription');
const weatherInfoText = document.getElementById('weatherInfo');
const todaysOperatingHoursText = document.getElementById('todaysOperatingHours');
const feeInformationText = document.getElementById('feeInformation');
const parkUrlHref = document.getElementById('parkUrl');


parkDescriptionText.innerText = park[0].description || '';
weatherInfoText.innerText = park[0].weatherInfo;
todaysOperatingHoursText.innerText = todaysOperatingHours;
feeInformationText.innerHTML = feeInformation;
parkUrlHref.href = park[0].url || '';



  // Begin .weather 
  latitude = park[0].latitude;
  longitude = park[0].longitude;

  const weatherData = await getWeatherInfo(latitude, longitude);

  
  const conditionCode = weatherData.current.condition.code;

  // const dateStrings = [weatherData.forecast.forecastday[1].date, weatherData.forecast.forecastday[2].date, weatherData.forecast.forecastday[3].date];

  const allForecastDays = weatherData.forecast.forecastday;

  const forecastOne = allForecastDays[1].date;
  const forecastTwo = allForecastDays[2].date;
  const forecastThree = allForecastDays[3].date;

  const dateStrings = [forecastOne, forecastTwo, forecastThree];

  function formatDate(dateStrings) {
    let parts = dateStrings.split('-');
    let month = parts[1];
    let day = parts [2];
    return month + '/' + day;
  }


  let formattedDateStrings = [];

  dateStrings.forEach(function(dateStrings) {
    let formattedDate = formatDate(dateStrings);
    formattedDateStrings.push(formattedDate);

  });

  const currentTempText = document.getElementById('temperature');
  const maxTempText = document.getElementById('maxTemp');
  const minTempText = document.getElementById('minTemp');
  
  const dateOneText = document.querySelector('.dateOne');
  const dateTwoText = document.querySelector('.dateTwo');
  const dateThreeText = document.querySelector('.dateThree');
  
  const weatherImgOneSrc = document.getElementById('weatherImg1');
  const weatherImgTwoSrc = document.getElementById('weatherImg2');
  const weatherImgThreeSrc = document.getElementById('weatherImg3');
  
  const highLowOneText = document.querySelector('.highLowOne');
  const highLowTwoText = document.querySelector('.highLowTwo');
  const highLowThreeText = document.querySelector('.highLowThree');
  
  if (conditionCode) {
let mainWeatherImg = await findCorrectIcon(conditionCode);
let mainWeatherStatus = await findCorrectStatus(conditionCode);


    // Set the background image for current Temperature
    let setWeatherImage = document.querySelector('.weatherImage');


    setWeatherImage.src = mainWeatherImg;

    // Set the text for current, min, and max temp for the day
    currentTempText.innerHTML = `${weatherData.current.temp_f}&deg;F and ${mainWeatherStatus} <br>`;
    maxTempText.innerHTML = `High: <br> ${weatherData.forecast.forecastday[0].day.maxtemp_f}&deg;F`;
    minTempText.innerHTML = `Low: <br> ${weatherData.forecast.forecastday[0].day.mintemp_f}&deg;F`;
  
    // Set text for date elements
    dateOneText.innerHTML = formattedDateStrings[0];
    dateTwoText.innerHTML = formattedDateStrings[1];
    dateThreeText.innerHTML = formattedDateStrings[2];

    // Set src for weather images in 3 day forecast
    let weatherImgOneSrcImg = await findCorrectIcon(weatherData.forecast.forecastday[1].day.condition.code);
    weatherImgOneSrc.src = weatherImgOneSrcImg;
    let weatherImgTwoSrcImg = await findCorrectIcon(weatherData.forecast.forecastday[2].day.condition.code);
    weatherImgTwoSrc.src = weatherImgTwoSrcImg;
    let weatherImgThreeSrcImg = await findCorrectIcon(weatherData.forecast.forecastday[3].day.condition.code);
    weatherImgThreeSrc.src = weatherImgThreeSrcImg;
  
    // Set text for high/low temperature in 3 day forecast
    highLowOneText.innerHTML = `High: <br> ${weatherData.forecast.forecastday[1].day.maxtemp_f}&deg;F <br> Low: <br> ${weatherData.forecast.forecastday[1].day.mintemp_f}&deg;F`;
    highLowTwoText.innerHTML = `High: <br> ${weatherData.forecast.forecastday[2].day.maxtemp_f}&deg;F <br> Low: <br> ${weatherData.forecast.forecastday[2].day.mintemp_f}&deg;F`;
    highLowThreeText.innerHTML = `High: <br> ${weatherData.forecast.forecastday[3].day.maxtemp_f}&deg;F <br> Low: <br> ${weatherData.forecast.forecastday[3].day.mintemp_f}&deg;F`;
  } else {
    console.error("Weather Image Not Found.");
    console.log("Condition Code:", conditionCode);
  }
  

  // Begin .contact
  const contactInformation = document.querySelector('.contact');
  fourCharacterParkCode = park[0].parkCode.toUpperCase();

  let addressHeader = `<div class="contactHeader" id="contactHeader">
  <h3>Contact: </h3> </div>`;
  let parkCodeHTML = `<h5>Park Code: </h5><p> ${fourCharacterParkCode} </p>`
  let addressHTML = `<h5>Address: </h5><p> ${park[0].addresses[0]?.line1} ${park[0].addresses[0]?.line2}, ${park[0].addresses[0]?.city}, ${park[0].addresses[0]?.stateCode}, ${park[0].addresses[0]?.postalCode} </p>`;
  let phoneHTML = `<h5>Phone Number: </h5><p> ${park[0].contacts.phoneNumbers[0]?.phoneNumber} </p>`;
  let emailHTML = `<h5>Email Address: </h5> <p> ${park[0].contacts.emailAddresses[0].emailAddress} </p>`;
  contactInformation.innerHTML =  addressHeader + parkCodeHTML + addressHTML + phoneHTML + emailHTML;


  //Begin .alerts
  const alertsInformation = await getAlertsInformation(fourCharacterParkCode);
  const alertInformation = document.querySelector('.alertsInformationBox');

  alertInformation.innerHTML =  alertsInformation;



}
