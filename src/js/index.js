import { gameData } from './questions.js';

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

function play() {
    cleanGameSection();
    game = getQuestions();
    cities();
    countries();
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
    console.log(div)

    const titleElement = template.content.querySelector('h3');

    const clones = []
    array.forEach(item => {
        (id === 'cities') ? div.setAttribute('data-code', item.cityCode) : div.setAttribute('data-code', item.code);
        titleElement.textContent = item.name;
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
    const cities = game.map(question => question.cities[random(question.cities)]);    
    const clones = cloneTemplate(cities, 'cities');
    showMessyClones(clones, 'cities');
}

function countries() {
    const clones = cloneTemplate(game, 'countries');
    showMessyClones(clones, 'countries');
}

$('.city').draggable();
$('.country').droppable({
    drop: () => {
        alert('Hi!')
    },
    accept: '.city' /** Indicará que ciudad es
    aceptada en el país. Cambiar a selector único. */

})