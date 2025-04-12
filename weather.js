const apiKey = '7b43389fd5f2512b387b9c9d4e3dec5e'; // Replace with your OpenWeatherMap API key
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherInfo = document.getElementById('weather-info');
const mapElement = document.getElementById('map');

let map; // Variable to store the map instance
let marker; // Variable to store the marker

// Initialize the map
function initMap(lat, lon) {
  if (map) {
    map.remove(); // Remove existing map instance if it exists
  }
  map = L.map('map').setView([lat, lon], 10); // Set initial view to the city's coordinates
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Add a marker for the city
  if (marker) {
    marker.setLatLng([lat, lon]); // Update marker position if it exists
  } else {
    marker = L.marker([lat, lon]).addTo(map); // Add a new marker
  }
}

searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
  } else {
    alert('Please enter a city name.');
  }
});

async function fetchWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();

    if (data.cod === 200) {
      displayWeather(data);
      const { lat, lon } = data.coord; // Get latitude and longitude from the API response
      initMap(lat, lon); // Initialize or update the map
    } else {
      weatherInfo.innerHTML = `<p>City not found. Please try again.</p>`;
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    weatherInfo.innerHTML = `<p>An error occurred. Please try again later.</p>`;
  }
}

function displayWeather(data) {
  const { name, main, weather } = data;
  const temperature = main.temp;
  const description = weather[0].description;
  const icon = weather[0].icon;

  weatherInfo.innerHTML = `
    <h2>${name}</h2>
    <p>Temperature: ${temperature}°C</p>
    <p>Weather: ${description}</p>
    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
  `;
}