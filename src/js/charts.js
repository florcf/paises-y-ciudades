import { gameData } from './questions.js';

let pieChartData;
let pieChartOptions;
let pieChart;

let lineChartData;
let lineChartOptions;
let lineChart;

// Load the Visualization API and the corechart package.
google.charts.load('current', { packages: ['corechart'] });

/**
 * @description Callback that creates and populates a data table,
 * instantiates the pie chart, passes in the data and
 * draws it.
 * @author Florencia Del Castillo Fleitas
 */
function drawChart () {
    /**
     * Pie Chart
     */

    // Create the data table.
    pieChartData = new google.visualization.DataTable();
    pieChartData.addColumn('string', 'Country');
    pieChartData.addColumn('number', 'Relations');
    // Set chart options
    pieChartOptions = {
        title: 'Ocurrencias De Países',
        titleTextStyle: {
            color: '#007965'
        },
        width: 400,
        height: 300
    };
    // Instantiate and draw our chart, passing in some options.
    pieChart = new google.visualization.PieChart(document.getElementById('pie-chart'));
    pieChart.draw(pieChartData, pieChartOptions);

    /**
     * Line Chart
     */

    // Create the data table.
    lineChartData = new google.visualization.DataTable();
    lineChartData.addColumn('number', 'Intentos');
    lineChartData.addColumn('number', 'Tiempos');
    // Set chart options
    lineChartOptions = {
        title: 'Tiempos Por Partida',
        curveType: 'function',
        legend: { position: 'rigth' },
        vAxes: {
            0: { title: 'Tiempo' }
        },
        hAxes: {
            0: { title: 'Intentos' }
        },
        width: 800,
        height: 300
    };
    // Instantiate and draw our chart, passing in some options.
    lineChart = new google.visualization.LineChart(document.getElementById('line-chart'));
    lineChart.draw(lineChartData, lineChartOptions);
}

/**
 * @description Actualiza el gráfico circular.
 * Se obtiene el nombre del país con el código del elemento que recibe.
 * Si el país no se muestra todavía en el gráfico, se añade y se indica que es la primera vez.
 * Si el país ya estaba en el gráfico, se obtiene para actualizar el número de veces sumándole uno.
 * @author Florencia Del Castillo Fleitas
 * @param {HTMLDivElement} element
 */
function updatePieChart (element) {
    const countryCode = element.dataset.code;
    const countryName = gameData.countries.filter(country => country.code === countryCode).map(country => country.name)[0];

    const chartCountryValues = pieChartData.getDistinctValues(0);
    if (!chartCountryValues.includes(countryName)) {
        pieChartData.addRow([countryName, 1]);
    } else {
        const rowIndex = pieChartData.getFilteredRows([{
            column: 0,
            value: countryName
        }])[0];
        const relationsCellValue = pieChartData.getValue(rowIndex, 1);
        pieChartData.setValue(rowIndex, 1, relationsCellValue + 1);
    }

    pieChart.draw(pieChartData, pieChartOptions);
}

/**
 * @description Actualiza el gráfico de líneas.
 * Simplemente se añade una nueva fila con el número de la partida
 * y el tiempo transcurrido.
 * @author Florencia Del Castillo Fleitas
 * @param {*} game
 * @param {*} time
 */
function updateLineChart (game, time) {
    lineChartData.addRows([
        [game, time]
    ]);
    lineChart.draw(lineChartData, lineChartOptions);
}

export {
    drawChart,
    updatePieChart,
    updateLineChart
}
;
