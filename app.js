let currCity = "London";
let units = "metric";

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


document.querySelector(".weather__search").addEventListener('submit', e => {
    let search = document.querySelector(".weather__searchform");
    e.preventDefault();
    currCity = search.value;
    getWeather();
    search.value = ""
})

document.querySelector(".weather_unit_celsius").addEventListener('click', () => {
    if(units !== "metric"){
        units = "metric"
        getWeather()
    }
})

document.querySelector(".weather_unit_farenheit").addEventListener('click', () => {
    if(units !== "imperial"){
        units = "imperial"
        getWeather()
    }
})

function convertTimeStamp(timestamp, timezone) {
    const timezoneOffset = timezone / 60; 
    const date = new Date((timestamp + timezone) * 1000); 
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        timeZone: "UTC" 
    };
    return date.toLocaleString("en-US", options);
}

function convertCountryCode(country){
    let regionNames = new Intl.DisplayNames(["en"], {type: "region"});
    return regionNames.of(country)
}

function displayAlert(message) {
    alert(message);
}

function checkAlertConditions(currentWeather) {
    const temperatureThreshold = 25; 
    const temperature = currentWeather.main.temp_max; 
    console.log(`Current Temperature: ${temperature}`); 
    if (temperature > temperatureThreshold) {
        displayAlert(`Alert: Temperature exceeds ${temperatureThreshold}°C! Current temperature is ${temperature.toFixed()}°C.`);
    }
}

function getWeather() {
    const API_KEY = <YOUR_API_KEY>; //Your API key
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
            checkAlertConditions(data);
        })
        
}

const temperatureThreshold = 35;
const alertContainer = document.getElementById("alertsContainer");
let alertTriggered = false;

function checkAlerts(currentTemp) {
    if (currentTemp > temperatureThreshold && !alertTriggered) {
        displayAlert(`Alert: Temperature exceeds ${temperatureThreshold}°C!`);
        alertTriggered = true;
    } else if (currentTemp <= temperatureThreshold) {
        alertTriggered = false; 
    }
}

function displayAlert(message) {
    const alertMessage = document.createElement("p");
    alertMessage.textContent = message;
    alertContainer.appendChild(alertMessage);
}

document.body.addEventListener('load', getWeather())
