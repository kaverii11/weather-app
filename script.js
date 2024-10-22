function getWeather() {
    const apiKey = `ebf631fb685061e66b0f142c097597f8`;
    const city = document.getElementById('city').value;
    if (!city) {
        alert('Please enter a city');
        return;
    }
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`; // Metric units
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`; // Metric units

    // Fetch current weather data
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {  
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data', error);
            displayError('Error fetching current weather data. Please try again.');
        });

    // Fetch forecast data
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {  
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data', error);
            displayError('Error fetching hourly forecast data. Please try again.');
        });
}

// Function to display the current weather data
function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    
    // Clear previous content
    tempDivInfo.innerHTML = '';
    weatherInfoDiv.innerHTML = '';

    // Handle 404 error
    if (data.cod == '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp); // No need for conversion
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        // Update HTML content
        tempDivInfo.innerHTML = `<p>${temperature}°C</p>`;
        weatherInfoDiv.innerHTML = `<p>${cityName}</p><p>${description}</p>`;
        
        // Update weather icon
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;
        weatherIcon.style.display = 'block'; // Show icon if hidden
    }
}

// Function to display hourly forecast data
function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    hourlyForecastDiv.innerHTML = '';  // Clear previous content

    const next24Hours = hourlyData.slice(0, 8);  // Get next 8 hours (24-hour forecast)

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp); // Already in Celsius
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

// Function to handle errors
function displayError(message) {
    const weatherInfoDiv = document.getElementById('weather-info');
    weatherInfoDiv.innerHTML = `<p>${message}</p>`;
}
