import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

import SearchBox from "./components/SearchBox";
import WeatherCard from "./components/WeatherCard";

function App() {

  //  STATES 
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recent, setRecent] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  //  LOAD RECENT 
  useEffect(() => {
    const saved = localStorage.getItem("recent");
    if (saved) setRecent(JSON.parse(saved));
  }, []);

  // GET WEATHER 
  const getWeather = async (selectedCity) => {
    const queryCity = selectedCity || city;

    if (!queryCity) return;

    setLoading(true);
    setError("");
    setWeather(null);
    setSuggestions([]);

    try {
      const res = await
        axios.get(`https://weather-project-1-izts.onrender.com/api/weather/?city=${queryCity}`
      );

      if (res.data.error) {
        setError("⚠️ Please enter a valid city name");
      } else {
        setWeather(res.data);

        const updated = [
          queryCity,
          ...recent.filter((c) => c !== queryCity),
        ].slice(0, 5);

        setRecent(updated);
        localStorage.setItem("recent", JSON.stringify(updated));
      }

    } catch (err) {
      setError("❌ Server error 😢");
    }

    setLoading(false);
  };

  //  ENTER KEY 
  const handleKeyPress = (e) => {
    if (e.key === "Enter") getWeather();
  };

  //  SUGGESTIONS 
  const getSuggestions = async (value) => {
    setCity(value);

    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=df42d33cd8cb26bee9c2f3ed178722ef`
      );

      setSuggestions(res.data);
    } catch {
      setSuggestions([]);
    }
  };

  //  ICON 
  const getWeatherIcon = (desc) => {
    if (!desc) return "🌤️";

    desc = desc.toLowerCase();

    if (desc.includes("cloud")) return "☁️";
    if (desc.includes("rain")) return "🌧️";
    if (desc.includes("clear")) return "☀️";
    if (desc.includes("snow")) return "❄️";

    return "🌤️";
  };

  const desc = weather?.description?.toLowerCase() || "";

  return (
    <div className={darkMode ? "app dark" : "app"}>

      {/*  WEATHER ANIMATIONS */}

      {/* 🌧️ Rain */}
      {desc.includes("rain") && (
        <div className="rain"></div>
      )}

      {/* ☀️ Sun */}
      {desc.includes("clear") && (
        <div className="sun">☀️</div>
      )}


      {/*  NAVBAR  */}
      <div className="navbar">
        <h2>🌤️ Weather App</h2>

        <button className="darkBtn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>

      {/*  MAIN */}
      <div className="container">

        <SearchBox
          city={city}
          setCity={setCity}
          getWeather={getWeather}
          handleKeyPress={handleKeyPress}
          suggestions={suggestions}
          setSuggestions={setSuggestions}
          getSuggestions={getSuggestions}
        />

        {loading && <p className="loading">Loading...</p>}
        {error && <p className="error">{error}</p>}
        {weather && (
          <WeatherCard
            weather={weather}
            getWeatherIcon={getWeatherIcon}
          />
        )}


        {/*  RECENT  */}
 {recent.length > 0 && (
  <div className="recent">

    <h3 className="recentTitle">Recent Searches</h3>

    <div className="recentTop">
      
      {/* chips */}
      <div className="recentList">
        {recent.map((c, i) => (
          <div
            key={i}
            className={`chip ${i === 0 ? "activeChip" : ""}`}
          >
            <span onClick={() => getWeather(c)}>
              {c}
            </span>

            <button
              className="deleteBtn"
              onClick={() => {
                const updated = recent.filter((item) => item !== c);
                setRecent(updated);
                localStorage.setItem("recent", JSON.stringify(updated));
              }}
            >
              ✖
            </button>
          </div>
        ))}
      </div>


      {/* clear button */}
      <button
        className="clearBtn"
        onClick={() => {
          setRecent([]);
          localStorage.removeItem("recent");
        }}
      >
        Clear All
      </button>

    </div>

  </div>
)}
      </div>


      {/*  FOOTER  */}
      <div className="footer">
        © 2026 Weather App
      </div>

    </div>
  );
}

export default App;