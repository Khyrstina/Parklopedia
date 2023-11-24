import { apiKey } from "./config.js";

export async function getAlertsInformation(parkCode) {
  const apiAlertUrl = `https://developer.nps.gov/api/v1/alerts?limit=10&start=0&parkCode=${parkCode}&api_key=${apiKey}`;
  let differenceInDays = 0;
  let alertsInformation = "";

  try {
    const response = await fetch(apiAlertUrl);
    if (response.ok) {
      const data = await response.json();
      const alerts = data.data;

      if (alerts.length > 0) {
        const currentDate = new Date();

        const filteredAlerts = [];
        alerts.forEach((alert) => {
          const alertDate = new Date(alert.lastIndexedDate);
          // 1000 ms * 60 seconds * 60 minutes * 24 hours
          const oneDay = 1000 * 60 * 60 * 24;

          let timeDifference = currentDate - alertDate;

          differenceInDays = Math.floor(timeDifference / oneDay);

          if (differenceInDays <= 90) {
            filteredAlerts.push(alert);
          }
        });

        if (filteredAlerts.length > 0) {
          alertsInformation = filteredAlerts
            .map((alert) => {
              const alertsCategory = alert.category;
              const alertsDescription = alert.description;
              const alertsTitle = alert.title;
              const alertsUrl = alert.url;

              //regular expression/regex to remove spaces and make lowercase
              // /s is a special character that matches blank spaces, g is a flag that means "global"
              // global means every matching character is replaces instead of just the first one
              const alertsCategoryLowercase = alertsCategory
                .toLowerCase()
                .replace(/\s/g, "");
              console.log(alertsCategoryLowercase);
              const red = "#864622";
              const orange = "#FFD580";
              const green = "#90EE90";
              const blue = "#ADD8E6";
              const white = "#fff";

              function alertsColor() {
                return alertsCategoryLowercase.includes("danger")
                  ? red
                  : alertsCategoryLowercase.includes("caution")
                  ? orange
                  : alertsCategoryLowercase.includes("information")
                  ? green
                  : alertsCategoryLowercase.includes("parkclosure")
                  ? blue
                  : white;
              }

              const color = alertsColor();
              console.log(color);

              // Set up to create a better date format
              let newAlertDateFormat = new Date(alert.lastIndexedDate);
              let alertDay = newAlertDateFormat.getDate();
              let alertMonth = newAlertDateFormat.getMonth() + 1;
              let alertYear = newAlertDateFormat.getFullYear();

              let plural = differenceInDays > 1 ? "s" : "";

              const preferredDateFormat = `${alertMonth}/${alertDay}/${alertYear}`;

              return `<h4 class="alertsCategory" style="color:${color};">${alertsTitle}</h4> 
                                <p>${alertsDescription}
                                Date: ${preferredDateFormat} - ${differenceInDays} day${plural} Ago <br>
                                ${
                                  alertsUrl
                                    ? `<a href="${alertsUrl}" target="_blank">More Info Here</a>`
                                    : ""
                                }
                                </p>`;
            })
            .join("");
        } else {
          alertsInformation =
            "No alerts information could be retrieved for this park within the last 3 months";
        }
      } else {
        alertsInformation =
          "No alerts information could be retrieved for this park";
      }
    } else {
      alertsInformation = "Failed to fetch alerts data";
    }
  } catch (error) {
    alertsInformation = "An error occurred while fetching alerts data";
    console.error(error);
  }

  return alertsInformation;
}
