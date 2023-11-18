import { weatherApiKey } from "./config.js";

export async function getWeatherInfo(latitude, longitude) {
  const weatherApiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${
    latitude + "," + longitude
  }&days=4&aqi=no&alerts=yes`;
  console.log(weatherApiUrl);
  console.log(latitude + "," + longitude);
  try {
    let resp = await fetch(weatherApiUrl);
    let data = await resp.json();

    return data;
  } catch (error) {
    console.log(error);
  }
}
