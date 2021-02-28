import { gameData } from './questions.js';

var pieChartData;
var pieChartOptions;
var pieChart;

var lineChartData;
var lineChartOptions;
var lineChart;

// Load the Visualization API and the corechart package.
google.charts.load('current', { 'packages': ['corechart'] });

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {

    // Create the data table.
    pieChartData = new google.visualization.DataTable();
    pieChartData.addColumn('string', 'Country');
    pieChartData.addColumn('number', 'Relations');

    // Set chart options
    pieChartOptions = {
        'title': 'Ocurrencias De Países',
        'titleTextStyle': {
            color: 'blue'
        },
        'width': 400,
        'height': 300
    };

    // Instantiate and draw our chart, passing in some options.
    pieChart = new google.visualization.PieChart(document.getElementById('pie-chart'));

    pieChart.draw(pieChartData, pieChartOptions);


    lineChartData = new google.visualization.DataTable();
    lineChartData.addColumn('number', 'Intentos');
    lineChartData.addColumn('number', 'Tiempos');

    lineChartOptions = {
        title: 'Tiempos Por Partida',
        curveType: 'function',
        legend: { position: 'rigth' },
        vAxes: {
            0: { title: 'Tiempo' }
        },
        hAxes: {
            0: { title: 'Intentos' }
        }
    };

    lineChart = new google.visualization.LineChart(document.getElementById('line-chart'));

    lineChart.draw(lineChartData, lineChartOptions);
}

function updatePieChart(element) {
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
        let relationsCellValue = pieChartData.getValue(rowIndex, 1);
        pieChartData.setValue(rowIndex, 1, relationsCellValue + 1);
    }

    pieChart.draw(pieChartData, pieChartOptions)
}

function updateLineChart(game, time) {
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