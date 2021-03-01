import { gameData } from './questions.js';
import { map, moveMap } from './map.js';
import { drawChart, updatePieChart, updateLineChart } from './charts.js';

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

window.addEventListener('load', () => {
    map();
    // Deshabilita el botón de 'Nueva Partida'
    // para que no se pueda iniciar sin seleccionar nivel.
    playButton.disabled = true;
});

/** @type {Array} */
/** Información de cada país. */
const data = gameData.countries;

const playButton = document.querySelector('button');
playButton.addEventListener('click', () => {
    play();
});

/**
 * @description Genera un número aleatorio según
 * la longitud del array que se le pase.
 * @author Florencia Del Castillo Fleitas
 * @param {Array} array
 */
const random = (array) => Math.floor(Math.random() * array.length);

const levelSelect = document.querySelector('#level');
levelSelect.addEventListener('change', () => {
    /* Se habilita o deshabilita el botón de
     * 'Nueva Partida' si se ha seleccionado
     * un nivel o no. */
    if (levelSelect.value !== 'select') {
        playButton.disabled = false;
    } else {
        playButton.disabled = true;
    }
});

/**
 * @description Nivel de dificultad seleccionado
 * por el usuario.
 * @author Florencia Del Castillo Fleitas
 */
const level = () => levelSelect.value;

/** @type {Array} */
/** Guarda los datos de cada partida. */
let game = [];
/** Número de preguntas en la partida. */
const nQuestions = () => {
    if (level() === 'easy') { return 3; }
    if (level() === 'normal') { return 5; }
    if (level() === 'difficult') { return 7; }
};

/** Número de partida. */
let gameNumber = 0;
let setIntervalId;
/**
 * @description Ejecuta todas las funciones necesarias
 * para jugar.
 * @author Florencia Del Castillo Fleitas
 */
function play () {
    cleanGameSection();
    timer();

    setIntervalId = setInterval(timer, 1000);

    // Deshabilita el botón de 'Nueva Partida'
    playButton.disabled = true;
    // Deshabilita el select de nivel.
    levelSelect.disabled = true;

    // Preguntas para cada partida.
    game = getQuestions();
    cities();
    countries();

    let contCorrect = 1;
    /** Establece a los elementos con la clase
     * 'city' como draggables.
     */
    $('.city').draggable({
        cursor: 'grabbing',
        cursorAt: { bottom: 0 },
        containment: '#game',
        revert: 'invalid'
    });
    /** Establece a los elementos con la clase
     * 'country' como droppables.
     */
    $('.country').droppable({
        drop: function (event, ui) {
            // Añade una clase CSS al elemento contenedor
            // de la respuesta.
            $(this)
                .children('.answer')
                .addClass('ui-state-highlight correct-answer');

            // El elemento '.city' deja de ser draggable.
            $(ui.draggable[0]).draggable('option', 'disabled', true);

            // Se actualiza el mapa.
            moveMap(ui.draggable[0]);
            // Se actualiza el gráfico circular.
            updatePieChart($(this)[0]);

            // Mejor utilizar las clases??
            // Si todas las respuestas son correctas...
            if (contCorrect === nQuestions()) {
                const time = seconds - 1;
                // Se actualiza el gráfico de líneas.
                updateLineChart(++gameNumber, time);
                // Vuelve a su estado inicial el botón
                // 'Nueva Partida' y el tiempo.
                endGame();
            }
            contCorrect++;
        },
        /** El elemento droppable '.country', solo
         * aceptará el elemento draggable '.city' que
         * tenga el código de país correcto.
         */
        accept: function (event) {
            const countryDataCode = $(this)[0].dataset.code;
            const cityDataCode = event[0].dataset.code;
            if (countryDataCode === cityDataCode) {
                return true;
            } else {
                return false;
            }
        }
    });
}

/**
 * @description Elimina los nodos en la sección del juego.
 * @author Florencia Del Castillo Fleitas
 */
function cleanGameSection () {
    const gameDivElements = [...document.querySelectorAll('#game > div')];
    gameDivElements.forEach(element => {
        if (element.hasChildNodes) {
            const children = [...element.children];
            children.forEach(child => {
                child.remove();
            });
        }
    });
}

let seconds = 1;
/**
 * @description Muestra el tiempo transcurrido en la
 * partida.
 * @author Florencia Del Castillo Fleitas
 */
function timer () {
    const span = document.querySelector('#time');
    span.removeChild(span.firstChild);
    const text = document.createTextNode(seconds++);
    span.appendChild(text);
}

/**
 * @description Genera un array de preguntas aleatorias.
 * @author Florencia Del Castillo Fleitas
 * @return {Array}
 */
function getQuestions () {
    const questions = [];
    let cont = 0;
    while (cont < nQuestions()) {
        const question = data[random(data)];
        if (!questions.includes(question)) {
            questions.push(question);
            cont++;
        }
    }
    return questions;
}

/**
 * @description Clonar los templates necesarios para
 * mostrar las ciudades y los países.
 * @author Florencia Del Castillo Fleitas
 * @param {Array} array
 * @param {String} id
 * @return {Array}
 */
function cloneTemplate (array, id) {
    const template = document.querySelector(`#${id}-template`);

    const div = template.content.querySelector('div:first-child');

    const titleElement = template.content.querySelector('h3');

    const clones = [];
    array.forEach(item => {
        (id === 'cities') ? div.setAttribute('data-code', item[1]) : div.setAttribute('data-code', item.code);
        (id === 'cities') ? titleElement.textContent = item[0].name : titleElement.textContent = item.name;
        const clone = document.importNode(template.content, true);
        clones.push(clone);
    });
    return clones;
}

/**
 * @description Muestra las ciudades y países
 * de forma desordenada.
 * @author Florencia Del Castillo Fleitas
 * @param {*} array
 * @param {*} id
 */
function showMessyClones (array, id) {
    const clones = array;
    const messyClones = [];
    while (messyClones.length < clones.length) {
        const clone = clones[random(clones)];
        if (!messyClones.includes(clone)) {
            messyClones.push(clone);
        }
    }
    const div = document.querySelector(`#${id}`);
    messyClones.forEach(clone => {
        div.appendChild(clone);
    });
}

/**
 * @description Se generan y se muestran los elementos
 * de las ciudades.
 * @author Florencia Del Castillo Fleitas
 */
function cities () {
    const cities = game.map(question => [question.cities[random(question.cities)], question.code]);
    const clones = cloneTemplate(cities, 'cities');
    showMessyClones(clones, 'cities');
}

/**
 * @description Se generan y muestran los elementos
 * de los países.
 * @author Florencia Del Castillo Fleitas
 */
function countries () {
    const clones = cloneTemplate(game, 'countries');
    showMessyClones(clones, 'countries');
}

/**
 * @description El botón de 'Nueva Partida', el
 * select para determinar el nivel del juego y
 * el tiempo vuelven a su estado inicial.
 * @author Florencia Del Castillo Fleitas
 */
function endGame () {
    playButton.disabled = false;
    levelSelect.disabled = false;
    clearInterval(setIntervalId);
    seconds = 0;
}
