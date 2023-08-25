const searchForm = document.getElementById('searchForm');
const stateSelect = document.getElementById('stateId');
const loadMoreButton = document.getElementsByClassName('loadMoreBtn')[0];
const resultsSelect = document.getElementById('numberResultsRetrieved');
const submitSearchButton = document.getElementById('submitSearchBtn')




let resultsArrayBeginning = 0;
let apiKey = "xjubQlWFxnLdE4V2YsZz1z9OJD9nrJG9BnIBpBiX";
let selectedState = ''; 
let numberOfResults = '';

stateSelect.addEventListener('change', (event) => {
    selectedState = stateSelect.value;
});

resultsSelect.addEventListener('change', (event) => {
    numberOfResults = resultsSelect.value;
});

submitSearchButton.addEventListener('click', async (event) => {
    event.preventDefault();
    await renderParks(selectedState, numberOfResults, resultsArrayBeginning)
});

/* loadMoreButton.addEventListener('click', async (event) => {
    
    loadMoreResults(selectedState, resultsArrayBeginning, numberOfResults);
    }); */

async function getParks(numberOfResults, selectedState, resultsArrayBeginning) {
    let apiUrl = `https://developer.nps.gov/api/v1/parks?start=${resultsArrayBeginning}limit=${numberOfResults}&q=${selectedState}&api_key=${apiKey}`;
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

async function renderParks(selectedState, numberOfResults, resultsArrayBeginning) {
    let parks = await getParks(numberOfResults, selectedState, resultsArrayBeginning);
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
function loadMoreResults (){
    resultsArrayBeginning += Number(numberOfResults);
    getParks(numberOfResults, selectedState, resultsArrayBeginning);
    renderParks(selectedState, numberOfResults, resultsArrayBeginning);
}


