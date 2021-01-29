import { gameData } from './questions.js';

const data = gameData.countries;

const random = (array) => Math.floor(Math.random() * array.length);

/** @type {*} */
/** Guarda los datos de cada partida. */
let game = [];
const nQuestions = 5;

play();
function play() {
    game = getQuestions();
    getCountries();
    getCities();
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

function getCountries() {
    const countries = game.map(question => question.name);
}

function getCities() {
    const cities = game.map(question => question.cities[random(question.cities)]);
}

$('.city').draggable();
$('.country').droppable({
    drop: () => {
        alert('Hi!')
    },
    accept: '.city' /** Indicará que ciudad es
    aceptada en el país. Cambiar a selector único. */

})