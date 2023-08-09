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
            <div class="park">
                <img src="${park.images[0]?.url || ''}">
                <h2>${park.fullName}</h2>
                <div class="info">
                    <p>
                        ${park.url}
                        ${park.addresses[0]?.city || ''}
                        ${park.addresses[0]?.postalCode || ''}
                        ${park.contacts.phoneNumbers[0]?.phoneNumber || ''}
                        ${park.description || ''}
                    </p>
                </div>
            </div>
        `;
        html += htmlSegment;
    });

    let jsonContainer = document.querySelector('.jsonContainer');
    jsonContainer.innerHTML = html;
}

renderParks(stateSelect.value);