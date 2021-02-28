import { gameData } from './questions.js';
import { map, moveMap } from './map.js';
import { drawChart, updatePieChart, updateLineChart } from './charts.js';

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

window.addEventListener('load', () => {
    map();
})

const data = gameData.countries;

const playButton = document.querySelector('button');
playButton.addEventListener('click', () => {
    play();
})

const random = (array) => Math.floor(Math.random() * array.length);

/** @type {Array} */
/** Guarda los datos de cada partida. */
let game = [];
const nQuestions = 5;

let gameNumber = 0;
let setIntervalId;
function play() {
    cleanGameSection();
    timer();

    setIntervalId = setInterval(timer, 1000);

    playButton.disabled = true;

    game = getQuestions();
    cities();
    countries();

    let contCorrect = 1;
    $('.city').draggable({
        cursor: 'grabbing',
        cursorAt: { bottom: 0 },
        containment: '#game',
        revert: 'invalid'
    });
    $('.country').droppable({
        drop: function (event, ui) {
            $(this)
                .addClass("ui-state-highlight correct")

            $(ui.draggable[0]).draggable('option', 'disabled', true);

            moveMap(ui.draggable[0]);

            updatePieChart($(this)[0]);

            // Mejor utilizar las clases??
            if (contCorrect == nQuestions) {
                const time = seconds - 1;
                updateLineChart(++gameNumber, time);
                endGame();
            }
            contCorrect++;            
        },
        accept: function(event) {
            const countryDataCode = $(this)[0].dataset.code;
            const cityDataCode = event[0].dataset.code;
            if (countryDataCode === cityDataCode) {
                return true;
            } else {
                return false;
            }
        }
    })
}

function cleanGameSection() {
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
function timer() {
    const span = document.querySelector('#time');
    span.removeChild(span.firstChild);
    const text = document.createTextNode(seconds++);
    span.appendChild(text);
}

function getQuestions() {
    const questions = []
    let cont = 0;
    while (cont < nQuestions) {
        const question = data[random(data)];
        if (!questions.includes(question)) {
            questions.push(question);
            cont++;
        }
    }
    return questions;
}

function cloneTemplate(array, id) {
    const template = document.querySelector(`#${id}-template`);

    const div = template.content.querySelector('div:first-child');

    const titleElement = template.content.querySelector('h3');

    const clones = []
    array.forEach(item => {
        (id === 'cities') ? div.setAttribute('data-code', item[1]) : div.setAttribute('data-code', item.code);
        (id === 'cities') ? titleElement.textContent = item[0].name : titleElement.textContent = item.name;
        const clone = document.importNode(template.content, true);
        clones.push(clone)
    });
    return clones;
}

function showMessyClones(array, id) {
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

function cities() {
    const cities = game.map(question => [question.cities[random(question.cities)], question.code]);
    const clones = cloneTemplate(cities, 'cities');
    showMessyClones(clones, 'cities');
}

function countries() {
    const clones = cloneTemplate(game, 'countries');
    showMessyClones(clones, 'countries');
}

function endGame() {
    playButton.disabled = false;
    clearInterval(setIntervalId);
    seconds = 0;
}

