const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const pug = require('pug');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const fetch = require('node-fetch');
const cors = require('cors')({ origin: true });
const dotenv = require('dotenv');

exports.weather = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        // Set the Access-Control-Allow-Origin header to allow access from the specified origin
        res.set('Access-Control-Allow-Origin', 'https://htmx-de42c.web.app');

        const location = req.body.location || "Missoula";

        const apiKey = dotenv.env['APIKEY'];

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=imperial`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            // console.log('Weather data:', data);

            const temp = data.main.temp;
            const humidity = data.main.humidity;
            const wndspeed = data.wind.speed;
            const place = data.name;

            const weatherInfo = formatWeatherData(temp, humidity, wndspeed, place);
            // console.log('Formatted weather info:', weatherInfo);

            res.status(200).send(weatherInfo);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            res.status(500).send('Error fetching weather data');
        }
    });
});

function formatWeatherData(temp, humidity, wndspeed, place) {
    return `
    <div style="background-color: #f0f0f0; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
        <h2 style="font-size: 24px; margin-bottom: 10px;">Current Weather Information for ${place}</h2>
        <div style="display: flex; justify-content: space-between;">
            <div style="display: flex; align-items: center;">
                <img src="https://static.thenounproject.com/png/1979336-200.png" alt="Temperature Icon" style="width: 30px; height: 30px; margin-right: 10px;">
                <p style="margin: 0;">Temperature: ${temp} °F</p>
            </div>
            <div style="display: flex; align-items: center;">
                <img src="https://cdn-icons-png.flaticon.com/512/219/219816.png" alt="Humidity Icon" style="width: 30px; height: 30px; margin-right: 10px;">
                <p style="margin: 0;">Humidity: ${humidity} %</p>
            </div>
            <div style="display: flex; align-items: center;">
                <img src="https://w7.pngwing.com/pngs/353/928/png-transparent-computer-icons-wind-symbol-wind-angle-text-logo.png" alt="Wind Speed Icon" style="width: 30px; height: 30px; margin-right: 10px;">
                <p style="margin: 0;">Wind Speed: ${wndspeed} mph</p>
            </div>
        </div>
    </div>
    `;
}

