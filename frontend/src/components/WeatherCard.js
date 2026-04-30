function WeatherCard({ weather, getWeatherIcon }) {
  return (
    <div className="card">

      <h2>
        {getWeatherIcon(weather.description)} {weather.city}
      </h2>

      <h1>{weather.temperature}°C</h1>

      <p>{weather.description}</p>

    </div>
  );
}

export default WeatherCard;