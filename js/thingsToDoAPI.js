import { apiKey } from "./config.js";

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchBarButton");
const selectASuggestionText = document.getElementById("labelSearchInput");
let fourCharacterParkCode = '';

searchInput.addEventListener("input", () => {

});

searchButton.addEventListener("click", async (event) => {
  event.preventDefault();
  const query = searchInput.value;
  if (query.trim() !== "") {
    fourCharacterParkCode = query;
    const thingsToDo = await getParkInfo(query);
    renderThingsToDo(thingsToDo); 
  } else {
    selectASuggestionText.style.color = "red";
    console.log('Error on searchButton');
  }
});

 async function getParkInfo(fourCharacterParkCode) {
  const apiUrl = `https://developer.nps.gov/api/v1/thingstodo?parkCode=${fourCharacterParkCode}&limit=200&api_key=${apiKey}`;
  try {
    let resp = await fetch(apiUrl);
    let thingsToDo = await resp.json();
    return data.data;
  } catch (error) {
    console.log(apiUrl);
  }
}

async function renderThingsToDo(thingsToDo) {
  let gridContainer = document.querySelector(".grid-container");
  // Content in the grid container is emptied
  gridContainer.innerHTML = "";

  if (thingsToDo.length > 0) {
    thingsToDo.forEach((thing, index) => {
      const thingToDoName = thing.title;
      const thingToDoDescription = thing.shortDescription;
      const thingsToDoAccessibility = thing.accessibilityInformation;
      const thingUrlMoreInfo = thing.url;

      const contentContainer = document.createElement("div");
      contentContainer.classList.add("singleThingToDo");

      contentContainer.innerHTML = `<h4>${thingToDoName}</h4> 
        <p>Description: ${thingToDoDescription} <br> 
        Accessiblity: ${thingsToDoAccessibility} <br>
        ${
          thingUrlMoreInfo
            ? `<a href="${thingUrlMoreInfo}" target="_blank">More Info Here</a>`
            : ""
        }
      </p>`;
      gridContainer.appendChild(contentContainer);
    });
  } else {
    gridContainer.innerHTML = 'ZERO RETURNS';
  }
}