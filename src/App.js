import "./App.css";
import { usePosition } from "use-position";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const { latitude, longitude } = usePosition();
  const [weather, setWeather] = useState();
  const [search, setSearch] = useState();
  const [error, setError] = useState();

  const searchHandler = (event) => {
    setSearch(event.target.value);
  };

  const getWeatherData = async (lat, lon) => {
    const key = process.env.REACT_APP_WEATHER_DATA;
    let url;
    if (search) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${key}&lang=tr`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&lang=tr`;
    }
    try {
      const { data } = await axios.get(url);
      setWeather(data);
    } catch (error) {
      let { response } = error;
      setError(response);
      if (weather) {
        setWeather(null);
      }
    }
  };

  const currentDate = () => {
    const today = new Date();
    let dateFormat = today.toLocaleDateString("tr-TR", {
      day: "numeric",
      year: "numeric",
      weekday: "short",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
    return dateFormat;
  };

  useEffect(() => {
    document.title = "Hava Durumu | Serdar Göleli ";
    latitude && longitude && getWeatherData(latitude, longitude);
  }, [latitude, longitude]);

  return (
    <div className="App">
      <div className="search-box">
        <input type="text" placeholder="Kıta, Ülke, Şehir, İlçe bilgisi " onChange={searchHandler} />
        <button onClick={getWeatherData}> Ara </button>
      </div>
      <div className="card">
        {weather ? (
          <div>
            <p className="date">{currentDate()}</p>
            <h1 className="city"> {weather.name} </h1>
            <div className="cart-title">
              <span> {Math.ceil(weather.main.temp - 273.15)}&#176; </span>
              {weather.weather.map((c) => (
                <img key={c.id} src={`http://openweathermap.org/img/wn/${c.icon}@2x.png`} alt="" />
              ))}
            </div>
            <span className="feeld-like">Hissedilen: {Math.ceil(weather.main.feels_like - 273.15)}&#176; </span>
            <h2 className="weather-description"> {weather.weather.map((c) => c.description)} </h2>
            <table>
              <thead>
                <tr>
                  <th>Hız</th>
                  <th>Yön</th>
                  <th>Rüzgar</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td> {weather.wind.speed ? weather.wind.speed : "-"} </td>
                  <td> {weather.wind.deg ? weather.wind.deg : "-"} </td>
                  <td> {weather.wind.gust ? weather.wind.gust : "-"} </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="error-message">
            <span className="search-text">{search}</span>
            <span>{error ? error.data.message : ""}</span>
          </div>
        )}
      </div>
      <div className="social-media">
        <a href="https://github.com/serdargoleli/" target="_blank">
          ~ GitHub
        </a>
        <a href="https://www.linkedin.com/in/serdargoleli/" target="_blank">
          Linkedin ~
        </a>
      </div>
    </div>
  );
}

export default App;
