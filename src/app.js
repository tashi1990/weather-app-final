function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function getForecast(city) {
  let apiKey = `24boa6cedt6f70a95aa73af3f70e5464`;
  let units = "metric";
  let apiURL = `https://api.shecodes.io/weather/v1/forecast?query={${city}}&key=${apiKey}&units=${units}`;
  console.log(apiURL);
  axios.get(apiURL).then(displayForecast);
}

function displayForecast(response) {
  console.log(response.data);
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  let days = ["Tues", "Wed", "Thur", "Fri", "Sat"];
  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `
            <div class="col-2 text-center weather-forecast">
              <div class="weather-forecast-day">${day}</div>
              <img
                src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/few-clouds-day.png"
                id="forecast-icon"
                class="forecast-icon"
              />
              <div class="weather-forecast-temperatures">
                <span class="weather-forecast-max">18°</span
                ><span class="weather-forecast-min">10°</span>
              </div>
            </div>
`;
  });

  forecastHTML = forecastHTML + `</div`;
  forecastElement.innerHTML = forecastHTML;
}

function displayCurrentWeather(response) {
  let temperatureElement = document.querySelector("#current-temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  let mainIconElement = document.querySelector("#main-icon");

  celsiusTemperature = Math.round(response.data.temperature.current);
  getForecast(city);

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityElement.innerHTML = response.data.city;
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = response.data.temperature.humidity;
  windElement.innerHTML = response.data.wind.speed;
  dateElement.innerHTML = formatDate(response.data.time * 1000);
  mainIconElement.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
}

function search(city) {
  let apiKey = `24boa6cedt6f70a95aa73af3f70e5464`;
  let units = "metric";
  let apiURL = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=${units}`;
  axios.get(apiURL).then(displayCurrentWeather);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

let form = document.querySelector("#search-engine");
form.addEventListener("submit", handleSubmit);

function convertCelsiusToFahrenheit(tempInCelsius) {
  let fahrenheitTemperature = tempInCelsius * (9 / 5) + 32;
  return Math.round(fahrenheitTemperature);
  console.log(fahrenheitTemperature);
}

let celsiusTemperature = null;

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#current-temperature");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = convertCelsiusToFahrenheit(celsiusTemperature);
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#current-temperature");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}
let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

//N.B. Need to work out how to display current location info when opening, using the following geolocation tool:

//function handlePosition(position) {
//console.log(position.coords.latitude);
//console.log(position.coords.longitude);
//}

//navigator.geolocation.getCurrentPosition(handlePosition);

let city = "Berlin";
search(city);
