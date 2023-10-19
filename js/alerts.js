import { apiKey } from "./config.js";

export async function getAlertsInformation(parkCode) {
    const apiAlertUrl = `https://developer.nps.gov/api/v1/alerts?limit=10&start=0&parkCode=${parkCode}&api_key=${apiKey}`;

    let alertsInformation = '';
    try {
        const response = await fetch(apiAlertUrl);
        if (response.ok) {
            const data = await response.json();
            const alerts = data.data;

            if (alerts.length > 0) {
                alertsInformation = alerts.map((alert) => {
                    const alertsCategory = alert.category;
                    const alertsDescription = alert.description;
                    const alertsTitle = alert.title;
                    const alertsUrl = alert.url;
                    const alertsDate = alert.lastIndexedDate;

                    return `<h4>${alertsCategory}: ${alertsTitle}</h4> 
                            <p>Description: ${alertsDescription}
                            ${alertsUrl ? `<a href="${alertsUrl}" target="_blank">More Info Here</a>` : ''}
                            </p>`;
                }).join('');
            } else {
                alertsInformation = 'No alerts information could be retrieved for this park';
            }
        } else {
            alertsInformation = 'Failed to fetch alerts data';
        }
    } catch (error) {
        console.error(error);
        alertsInformation = 'An error occurred while fetching alerts data';
    }
    console.log(alertsInformation);
    return alertsInformation;
}


