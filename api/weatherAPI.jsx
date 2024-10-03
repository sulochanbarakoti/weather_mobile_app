import axios from "axios";

const api = "4d921d5e3f194a6fb7f143343240210";

const forcastEndpoint = (params) =>
  `http://api.weatherapi.com/v1/forecast.json?key=${api}&q=${params.city}&days=${params.days}&aqi=no&alerts=no`;
const locationEndPoint = (params) =>
  `http://api.weatherapi.com/v1/search.json?key=${api}&q=${params.city}`;

const fetchAPI = async (endpoint) => {
  const options = {
    method: "GET",
    url: endpoint,
  };
  try {
    const res = await axios.request(options);
    return res.data;
  } catch (error) {
    console.log("error", error);
    return null;
  }
};

export const fetchWeather = (params) => {
  return fetchAPI(forcastEndpoint(params));
};

export const fetchLocation = (params) => {
  return fetchAPI(locationEndPoint(params));
};
