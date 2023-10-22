import { apiKey } from "./config.js";
import {usStates} from "./parseStates.js"
import { validateSearchInput } from "./parseStates.js";


const suggestionsContainer = document.getElementById('suggestionsContainer');
const resultsSelect = document.getElementById('numberResultsRetrieved');
const previousButtonTop = document.getElementById('previousButtonTop');
const previousButtonBottom = document.getElementById('previousButtonBottom');
const nextButtonTop = document.getElementById('nextButtonTop');
const nextButtonBottom = document.getElementById('nextButtonBottom');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchBarButton');
const selectASuggestionText = document.getElementById('labelSearchInput');

let currentPage = 1;
let totalAvailableSearchResults = 0;
let beginningParksArray = 0;
let selectedState = '';
let requestedNumResults = 10;
let fetchingData = false;
let totalPages = 0;
let selectedSuggestionIndex = -1;
let suggestionSelected = false;
let matchingStates = '';


resultsSelect.addEventListener('change', (event) => {
    requestedNumResults = event.target.value; 
});

resultsSelect.addEventListener('input', (event) => {
    requestedNumResults = event.target.value; 
});



searchInput.addEventListener('input', () => {
    // Reset for new input
    suggestionSelected = false;
    selectASuggestionText.style.color = "black";
    suggestionsContainer.style.borderColor = 'none';

    const inputValue = searchInput.value.toUpperCase();
    
    // Check if the input is empty
    if (inputValue.trim() === '') {
        // Clear the suggestions box
        suggestionsContainer.innerHTML = '';
    } else {
        matchingStates = usStates.filter(state => (
            state.name.includes(inputValue) || state.code.includes(inputValue)
        ));

        suggestionsContainer.innerHTML = '';

        // Update the selected suggestion index when the input changes
        selectedSuggestionIndex = -1;

        matchingStates.forEach((state) => {
            const suggestion = document.createElement('p');
            suggestion.classList.add('suggestion');
            suggestion.textContent = state.name + ' (' + state.code + ')';
            suggestion.addEventListener('click', () => {
                suggestionSelected = true;
                searchInput.value = state.name;
                suggestionsContainer.innerHTML = '';
            });

            suggestionsContainer.appendChild(suggestion);
            suggestionsContainer.style.borderColor = '#e7e6d6';
        });
    }
});


searchButton.addEventListener('click', async (event) => {
    event.preventDefault();
    const query = searchInput.value;

    if (!fetchingData) {
        if (suggestionSelected && query.trim() !== '') {
            selectedState = '';
            selectedState = await validateSearchInput(query);

            if (searchInput && selectedState !== '') {
                fetchingData = true;
                totalAvailableSearchResults = await getTotalNumberResults(selectedState);
                currentPage = 1;
                beginningParksArray = 0;
                clearSearchResults();
                await renderParks(selectedState, requestedNumResults, beginningParksArray);
                fetchingData = false;

                totalPages = Math.ceil(totalAvailableSearchResults / requestedNumResults);
                updatePaginationButtons();
            } else {
                selectASuggestionText.style.color = "red";
            }
        } else {
            selectASuggestionText.style.color = "red";
        }
    }
});



nextButtonTop.addEventListener('click', nextPage);
nextButtonBottom.addEventListener('click', nextPage);
previousButtonBottom.addEventListener('click', previousPage);
previousButtonTop.addEventListener('click', previousPage);


async function getTotalNumberResults(selectedState) {
    let apiUrl = `    https://developer.nps.gov/api/v1/parks?stateCode=${selectedState}&limit=100&start=0&api_key=${apiKey}`;
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

    let apiUrl = `https://developer.nps.gov/api/v1/parks?stateCode=${selectedState}&start=${resultsArrayBeginning}&limit=${numberOfResults}&api_key=${apiKey}`;
    try {
        let resp = await fetch(apiUrl);
        let data = await resp.json();
        console.log('getAllParks url:'+  apiUrl);
        return data.data;
    }
    catch (error) {
        console.log(error);
    }
}

async function renderParks(selectedState, numberOfResults, resultsArrayBeginning) {
    let parks = await getAllParks(numberOfResults, selectedState, resultsArrayBeginning);
    let gridContainer = document.querySelector('.grid-container');

    // Content in the grid container is emptied
    gridContainer.innerHTML = '';

    parks.forEach((park, index) => {

        // parkButton is a link that makes the park container a button
        const parkButton = document.createElement('a');
        parkButton.classList.add('grid-item', 'park-container', 'parkButton'); 
        parkButton.dataset.ParkID = park.id;
        parkButton.tabIndex = 0;

        parkButton.setAttribute('role', 'button');
        parkButton.setAttribute('aria-label', park.fullName);

        // event listener for when park is clicked
        parkButton.addEventListener('click', (event) => {
            if (event.target.classList.contains('parkButton')) {
                const parkID = event.target.getAttribute('data--park-i-d');
                startParkInfoReq(parkID);
            }
        });

        // Image Container to hold image
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('grid-item-image', 'park-image-container');

        // Image to go into container
        const parkImage = document.createElement('img');
        parkImage.onerror = () => {
            // if 404 received for image
            parkImage.src = './images/imgNotFound.png';
        };
        parkImage.src = park.images[0]?.url;

        // Gradient Overlay
        const imageOverlay = document.createElement('div');
        imageOverlay.classList.add('image-overlay');
        imageOverlay.style.background = 'linear-gradient(0deg, #00000088 30%, #ffffff44 100%)';

        // Content to hold the info for the park
        const contentContainer = document.createElement('div');
        contentContainer.classList.add('park-details');

        // h2 for the park name
        const parkName = document.createElement('h2');
        parkName.textContent = park.fullName;

        // slightly smaller city,state for park
        const cityState = document.createElement('h3');
        cityState.textContent = park.addresses[0]?.city + ', ' + park.addresses[0]?.stateCode;

        // parkName and cityState both go into the contentContainer to be positioned together
        contentContainer.appendChild(parkName);
        contentContainer.appendChild(cityState);

        // the image overlay contains the content since it goes on top of the gradient background
        imageOverlay.appendChild(contentContainer);

        // Everything goes into the image container
        imageContainer.appendChild(imageOverlay);
        imageContainer.appendChild(parkImage);

        // image container is added to button
        parkButton.appendChild(imageContainer);

        // button (and everything added to it) goes into the container area
        gridContainer.appendChild(parkButton);
    });
}

    updatePaginationButtons();



function updatePaginationButtons() {
    const totalPages = Math.ceil(totalAvailableSearchResults / requestedNumResults);
    previousButtonTop.disabled = currentPage === 1;
    previousButtonBottom.disabled = currentPage === 1;

    if (currentPage === totalPages || totalAvailableSearchResults - beginningParksArray <= requestedNumResults) {
        nextButtonTop.style.display = 'none';
        nextButtonBottom.style.display = 'none';
    } else {
        nextButtonTop.style.display = 'block';
        nextButtonBottom.style.display = 'block';
    }

    if (currentPage > 1) {
        previousButtonBottom.style.display = 'block';
        previousButtonTop.style.display = 'block';
    }
    else {
        previousButtonBottom.style.display = 'none';
        previousButtonTop.style.display = 'none';
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

async function previousPage() {
    if (!fetchingData && currentPage > 1) {
        fetchingData = true;
        currentPage--;
        beginningParksArray -= requestedNumResults;
        await renderParks(selectedState, requestedNumResults, beginningParksArray);
        fetchingData = false;
    }
    updatePaginationButtons();
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
