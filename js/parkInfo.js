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

            <h2>${park[0].fullName}</h2> <br>

            <img src="${park[0].images[0]?.url || ''}" class="parkImage" alt="park image">

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
}
