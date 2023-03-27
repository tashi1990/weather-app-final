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

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();

  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function getForecast(city) {
  let apiKey = `24boa6cedt6f70a95aa73af3f70e5464`;
  let units = "metric";
  let apiURL = `https://api.shecodes.io/weather/v1/forecast?query={${city}}&key=${apiKey}&units=${units}`;
  axios.get(apiURL).then(displayForecast);
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (dayForecast, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
            <div class="col-2 text-center weather-forecast">
              <div class="weather-forecast-day">${formatDay(
                dayForecast.time
              )}</div>
              <div class="icon-container">
                <img
                  src="media/${dayForecast.condition.icon}.png"
                  id="forecast-icon"
                  class="forecast-icon"
                />
              </div>
              <div class="weather-forecast-temperatures">
                <span class="weather-forecast-max">${Math.round(
                  dayForecast.temperature.maximum
                )}°</span
                ><span class="weather-forecast-min">${Math.round(
                  dayForecast.temperature.minimum
                )}°</span>
              </div>
            </div>
`;
    }
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
    `media/${response.data.condition.icon}.png`
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
  city = cityInputElement.value;
  search(city);
}

let form = document.querySelector("#search-engine");
form.addEventListener("submit", handleSubmit);

function convertCelsiusToFahrenheit(tempInCelsius) {
  let fahrenheitTemperature = tempInCelsius * (9 / 5) + 32;
  return Math.round(fahrenheitTemperature);
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

let city = "Berlin";
search(city);
