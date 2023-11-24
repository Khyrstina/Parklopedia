import { apiKey } from "./config.js";

export async function getParkInfo(parkID) {
  const apiUrl = `https://developer.nps.gov/api/v1/parks?limit=1&start=0&q=${parkID}&sort=-relevanceScore&api_key=${apiKey}`;
  try {
    let resp = await fetch(apiUrl);
    let data = await resp.json();
    console.log(apiUrl, "apiUrl");
    return data.data;
  } catch (error) {
    console.log(error);
  }
}
