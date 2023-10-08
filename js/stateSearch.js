import { apiKey } from "./config.js";
import {usStates} from "./parseStates.js"
import { validateSearchInput } from "./parseStates.js";


const suggestionsContainer = document.getElementById('suggestionsContainer');
const resultsSelect = document.getElementById('numberResultsRetrieved');
const previousButton = document.getElementById('previousButton');
const nextButtonTop = document.getElementById('nextButtonTop');
const nextButtonBottom = document.getElementById('nextButtonBottom');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchBarButton');

let currentPage = 1;
let totalAvailableSearchResults = 0;
let beginningParksArray = 0;
let selectedState = '';
let requestedNumResults = 10;
let fetchingData = false;
let totalPages = 0;

resultsSelect.addEventListener('change', (event) => {
    requestedNumResults = event.target.value; 
});

resultsSelect.addEventListener('input', (event) => {
    requestedNumResults = event.target.value; 
});

searchInput.addEventListener('input', () => {
const inputValue = searchInput.value.toUpperCase();
const matchingStates = usStates.filter(state => (
        state.name.includes(inputValue) || state.code.includes(inputValue)
    ));
    
    // Clear previous suggestions
    suggestionsContainer.innerHTML = '';
    
    // Display matching state suggestions
    matchingStates.forEach(state => {
        const suggestion = document.createElement('div');
        suggestion.textContent = state.name + ' (' + state.code + ')';
        suggestion.addEventListener('click', () => {
            // Set the input field value to the selected state
            searchInput.value = state.name;
            // Clear the suggestions
            suggestionsContainer.innerHTML = '';
        });
        suggestionsContainer.appendChild(suggestion);
    });
});

searchButton.addEventListener('click', async (event) => {
    event.preventDefault();
    const query = searchInput.value;

    if (!fetchingData) {
        fetchingData = true;
        selectedState = await validateSearchInput(query);
        totalAvailableSearchResults = await getTotalNumberResults(selectedState);
        currentPage = 1;
        beginningParksArray = 0;
        clearSearchResults();
        await renderParks(selectedState, requestedNumResults, beginningParksArray);
        fetchingData = false;

        totalPages = Math.ceil(totalAvailableSearchResults / requestedNumResults);
        updatePaginationButtons();
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

nextButtonTop.addEventListener('click', nextPage);
nextButtonBottom.addEventListener('click', nextPage);


document.addEventListener('click', (event) => {
    if (event.target.classList.contains('parkInfoBtn')) {
        const parkID = event.target.getAttribute('dataParkID');
        startParkInfoReq(parkID);
    }
});

async function getTotalNumberResults(selectedState) {
    let apiUrl = `https://developer.nps.gov/api/v1/parks?start=0&limit=100&q=${selectedState}&api_key=${apiKey}`;
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

    let apiUrl = `https://developer.nps.gov/api/v1/parks?stateCode=${selectedState}&start=${resultsArrayBeginning}limit=${numberOfResults}&api_key=${apiKey}`;
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
        nextButtonTop.style.display = 'none';
        nextButtonBottom.style.display = 'none';

    } 
}

function updatePaginationButtons() {
    const totalPages = Math.ceil(totalAvailableSearchResults / requestedNumResults);
    previousButton.disabled = currentPage === 1;


    if (currentPage === totalPages || totalAvailableSearchResults - beginningParksArray <= requestedNumResults) {
        nextButtonTop.style.display = 'none';
        nextButtonBottom.style.display = 'none';
    } else {
        nextButtonTop.style.display = 'block';
        nextButtonBottom.style.display = 'block';
    }
}

async function nextPage() {
    if (!fetchingData) {
        if (currentPage < totalPages) {
            fetchingData = true;
            currentPage++;
            beginningParksArray += requestedNumResults; 
            await renderParks(selectedState, requestedNumResults, beginningParksArray);
            fetchingData = false;
        }
        updatePaginationButtons();
    }

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
