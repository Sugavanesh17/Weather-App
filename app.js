// state
let currCity = "London";
let units = "metric";

// Selectors
let city = document.querySelector(".weather__city");
let datetime = document.querySelector(".weather__datetime");
let weather__forecast = document.querySelector('.weather__forecast');
let weather__temperature = document.querySelector(".weather__temperature");
let weather__icon = document.querySelector(".weather__icon");
let weather__minmax = document.querySelector(".weather__minmax")
let weather__realfeel = document.querySelector('.weather__realfeel');
let weather__humidity = document.querySelector('.weather__humidity');
let weather__wind = document.querySelector('.weather__wind');
let weather__pressure = document.querySelector('.weather__pressure');

// search
document.querySelector(".weather__search").addEventListener('submit', e => {
    let search = document.querySelector(".weather__searchform");
    // prevent default action
    e.preventDefault();
    // change current city
    currCity = search.value;
    // get weather forecast 
    getWeather();
    // clear form
    search.value = ""
})

// units
document.querySelector(".weather_unit_celsius").addEventListener('click', () => {
    if(units !== "metric"){
        // change to metric
        units = "metric"
        // get weather forecast 
        getWeather()
    }
})

document.querySelector(".weather_unit_farenheit").addEventListener('click', () => {
    if(units !== "imperial"){
        // change to imperial
        units = "imperial"
        // get weather forecast 
        getWeather()
    }
})

function convertTimeStamp(timestamp, timezone) {
    // Convert timezone from seconds to minutes
    const timezoneOffset = timezone / 60; 

    const date = new Date((timestamp + timezone) * 1000); // Adjust for timezone

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        timeZone: "UTC" // Use UTC since the offset is manually adjusted
    };

    return date.toLocaleString("en-US", options);
}


// convert country code to name
function convertCountryCode(country){
    let regionNames = new Intl.DisplayNames(["en"], {type: "region"});
    return regionNames.of(country)
}

function displayAlert(message) {
    alert(message);
}

function checkAlertConditions(currentWeather) {
    const temperatureThreshold = 25; // Example threshold in Celsius
    const temperature = currentWeather.main.temp_max; // Get the current temperature
    console.log(`Current Temperature: ${temperature}`); // Log the temperature for debugging

    // Check if the temperature exceeds the threshold
    if (temperature > temperatureThreshold) {
        displayAlert(`Alert: Temperature exceeds ${temperatureThreshold}°C! Current temperature is ${temperature.toFixed()}°C.`);
    }
}

function getWeather() {
    const API_KEY = '0495e5ecf0ce24c7d668bcd4a3cf87a5';
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${currCity}&appid=${API_KEY}&units=${units}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            city.innerHTML = `${data.name}, ${convertCountryCode(data.sys.country)}`;
            datetime.innerHTML = convertTimeStamp(data.dt, data.timezone);
            weather__forecast.innerHTML = `<p>${data.weather[0].main}`;
            weather__temperature.innerHTML = `${data.main.temp.toFixed()}°`;
            weather__icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" />`;
            weather__minmax.innerHTML = `<p>Min: ${data.main.temp_min.toFixed()}°</p><p>Max: ${data.main.temp_max.toFixed()}°</p>`;
            weather__realfeel.innerHTML = `${data.main.feels_like.toFixed()}°`;
            weather__humidity.innerHTML = `${data.main.humidity}%`;
            weather__wind.innerHTML = `${data.wind.speed} ${units === "imperial" ? "mph" : "m/s"}`;
            weather__pressure.innerHTML = `${data.main.pressure} hPa`;

            // Call the alert check function
            checkAlertConditions(data);
        })
        
}
// Alert thresholds
const temperatureThreshold = 20;
const alertContainer = document.getElementById("alertsContainer");
let alertTriggered = false;

function checkAlerts(currentTemp) {
    if (currentTemp > temperatureThreshold && !alertTriggered) {
        displayAlert(`Alert: Temperature exceeds ${temperatureThreshold}°C!`);
        alertTriggered = true;
    } else if (currentTemp <= temperatureThreshold) {
        alertTriggered = false; // Reset alert when temperature is back to normal
    }
}

function displayAlert(message) {
    const alertMessage = document.createElement("p");
    alertMessage.textContent = message;
    alertContainer.appendChild(alertMessage);
}

document.body.addEventListener('load', getWeather())
