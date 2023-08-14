const stateSelect = document.getElementById('stateId');
const textBox = document.getElementById('textBox');

let apiKey = "";

stateSelect.addEventListener('change', async (event) => {
    const selectedState = stateSelect.value;
    textBox.value = selectedState;
    await renderParks(selectedState);
});

async function getParks(selectedState) {
    let apiUrl = `https://developer.nps.gov/api/v1/parks?limit=10&q=${selectedState}&api_key=${apiKey}`;
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

async function renderParks(selectedState) {
    let parks = await getParks(selectedState);
    let html = '';

    parks.forEach(park => {
        let htmlSegment = `
            <ul>
            <li class="park">
                <h2>${park.fullName}</h2> <br>

                <img src="${park.images[0]?.url || ''}" class="parkImage" alt="park image">

                <div class="info">
                    <ul>
                        <li> ${park.images[0]?.caption || ''}</li>
                        <li><a href="${park.url || ''}">Click here for the NPS entry on this park.</a> </li>
                        <li>Address: ${park.addresses[0]?.line1} ${park.addresses[0]?.line2}, ${park.addresses[0]?.city}, 
                        ${park.addresses[0]?.postalCode || ''}</li>
                        <li>Phone Number: ${park.contacts.phoneNumbers[0]?.phoneNumber || ''}</li>
                        <li class="description">${park.description || ''}</li>  

                    </ul>
                </div>
            </li>
            </ul>
        `;
        html += htmlSegment;
    });

    let jsonContainer = document.querySelector('.jsonContainer');
    jsonContainer.innerHTML = html;
}

renderParks(stateSelect.value);