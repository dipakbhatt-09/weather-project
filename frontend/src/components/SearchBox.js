function SearchBox({
  city,
  setCity,
  getWeather,
  handleKeyPress,
  suggestions,
  setSuggestions,
  getSuggestions
}) {
  return (
    <div className="searchBox">

      <input
        className="input"
        placeholder="Enter city..."
        value={city}
        onChange={(e) => getSuggestions(e.target.value)}
        onKeyDown={handleKeyPress}
      />

      {suggestions.length > 0 && (
        <div className="suggestBox">
          {suggestions.map((s, i) => (
            <p
              key={i}
              onClick={() => {
                setCity(s.name);
                setSuggestions([]);
                getWeather(s.name);
              }}
            >
              {s.name}, {s.country}
            </p>
          ))}
        </div>
      )}

      <button className="btn" onClick={() => getWeather()}>
        Search
      </button>

    </div>
  );
}

export default SearchBox;