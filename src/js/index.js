import { gameData } from './questions.js';
import { map } from './map.js';

window.addEventListener('load', () => {
    map();
})

const data = gameData.countries;



const playButton = document.querySelector('button');
playButton.addEventListener('click', () => {
    play();
})

const random = (array) => Math.floor(Math.random() * array.length);

/** @type {*} */
/** Guarda los datos de cada partida. */
let game = [];
const nQuestions = 5;

let setIntervalId;
function play() {
    cleanGameSection();

    setIntervalId = setInterval(timer, 1000);

    playButton.disabled = true;

    game = getQuestions();
    cities();
    countries();


    $('.city').draggable({
        cursor: 'grabbing',
        cursorAt: { bottom: 0 }
    });
    $('.country').droppable({
        drop: () => {
            alert('Hi!')
        },
        accept: '.city' /** Indicará que ciudad es
        aceptada en el país. Cambiar a selector único. */

    })
}

function endGame() {
    clearInterval(setIntervalId);
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

let seconds = 1;
function timer() {
    const span = document.querySelector('#time');
    span.removeChild(span.firstChild);
    const text = document.createTextNode(seconds++);
    span.appendChild(text);
}

