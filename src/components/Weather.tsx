import React, { useEffect, useRef, useState } from "react";
import './Weather.css'
import search_icon from '../assets/search.png'
import clearsky_icon from '../assets/clear.png'
import humidity_icon from '../assets/humidity.png'
import wind_icon from '../assets/wind.png'


interface WeatherData {
    humidity: number;
    windSpeed: number;
    temperature: number;
    location: string;
    icon: string;
}


const Weather = () => {

    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [city, setCity] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const search = async (city: string) => {
        try {
            setErrorMessage("")

            if (city.trim() === '') {
                setErrorMessage("Please enter a valid city name");
                return;
            }
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.REACT_APP_APP_ID}`;
            const response = await fetch(url);
            const data = await response.json();
            if (response.ok) {
                setWeatherData({
                    humidity: data.main.humidity,
                    windSpeed: data.wind.speed,
                    temperature: Math.floor(data.main.temp),
                    location: data.name,
                    icon: "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"
                })
            }
            else {
                throw new Error(data.message || "failed to fetch weather data for ${city}")
            }
            console.log(weatherData)
        } catch (error: any) {
            console.log(error);
            setErrorMessage(error.message || "something went wrong Please try again Later");
        }
    }

    useEffect(() => {
        if (city.trim() !== '') {
            search(city)
        }
    }, [])

    return (
        <div className="weather">
            <div className="searchBar">
                <input
                    type="text"
                    id="cityName"
                    placeholder="Enter a city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <img src={search_icon} alt="search icon"
                    onClick={() => search(city)}
                />
            </div>
            {weatherData ? (<>
                <img src={weatherData?.icon} alt="weather-icon" className="weather-icon" />
                <p className="temperature">{weatherData?.temperature}°F</p>
                <p className="city">{weatherData?.location}</p>
                <div className="weather-data">
                    <div className="col">
                        <img src={humidity_icon} alt="humidity icon" />
                        <div>
                            <p>{weatherData?.humidity}%</p>
                            <span>Humidity</span>
                        </div>
                    </div>

                    <div className="col">
                        <img src={wind_icon} alt="wind icon" />
                        <div>
                            <p>{weatherData?.windSpeed}km/h</p>
                            <span>Wind Speed</span>
                        </div>
                    </div>
                </div>
            </>) : (
                <p className="placeholder-message">Enter a city to see weather details</p>
            )}
        </div>
    )
}

export default Weather;