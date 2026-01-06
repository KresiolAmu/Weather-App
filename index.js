import { requestAPI } from "./api.js";
import { weatherDom } from "./dom.js";

// const city = "Manila";
const key = "V962T4PPHY878H7J2JSJTEUTN";

// requestAPI(city, key).then((data) => console.log(data));

weatherDom(key);
