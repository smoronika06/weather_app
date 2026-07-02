import './App.css';
import { useState } from 'react';
import { motion } from "framer-motion";

function App() {

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const apiKey = "ed22e21464650447949e666da6d86454";

  // 🌤 Search Weather
  const getWeather = async () => {

    if (!city.trim()) {
      setError("⚠️ Please enter a city name");
      setWeather(null);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );

      const data = await response.json();

      if (data.cod === "404") {
        setError("❌ City not found");
        setWeather(null);
      } else {
        setWeather(data);
      }

      // 📊 Forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );

      const forecastData = await forecastRes.json();
      setForecast(forecastData.list.slice(0, 5));

    } catch (err) {
      setError("⚠️ Something went wrong");
    }

    setLoading(false);
  };

  // 📍 My Location Weather
  const getMyLocation = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );

        const data = await res.json();
        setWeather(data);

        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );

        const forecastData = await forecastRes.json();
        setForecast(forecastData.list.slice(0, 5));

      } catch (err) {
        setError("⚠️ Location error");
      }

    });
  };

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>

      {/* Title + Dark Mode */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🌤 Weather App

        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </motion.h1>

      {/* Input */}
      <input
        type="text"
        value={city}
        placeholder="Enter city name"
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") getWeather();
        }}
      />

      {/* Buttons */}
      <div>
        <motion.button
          onClick={getWeather}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Search
        </motion.button>

        <button onClick={getMyLocation}>
          📍 My Location
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 0.8 }}
        >
          🌍 Fetching weather...
        </motion.p>
      )}

      {/* Error */}
      {error && (
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ color: "red" }}
        >
          {error}
        </motion.h3>
      )}

      {/* Weather Card */}
      {weather && weather.main && (
        <motion.div
          className="weather-box"
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
        >

          <h2>
            {weather.name}, {weather.sys.country}
          </h2>

          <motion.img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1.2 }}
          />

          <h3>{weather.main.temp} °C</h3>

          <p><b>Weather:</b> {weather.weather[0].description}</p>
          <p><b>Humidity:</b> {weather.main.humidity}%</p>
          <p><b>Feels Like:</b> {weather.main.feels_like} °C</p>
          <p><b>Wind Speed:</b> {weather.wind.speed} m/s</p>
          <p><b>Pressure:</b> {weather.main.pressure} hPa</p>
          <p><b>Min Temp:</b> {weather.main.temp_min} °C</p>
          <p><b>Max Temp:</b> {weather.main.temp_max} °C</p>

        </motion.div>
      )}

      {/* Forecast */}
      {forecast.length > 0 && (
        <div className="forecast">
          <h3>📊 Forecast</h3>

          {forecast.map((item, index) => (
            <p key={index}>
              {item.dt_txt} → {item.main.temp}°C → {item.weather[0].main}
            </p>
          ))}
        </div>
      )}

    </div>
  );
}

export default App;