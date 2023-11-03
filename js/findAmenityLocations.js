import { apiKey } from "./config.js";

let thingsToDo;

export async function getThingsToDoInformation(fourCharacterParkCode, header, amenityCodes) {
  const amenitiesUrl = `https://developer.nps.gov/api/v1/amenities/parksplaces?parkCode=${fourCharacterParkCode}&limit=100&sort=&api_key=${apiKey}`;


    const response = await fetch(amenitiesUrl, {
      headers: {
        //adding this as an attempt to fix the empty parks array returned
        'accept': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      // Takes string of amenities from value of checkboxes, and converts to array where it is in all uppercase
      const amenityIdsToSearchFor = amenityCodes;

      // These are the outermost values in the array, not the individual amenities. So num of results, limit I set etc.
      const total = data.total;
      const limit = data.limit;
      const start = data.start;
      const amenities = data.data;

      // This is where I store matching amenities
      const matchingAmenities = [];

      // The amenityid is unique to each amenity
      amenities.forEach(amenityGroup => {
        amenityGroup.forEach(amenity => {
          const amenityId = amenity.id;
          const amenityName = amenity.name;


          //if the amenityId matches the amenityId in the array of amenityIdsToSearchFor
          if (amenityIdsToSearchFor.includes(amenityId)) {
            // If the amenityId matches we push it to the matchingAmenities array
            matchingAmenities.push(amenity);
          }

        });
      });
      // This is the established section I created in my HTML to put the amenities in
      const amenitiesHTML = document.getElementById('availableAmenitiesId');

     // If there are amenities, go through each of the matching amenities and then add the parks to the list
     if (matchingAmenities.length > 0) {
      // Create a new section for each amenity type
      const amenityList = document.createElement('div');
      // Create a new ul for each matching amenity of that type
      const amenityHeaderItem = document.createElement('ul');
      amenityHeaderItem.textContent = header; // Use the id of the checkbox.id as the header
      amenityList.appendChild(amenityHeaderItem);
  

      //for each amenity in matching amenities, set the amenityName to the name of the amenity and the parks to the parks array
      matchingAmenities.forEach(amenity => {
        const amenityName = amenity.name;
        const parks = amenity.parks; //Due to API issue, this currently retrieves an empty array
  
        // Create a new li for each matching amenity
        const amenityListItem = document.createElement('li');
        amenityListItem.textContent = amenityName;
        amenityList.appendChild(amenityListItem);
  
        // Going through each of the parks and adding the name/parkCode and creating a li for them
        //Reminder that this is currently returning empty due to API issue
        parks.forEach(park => {
          const parkName = park.name;
          const parkCode = park.parkCode;
          const parkListItem = document.createElement('li');
          parkListItem.textContent = `${parkName} (${parkCode})`;
          amenityList.appendChild(parkListItem);
        });
      });
  
      // Put the finished amenityList inside the already existing HTML element
      amenitiesHTML.appendChild(amenityList);
    }

    else {
      // If there are no matching amenities, notify the user that we couldn't find any for that type
      amenitiesHTML.innerHTML += `<h5>No matching amenities found for ${header}</h5>`;
    }
  }
}
