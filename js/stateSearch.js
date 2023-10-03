import {apiKey} from "./config.js";

const stateSelect = document.getElementById('stateId');
const resultsSelect = document.getElementById('numberResultsRetrieved');
const submitSearchButton = document.getElementById('submitSearchBtn');
const previousButton = document.getElementById('previousButton');
const nextButton = document.getElementById('nextButton');
const searchAgainBtn = document.getElementById('searchAgainBtn');


let currentPage = 1;
let totalAvailableSearchResults = 0;
let beginningParksArray = 0;
let selectedState = '';
let requestedNumResults = '';
let fetchingData = false; 
let totalPages = 0;

stateSelect.addEventListener('change', (event) => {
    selectedState = stateSelect.value;
});

resultsSelect.addEventListener('change', (event) => {
    requestedNumResults = resultsSelect.value;
});

submitSearchButton.addEventListener('click', async (event) => {
    event.preventDefault();

    if (!fetchingData) {
        fetchingData = true;
        totalAvailableSearchResults = await getTotalNumberResults(selectedState);
        beginningParksArray = 0;
        clearSearchResults();
        await renderParks(selectedState, requestedNumResults, beginningParksArray);
        fetchingData = false;

        totalPages = Math.ceil(totalAvailableSearchResults / requestedNumResults);

        fetchingData = false;

        // Hide the "Submit Search" button and show the "Next" button
        submitSearchButton.style.display = 'none';
        nextButton.style.display = 'block';
    }
});

previousButton.addEventListener('click', () => {
    if (!fetchingData && currentPage > 1) {
        fetchingData = true;
        currentPage--;
        beginningParksArray -= requestedNumResults;
        renderParks(selectedState, requestedNumResults, beginningParksArray);
        fetchingData = false;
    }
    updatePaginationButtons();
});

nextButton.addEventListener('click', () => {
    if (!fetchingData) {
        
        if (currentPage < totalPages) {
            fetchingData = true;
            currentPage++;
            beginningParksArray += requestedNumResults;
            renderParks(selectedState, requestedNumResults, beginningParksArray);
            fetchingData = false;
        }
        updatePaginationButtons();
    }
});

searchAgainBtn.addEventListener('click', () => {
    clearSearchResults();
    searchAgainBtn.style.display = 'none';
    currentPage = 1;
    totalAvailableSearchResults = 0;
    selectedState = '';
    requestedNumResults = '';
    stateSelect.value = '';
    resultsSelect.value = '';

    // Show the "Submit Search" button and hide the "Next" button
    submitSearchButton.style.display = 'inline-block';
    nextButton.style.display = 'none';
});


submitSearchButton.addEventListener('click', async (event) => {
    event.preventDefault();
    totalAvailableSearchResults = await getTotalNumberResults(selectedState);

    beginningParksArray = 0;
    clearSearchResults();

    await renderParks(selectedState, requestedNumResults, beginningParksArray);

    // Show the "Search Again" button and hide the "Submit" button
    searchAgainBtn.style.display = 'inline-block';
    submitSearchButton.style.display = 'none';

});

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('parkInfoBtn')) {
        const parkID = event.target.getAttribute('dataParkID');
        startParkInfoReq(parkID);
    }
});

async function getTotalNumberResults(selectedState) {
    let apiUrl = `https://developer.nps.gov/api/v1/parks?start=0limit=100&q=${selectedState}&api_key=${apiKey}`;
    try {
        let resp = await fetch(apiUrl);
        let data = await resp.json();
        totalAvailableSearchResults = data.total;
        console.log(totalAvailableSearchResults);
        return totalAvailableSearchResults;
    }
    catch (error) {
        console.log(error);
        return 0;
    }
}


async function getAllParks(numberOfResults, selectedState, resultsArrayBeginning) {
    let apiUrl = `https://developer.nps.gov/api/v1/parks?start=${resultsArrayBeginning}limit=${numberOfResults}&q=${selectedState}&api_key=${apiKey}`;
    let html = '';
    try {
        let resp = await fetch(apiUrl);
        let data = await resp.json();

        return data.data;
    }
    catch (error) {
        console.log(error);
    }
}

async function renderParks(selectedState, numberOfResults, resultsArrayBeginning) {
    let parks = await getAllParks(numberOfResults, selectedState, resultsArrayBeginning);
    let html = '';
    parks.forEach((park, index) => {

        const backgroundSelectionClass = index % 2 === 0 ? 'backgroundBoxColorEven' : 'backgroundBoxColorOdd';


        let htmlSegment = `
        <ul>
            <li class="park ${backgroundSelectionClass}">
                <h2>${park.fullName}</h2> <br>

                <img src="${park.images[0]?.url || ''}" class="parkImage" alt="park image">

                <div class="info">
                <button class="parkInfoBtn" dataParkID="${park.id}"">See all Park Info Here</button>
                <ul>
                        <li> ${park.images[0]?.caption || ''}</li>
                        <li><a href="${park.url || ''}">Click here for the NPS entry on this park.</a> </li>
                        <li>Park ID: ${park.id} </li>
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

    updatePaginationButtons();

    if (currentPage === totalPages) {
        let endMessage = '<h2>You have reached the end of the results</h2>';
        jsonContainer.innerHTML += endMessage;
        nextButton.style.display = 'none';
        searchAgainBtn.style.display = 'inline-block';
    } 
}

function updatePaginationButtons() {
    const totalPages = Math.ceil(totalAvailableSearchResults / requestedNumResults);
    previousButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
}

function nextPage() {
    beginningParksArray += Number(requestedNumResults);
    getAllParks(requestedNumResults, selectedState, beginningParksArray);
    renderParks(selectedState, requestedNumResults, beginningParksArray);
}

function clearSearchResults() {
    let jsonContainer = document.querySelector('.jsonContainer');
    jsonContainer.innerHTML = '';
    beginningParksArray = 0;

}

function startParkInfoReq(parkID) {
    sessionStorage.setItem('parkIDSpecific', parkID);
    window.location.href = '../parkInfoPage.html';

}