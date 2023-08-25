const searchForm = document.getElementById('searchForm');
const stateSelect = document.getElementById('stateId');
const loadMoreButton = document.getElementsByClassName('loadMoreBtn')[0];
const resultsSelect = document.getElementById('numberResultsRetrieved');
const submitSearchButton = document.getElementById('submitSearchBtn')



let currentPage = 1;
let totalSearchResults = 0;
let resultsArrayBeginning = 0;
let apiKey = "";
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
    totalResults = await getTotalNumberResults(selectedState);

    resultsArrayBeginning = 0;
    clearSearchResults();

    await renderParks(selectedState, numberOfResults, resultsArrayBeginning)
});

/* loadMoreButton.addEventListener('click', async (event) => {
    
    loadMoreResults(selectedState, resultsArrayBeginning, numberOfResults);
    }); */

async function getTotalNumberResults(selectedState) {
    let apiUrl = `https://developer.nps.gov/api/v1/parks?start=0limit=100&q=${selectedState}&api_key=${apiKey}`;
    try {
        let resp = await fetch(apiUrl);
        let data = await resp.json();
        totalSearchResults = data.total;
        console.log(totalSearchResults);
        return totalSearchResults;
    }
    catch (error) {
        console.log(error);
        return 0;
    }
}


async function getParks(numberOfResults, selectedState, resultsArrayBeginning) {
    let apiUrl = `https://developer.nps.gov/api/v1/parks?start=${resultsArrayBeginning}limit=${numberOfResults}&q=${selectedState}&api_key=${apiKey}`;
    let html = '';
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

    if (totalResults <= resultsArrayBeginning) {
        let endMessage = '<h2>You have reached the end of the results</h2>';
        jsonContainer.innerHTML += endMessage;
        loadMoreButton.style.display = 'none'; // Hiding the load more button
    } else {
        loadMoreButton.style.display = 'block'; // Showing the load more button
    }

}
function loadMoreResults (){
    resultsArrayBeginning += Number(numberOfResults);
    getParks(numberOfResults, selectedState, resultsArrayBeginning);
    renderParks(selectedState, numberOfResults, resultsArrayBeginning);
}


function clearSearchResults() {
    let jsonContainer = document.querySelector('.jsonContainer');
    jsonContainer.innerHTML = '';
    resultsArrayBeginning = 0;
    loadMoreButton.style.display = 'block'; //show load more button again
}