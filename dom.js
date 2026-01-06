import { requestAPI } from "./api.js";

function weatherDom(key) {
    let weatherObj;
    let measurement;
    let fahrenheitObj;
    let celsiusObj;
    let celsiusDefault = true;
    const keyVar = key;
    const screenContainer = document.querySelector(".screen-container");
    const form = document.querySelector("form");
    const celBtn = document.querySelector(".celsius-btn");
    const fahBtn = document.querySelector(".fahrenheit-btn");
    // const searchInputField = document.querySelector(".search-input"); // same thing as searchInputValue

    getMeasurementColor();

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const searchInputValue = e.target.elements["search-input"].value;
        let city = searchInputValue;

        getWeather(city, keyVar);
    });

    celBtn.addEventListener("click", () => {
        celsiusDefault = true;
        measurement = "C";
        weatherObj = { ...celsiusObj };
        getMeasurementColor();
        cleanDom();
        buildHero();
        buildWeatherConditions();
        buildWeatherWeek();
    });

    fahBtn.addEventListener("click", () => {
        celsiusDefault = false;
        measurement = "F";
        weatherObj = { ...fahrenheitObj };
        getMeasurementColor();
        cleanDom();
        buildHero();
        buildWeatherConditions();
        buildWeatherWeek();
    });

    async function getWeather(city, key) {
        try {
            weatherObj = await requestAPI(city, key);
            console.log(weatherObj);
            fahrenheitObj = { ...weatherObj };
            celsiusObj = toCelsius(weatherObj);
            weatherObj = { ...celsiusObj };
            measurement = "C";

            cleanDom();
            buildHero();
            buildWeatherConditions();
            buildWeatherWeek();
        } catch (error) {
            console.error(error);
        }
    }

    function cleanDom() {
        const queryHeroContainer = document.querySelector(".hero-container");
        const queryConditionContainer = document.querySelector(
            ".condition-container"
        );
        const queryWeatherWeekContainer = document.querySelector(
            ".weather-week-container"
        );

        if (
            queryHeroContainer ||
            queryConditionContainer ||
            queryWeatherWeekContainer
        ) {
            queryHeroContainer.remove();
            queryConditionContainer.remove();
            queryWeatherWeekContainer.remove();
        }
    }

    function capitalizeEachWord(str) {
        const words = str.split(" ");
        const capitalizedWords = words.map((word) => {
            if (word.length === 0) return "";
            const firstLetter = word.charAt(0).toUpperCase();
            const restOfWord = word.slice(1).toLowerCase();

            return firstLetter + restOfWord;
        });
        return capitalizedWords.join(" ");
    }

    function toCelsius(weatherObj) {
        weatherObj.temp = Math.round((weatherObj.temp - 32) / 1.8);
        weatherObj.feelslike = Math.round((weatherObj.feelslike - 32) / 1.8);

        weatherObj.upcoming = weatherObj.upcoming.map((day) => ({
            ...day,
            temp: Math.round((day.temp - 32) / 1.8),
        }));

        return weatherObj; //
    }

    function normalizeIcon(iconString) {
        if (iconString.includes("cloudy")) {
            return "cloudy";
        }
        if (iconString.includes("rain")) {
            return "rain";
        }
        if (iconString.includes("clear")) {
            return "clear";
        }
        console.warn(`Unknown icon type encountered: ${iconString}`);
        return "default";
    }

    function getMeasurementColor() {
        if (celsiusDefault) {
            celBtn.style.backgroundColor = "#252525ff";
            celBtn.style.color = "#ffffffff";
            fahBtn.style.backgroundColor = "#ffffffff";
            fahBtn.style.color = "#252525ff";
        } else if (!celsiusDefault) {
            fahBtn.style.backgroundColor = "#252525ff";
            fahBtn.style.color = "#ffffffff";
            celBtn.style.backgroundColor = "#ffffffff";
            celBtn.style.color = "#252525ff";
        }
    }

    function buildHero() {
        const heroContainer = document.createElement("div");
        const cityHero = document.createElement("h2");
        const tempHero = document.createElement("h1");
        const conditionHeroDiv = document.createElement("div");
        const conditionHeroText = document.createElement("h3");
        const conditionHeroImg = document.createElement("img");

        heroContainer.classList.add("hero-container");
        cityHero.classList.add("city-hero");
        tempHero.classList.add("temp-hero");
        conditionHeroDiv.classList.add("condition-hero-div");
        conditionHeroText.classList.add("condition-hero-text");
        conditionHeroImg.classList.add("condition-hero-img");

        cityHero.textContent = `📌 ${capitalizeEachWord(weatherObj.cityName)}`;
        tempHero.textContent = `${weatherObj.temp}°${measurement}`;
        conditionHeroText.textContent = weatherObj.conditions;
        conditionHeroImg.src = `./asset/${normalizeIcon(weatherObj.icon)}.png`;

        conditionHeroDiv.append(conditionHeroText, conditionHeroImg);
        heroContainer.append(cityHero, tempHero, conditionHeroDiv);
        screenContainer.append(heroContainer);
    }

    function buildWeatherConditions() {
        const conditionContainer = document.createElement("div");
        conditionContainer.classList.add("condition-container");

        const humidityDiv = document.createElement("div");
        const feelslikeDiv = document.createElement("div");
        const precipDiv = document.createElement("div");

        const descText = document.createElement("p");
        descText.textContent = `${weatherObj.desc}`;
        const humidityText = document.createElement("p");
        humidityText.textContent = "Humidity";
        const feelslikeText = document.createElement("p");
        feelslikeText.textContent = "Feels like";
        const precipText = document.createElement("p");
        precipText.textContent = "Precipitation";

        const humidityValue = document.createElement("p");
        humidityValue.textContent = `${weatherObj.humidity}%`;
        const feelslikeValue = document.createElement("p");
        feelslikeValue.textContent = `${weatherObj.feelslike}°${measurement}`;
        const precipValue = document.createElement("p");
        precipValue.textContent = `${weatherObj.precipprob}%`;

        conditionContainer.append(
            descText,
            humidityDiv,
            feelslikeDiv,
            precipDiv
        );
        humidityDiv.append(humidityText, humidityValue);
        feelslikeDiv.append(feelslikeText, feelslikeValue);
        precipDiv.append(precipText, precipValue);
        screenContainer.append(conditionContainer);
    }

    function buildWeatherWeek() {
        const daysArray = weatherObj.upcoming;

        const weatherWeekContainer = document.createElement("div");
        weatherWeekContainer.classList.add("weather-week-container");

        for (const dayWeather of daysArray) {
            console.log("Current dayWeather iteration: " + dayWeather);

            const dayCard = document.createElement("div");
            const dayDate = document.createElement("h4");
            const dayIconImg = document.createElement("img");
            const dayIconText = document.createElement("h4");
            const dayTemp = document.createElement("h4");

            dayDate.textContent = `${dayWeather.date}`;
            dayIconImg.src = `./asset/${normalizeIcon(dayWeather.icon)}.png`;
            dayIconText.textContent = `${capitalizeEachWord(
                dayWeather.condition
            )}`;
            dayTemp.textContent = `${dayWeather.temp}°${measurement}`;

            dayCard.append(dayDate, dayIconImg, dayIconText, dayTemp);
            weatherWeekContainer.append(dayCard);
        }
        screenContainer.append(weatherWeekContainer);
    }
}

export { weatherDom };
