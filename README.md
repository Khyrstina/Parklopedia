# Parklopedia

## Overview

The Parklopedia project assists the public with accessing National Parks information provided by the National Parks Service through their publically available API (all API information will be linked below in the section titled 'API Information'). 

Parklopedia currently utilizes the National Park Service API to provide information and media, as well as a weather API to access current and future weather forecasts for a particular park using the Latitude and Longitude provided by the NPS. 


## Run Locally

1. Clone the project repository to your local environment:

```bash
  git clone https://link-to-project
```

2. Navigate to the project directory:

```bash
  cd my-project
```

3. If you're using Visual Studio Code, open the project by running:
```bash
code .
```
- Note: If you are not using VScode please follow the instructions specific to your code editor for opening existing projects.


## API Information

To use Parklopedia, you'll need two separate API keys:

- National Park Service API:  [Get your API key here](https://www.nps.gov/subjects/developer/api-documentation.htm#/)

- Weather API: [Get your API key here](https://www.weatherapi.com/)
## Creating config.js

Create a config.js file to store your API keys. Follow these steps:

1. Open a new file and name it config.js.

2. Copy and paste the following code into config.js: 

```
//National Parks APIKEY
export const apiKey = 'national_parks_api_key';

//Weather API APIKEY
export const weatherApiKey = 'weather_api_key';
```
3. Replace 'national_parks_api_key' and 'weather_api_key' with your actual API keys.

4. Save the config.js file (Ctrl + S) to ensure the changes are recognized by your code editor.


    
## Features

Parklopedia exceeds the recommended requirements for a capstone project. Below you will find a detailed list on what requirements it meets from the project outline document, as well as how it meets said requirements.

- Note: For many of the requirements Parklopedia uses the particular skill in multiple areas, for the sake of brevity I have only listed one or two examples for each.

#### Use arrays, object, sets, or maps to store and retrieve information that is displayed in your app.
 - Parklopedia utilizes arrays for storing and retrieving data. For instance, it maintains an array of objects representing parks, populated with data fetched from the National Park Service API.

#### Analyze data that is stored in arrays, objects, sets or maps and display information about it in your app.
 - The alerts section of the parkinfo page is color coded based on severity. This is done by analyzing the JSON that was returned, and changing the color accordingly.
 - The data that is stored in both the Park arrays, the objects that are a part of the Park arrays, and the slideshow array are all displayed in different parts of the application. 

#### Retrieve data from a third-party API and use it to display something within your app.
 - As explained above, currently two third-party APIs are in use.

#### Implement modern interactive UI features (e.g. table/data sorting, autocomplete, drag-and-drop, calendar-date-picker, etc).
 - On the search page, the input into the search field is parsed in order to provide suggestions that autofill when clicked. This also allows the search to provide more accurate results as typos and input errors are corrected.

#### Analyze text and display useful information about it. (e.g. word/character count in an input field)
 - The text input on the search page is analyzed to see if it matches any of the approved search options (U.S. States). If no State is selected, the search box will provide the user with a reminder of the instructions and not allow the search to submit.

#### Calculate and display data based on an external factor (ex: get the current date, and display how many days remaining until some event).
 - The alerts section of the parkinformation page only displays alerts that have been released in the last 3 months. It does this by taking the current date, as well as the date that the alert was created by the NPS, and calculating how many days it has been. 



