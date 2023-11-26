import { apiKey } from "./config.js";

export async function getAlertsInformation(parkCode) {
  const apiAlertUrl = `https://developer.nps.gov/api/v1/alerts?limit=10&start=0&parkCode=${parkCode}&api_key=${apiKey}`;
  let alertsInformation = "";
  const oneDay = 1000 * 60 * 60 * 24;

    const response = await fetch(apiAlertUrl);
    if (response.ok) {
      const data = await response.json();
      const alerts = data.data;

      if (alerts.length > 0) {
        const filteredAlerts = alerts
        .map((alert) => {
          const alertDate = new Date(alert.lastIndexedDate); // getting last updated date
          const timeDifference = Date.now() - alertDate.getTime(); // getting time difference in milliseconds
          const differenceInDays = Math.floor(timeDifference / oneDay); // converting milliseconds to days
      
          if (differenceInDays <= 90) {
            //creating a new object with the properties we need to put into HTML
            const { category, description, title, url, lastIndexedDate } = alert;
            //regex to remove spaces and make lowercase for applying color to category
            // /g is a global search, /s is a whitespace character "" is the replacement (empty)
            const alertsCategoryLowercase = category.toLowerCase().replace(/\s/g, "");
            const color = alertsColor(alertsCategoryLowercase); 
      
            const newAlertDateFormat = new Date(lastIndexedDate); //converting date to new date object
            const preferredDateFormat = newAlertDateFormat.toLocaleDateString();//converting date to preferred format (MM/DD/YYYY)
      
            const plural = differenceInDays > 1 ? "s" : ""; //adding "s" to day if difference is greater than 1
      
            return `<div class="alert-container">
            <h4 class="alertsCategory" style="color:${color};">${title}</h4> 
            <p>${description}</p>
            <p>Alert Last Updated: ${preferredDateFormat}- (${differenceInDays} day${plural} ago)</p>
            <p>
              <a href="${url}" target="_blank">
                <button Title="More info on this Alert" class="button button-shadow button-shadow-border search-bar-button button50Percent">
                  More Info Here
                </button>
              </a>
            </p>
          </div>
          `;
          } else {
            //if alert is older than 90 days, return null
            return null;
          }
        })

        .filter(alert => alert !== null) //filtering out alerts that are older than 90 days
        .join(""); //joining all alerts into one string
        //if there are no alerts within the last 90 days, return message
        alertsInformation = filteredAlerts.length > 0 ? filteredAlerts  : "No alerts were found for the last 90 days";
      } 
    } else {
      //if there is an error, return message saying Failed to fetch alerts data
      alertsInformation = "An error occured when fetching alerts data.";
    }
    return alertsInformation;
  } 


function alertsColor(category) {
  const red = "#864622";
  const orange = "#FFD580";
  const green = "#90EE90";
  const blue = "#ADD8E6";
  const white = "#fff";

  if (category.includes("danger")) return red;
  if (category.includes("caution")) return orange;
  if (category.includes("information")) return green;
  if (category.includes("parkclosure")) return blue;

  return white;
}
