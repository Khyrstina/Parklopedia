

const icons = [
    { code: 1000, status: "Sunny", iconImg: '/images/clear.png' },
    { code: 1003, status: "Partly Cloudy", iconImg: '/images/partlyCloudy.png' },
    { code: 1006, status: "Cloudy", iconImg: '/images/cloudy.png' },
    { code: 1009, status: "Overcast", iconImg: '/images/cloudy.png' },
    { code: 1030, status: "Mist", iconImg: '/images/mistFog.png' },
    { code: 1063, status: "Patchy Rain Possible", iconImg: '/images/showers.png' },
    { code: 1066, status: "Patchy Snow Possible", iconImg: '/images/lightSnow.png' },
    { code: 1069, status: "Patchy Sleet Possible", iconImg: '/images/lightSnow.png' },
    { code: 1072, status: "Patchy Freezing Drizzle Possible", iconImg: '/images/lightSnow.png' },
    { code: 1087, status: "Thundery Outbreaks Possible", iconImg: '/images/storm.png' },
    { code: 1114, status: "Blowing Snow", iconImg: '/images/lightSnow.png' },
    { code: 1117, status: "Blizzard", iconImg: '/images/blizzard.png' },
    { code: 1135, status: "Fog", iconImg: '/images/mistFog.png' },
    { code: 1147, status: "Freezing Fog", iconImg: '/images/mistFog.png' },
    { code: 1150, status: "Patchy Light Drizzle", iconImg: '/images/showers.png' },
    { code: 1153, status: "Light Drizzle", iconImg: '/images/showers.png' },
    { code: 1168, status: "Freezing Drizzle", iconImg: '/images/lightSnow.png' },
    { code: 1171, status: "Heavy Freezing Drizzle", iconImg: '/images/snow.png' },
    { code: 1180, status: "Patchy Light Rain", iconImg: '/images/showers.png' },
    { code: 1183, status: "Light Rain", iconImg: '/images/showers.png' },
    { code: 1186, status: "Moderate Rain At Times", iconImg: '/images/rain.png' },
    { code: 1189, status: "Moderate Rain", iconImg: '/images/rain.png' },
    { code: 1192, status: "Heavy Rain At Times", iconImg: '/images/storm.png' },
    { code: 1195, status: "Heavy Rain", iconImg: '/images/storm.png' },
    { code: 1198, status: "Light Freezing Rain", iconImg: '/images/lightsnow.png' },
    { code: 1201, status: "Moderate Or Heavy Freezing Rain", iconImg: '/images/storm.png' },
    { code: 1204, status: "Light Sleet", iconImg: '/images/snow.png' },
    { code: 1207, status: "Moderate Or Heavy Sleet", iconImg: '/images/snow.png' },
    { code: 1210, status: "Patchy Light Snow", iconImg: '/images/snow.png' },
    { code: 1213, status: "Light Snow", iconImg: '/images/snow.png' },
    { code: 1216, status: "Patchy Moderate Snow", iconImg: '/images/snow.png' },
    { code: 1219, status: "Moderate Snow", iconImg: '/images/snow.png' },
    { code: 1222, status: "Patchy Heavy Snow", iconImg: '/images/snow.png' },
    { code: 1225, status: "Heavy Snow", iconImg: '/images/snow.png' },
    { code: 1237, status: "Ice Pellets", iconImg: '/images/snow.png' },
    { code: 1240, status: "Light Rain Shower", iconImg: '/images/showers.png' },
    { code: 1243, status: "Moderate Or Heavy Rain Shower", iconImg: '/images/severeStorm.png' },
    { code: 1246, status: "Torrential Rain Shower", iconImg: '/images/severeStorm.png' },
    { code: 1249, status: "Light Sleet Showers", iconImg: '/images/lightSnow.png' },
    { code: 1252, status: "Moderate Or Heavy Sleet Showers", iconImg: '/images/snow.png' },
    { code: 1255, status: "Light Snow Showers", iconImg: '/images/lightSnow.png' },
    { code: 1258, status: "Moderate Or Heavy Snow Showers", iconImg: '/images/snow.png' },
    { code: 1261, status: "Light Showers Of Ice Pellets", iconImg: '/images/snow.png' },
    { code: 1264, status: "Moderate Or Heavy Showers Of Ice Pellets", iconImg: '/images/snow.png' },
    { code: 1273, status: "Patchy Light Rain With Thunder", iconImg: '/images/storm.png' },
    { code: 1276, status: "Moderate Or Heavy Rain With Thunder", iconImg: '/images/severeStorm.png' },
    { code: 1279, status: "Patchy Light Snow With Thunder", iconImg: '/images/lightSnow.png' },
    { code: 1282, status: "Moderate Or Heavy Snow With Thunder", iconImg: '/images/snow.png' },
    
]

export async function findCorrectIcon(conditionCode) {
    console.log("Condition Code Received:", conditionCode); // Check the condition code received
    const correctIcon = icons.find((icon) => icon.code === conditionCode);
    console.log("Matching Icon:", correctIcon); // Check if the correctIcon was found
    if (correctIcon) {
      console.log("Icon Img:", correctIcon.iconImg); // Check the iconImg property
      console.log("The weatherIcon.js file was used!");
      return correctIcon.iconImg;
    } else {
      console.log("Icon not found for condition code:", conditionCode);
      return null;
    }
  }