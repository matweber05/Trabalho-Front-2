require('dotenv').config();
const express = require("express");
const axios = require('axios');
const cors = require('cors');
const app = express();
const https = require("https");

const openWeatherApiKey = process.env.OPENWEATHER_API_KEY;
app.use(express.json());
app.use(cors());

app.post('/', (req, res) => {
  const { city } = req.body;
  const openWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherApiKey}&units=metric&lang=pt_br`;
  https.get(openWeatherUrl, (response) => {
    console.log(response.statusCode);
    response.on("data", async (data) => {
      try {
        const { city_name, temperature, max_temp, min_temp, lat, lon, feels_like, description } = await getWeatherData(data);
        res.send(
            [
                {
                  name: city_name,
                  temperature: temperature,
                  max: max_temp,
                  min: min_temp,
                  feels_like: feels_like,
                  lat: lat,
                  lon: lon,
                  description: description,
                }
                ]
        ).end();
      } catch (e) {
        res.send(`Error while getting OpenWeather data error code: ${e} Status code: ${response.statusCode}`).end();
      }
    });
  });
});

const getWeatherData = async (data) => {
  const weatherData = JSON.parse(data);
  const city_name = weatherData.name;
  const temperature = weatherData.main.temp;
  const max_temp = weatherData.main.temp_max;
  const min_temp = weatherData.main.temp_min;
  const lat = weatherData.coord.lat;
  const lon = weatherData.coord.lon;
  const feels_like = weatherData.main.feels_like;
  const description = weatherData.weather[0].description;
  return {
    city_name,
    temperature,
    max_temp,
    min_temp,
    lat,
    lon,
    feels_like,
    description
  };
};

const searchWeather = async () => {
  const response = await axios.post("http://localhost:3000", { city: "são paulo" });
  console.log(response.data[0]);
}


app.listen(3000, () => {
  console.log('App listening on port 3000!');
  searchWeather();
});