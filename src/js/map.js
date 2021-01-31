import { gameData } from './questions.js';

const schoolName = 'CIFP César Manrique';
const schoolLocation = [28.456099086100803, -16.283138740418725];

const mymap = L.map('map-section').setView(schoolLocation, 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    minZoom: 1,
    maxZoom: 18,
    id: 'leaflet-osm'
}).addTo(mymap);

let marker = L.marker(schoolLocation).addTo(mymap)
.bindPopup(schoolName)
.openPopup();

function map(name = schoolName, location = schoolLocation) {
    mymap.flyTo(location, 15);
    marker.remove();
    marker = L.marker(location).addTo(mymap)
        .bindPopup(name)
        .openPopup();
}

const getCityLocation = (countryCode, cityName) => {
    return gameData.countries.filter(country => {
        return country.code === countryCode;
    }).map(country => {
        return country.cities.filter(city => {
            return city.name === cityName;
        }).map(city => {
            return city.location;
        });
    });
};

function moveMap(cityElement) {
    const countryCode = cityElement.dataset.code;
    const cityName = cityElement.firstElementChild.textContent;
    const location = getCityLocation(countryCode, cityName);
    map(cityName, location[0][0]);
}

export {
    map,
    moveMap
}