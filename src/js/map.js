import { gameData } from './questions.js';

/** Información para la localización inicial del mapa. */
/** @type {String} */
const schoolName = 'CIFP César Manrique';
/** @type {Array} */
const schoolLocation = [28.456099086100803, -16.283138740418725];

/** Inicializa el mapa de Leaflet
 * y establece su localización.
*/
const mymap = L.map('map-section').setView(schoolLocation, 15);
// Añade la capa, el mapa a mostrar, usando OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    minZoom: 1,
    maxZoom: 18,
    id: 'leaflet-osm'
}).addTo(mymap);

/** Añade un marcador. */
let marker = L.marker(schoolLocation).addTo(mymap)
    .bindPopup(schoolName)
    .openPopup();

/**
 * @description Cambia la posición del mapa con un efecto vuelo.
 * Elimina la marca anterior y añade otra.
 * @author Florencia Del Castillo Fleitas
 * @param {String} [name=schoolName]
 * @param {Array} [location=schoolLocation]
 */
function map (name = schoolName, location = schoolLocation) {
    mymap.flyTo(location, 15);
    marker.remove();
    marker = L.marker(location).addTo(mymap)
        .bindPopup(name)
        .openPopup();
}

/**
 * @description Obtiene las coordenadas de una ciudad.
 * @author Florencia Del Castillo Fleitas
 * @param {String} countryCode
 * @param {String} cityName
 * @return {Array} Coordenadas.
 */
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

/**
 * @description Actualiza el mapa cuando se ha relacionado
 * una ciudad con el país que le corresponde.
 * @author Florencia Del Castillo Fleitas
 * @param {HTMLDivElement} cityElement
 */
function moveMap (cityElement) {
    const countryCode = cityElement.dataset.code;
    const cityName = cityElement.firstElementChild.textContent;
    const location = getCityLocation(countryCode, cityName);
    map(cityName, location[0][0]);
}

export {
    map,
    moveMap
}
;
