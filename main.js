


const weatherForm = document.querySelector(".weatherForm"); 
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "f1d01a4f04953e935341051fdaa4dec2";
let map; // Define the map variable here




weatherForm.addEventListener("submit", async event => {
    event.preventDefault();
    const city = cityInput.value;
    if(city){
        try{
            const response = await getWeatherData(city);
            weatherDisplay(response);
        }
        catch(error){
            console.error(error);
            displayError("COULD NOT FIND CITY");
        }
    }
    else{
        displayError("PLEASE ENTER A CITY");
    }
})

async function getWeatherData(city){
    const urlKey = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await fetch(urlKey);
    if(!response.ok){
        throw new Error("Could not fetch data");
    }
    return await response.json();
}

function displayError(message){
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");
    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);
    const mapDiv = document.getElementById("map");
    if (mapDiv) mapDiv.style.display = "none"; // Hide map on error
}

function weatherDisplay(data){
    console.log(data);

    const {name: city, main: {temp, humidity}, weather: [{description, id}], coord: {lat, lon}} = data;

    // Clear existing content
    card.textContent = "";

    const cityName = document.createElement("h1");
    cityName.textContent = city.toUpperCase();
    cityName.classList.add("h1");

    const tempDisplay = document.createElement("p");
    tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}°C`;
    tempDisplay.classList.add("tempDisplay");

    const humidityDisplay = document.createElement("p");
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    humidityDisplay.classList.add("humidityDisplay");

    const descDisplay = document.createElement("p");
    descDisplay.textContent = description;
    descDisplay.classList.add("descDisplay");

    const weatherEmojiDisplay = document.createElement("p");
    weatherEmojiDisplay.textContent = getWeatherEmoji(id);
    weatherEmojiDisplay.classList.add("weatherEmojiDisplay");

    // Append data elements to card
    card.appendChild(cityName);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmojiDisplay);

    // Create map container inside the card
    const mapDiv = document.createElement("div");

    mapDiv.id = "map";
    mapDiv.style.height = "500px"; // Set a height for the map to render correctly
    mapDiv.style.width ="100%";
    mapDiv.style.borderRadius ="20px";
  
    card.appendChild(mapDiv);
   
    card.style.display = "flex";

    // Display the map with city coordinates
    displayMap(lat, lon, city);
}

function displayMap(lat, lon, city){
    const mapDiv = document.getElementById("map");
    mapDiv.style.display = "block"; // Show the map

    // Remove existing map instance if it exists
    if (map) {
        map.remove();
    }

    // Initialize the map in the new mapDiv inside the card
    map = L.map('map').setView([lat, lon], 14);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Add a marker for the city
    L.marker([lat, lon]).addTo(map)
        .bindPopup(`<b>${city}</b><br>Coordinates: ${lat.toFixed(2)}, ${lon.toFixed(2)}`)
        .openPopup();
}

function getWeatherEmoji(weatherId){
    switch(true){
        case (weatherId >= 200 && weatherId < 300): return "⛈️";
        case (weatherId >= 300 && weatherId < 400): return "🌦️";
        case (weatherId >= 500 && weatherId < 600): return "🌧️";
        case (weatherId >= 600 && weatherId < 700): return "❄️";
        case (weatherId >= 701 && weatherId < 782): return "🌫️";
        case (weatherId === 800): return "☀️";
        case (weatherId >= 801 && weatherId < 900): return "☁️";
    }
}
