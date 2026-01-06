// const API_KEY = "V962T4PPHY878H7J2JSJTEUTN";

// This module is strictly for requesting, cleaning, and processing data before using

import {
    format,
    parseISO,
} from "https://cdn.jsdelivr.net/npm/date-fns@3.6.0/+esm";

function requestAPI(city = "Manila", key) {
    // practicing .then and .catch
    if (!key) return alert("You don't have a key!");

    return fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${key}`
    )
        .then((response) => {
            if (!response.ok)
                throw new Error(
                    `Response is not OK: ${response.status} ${response.statusText}`
                );
            return response.json();
        })
        .then((data) => {
            console.log(data);
            return processWeatherData(data); // processWeatherData(data) || console.log(data)
        })
        .catch((error) => {
            alert("You must enter a valid location");
        });
}

function processWeatherData(data) {
    const weatherObj = {
        cityName: data.address,
        icon: data.currentConditions.icon,
        temp: Math.round(data.currentConditions.temp),
        feelslike: Math.round(data.currentConditions.feelslike),
        desc: data.description,
        conditions: data.currentConditions.conditions,
        humidity: Math.round(data.currentConditions.humidity),
        precipprob: data.currentConditions.precipprob,
        upcoming: getWeekData(data.days),
    };

    function getWeekData(arrayDays) {
        const arrayUpcoming = [];
        for (let i = 1; i <= 7; i++) {
            const day = {
                date: format(parseISO(arrayDays[i].datetime), "MMM. dd (EEE)"),
                icon: arrayDays[i].icon,
                condition: arrayDays[i].conditions,
                temp: Math.round(arrayDays[i].temp),
            };

            arrayUpcoming.push(day);
        }

        return arrayUpcoming;
    }

    return weatherObj;
}

export { requestAPI };
