import { gameData } from './questions.js';

var data;
var chart;
var options;

// Load the Visualization API and the corechart package.
google.charts.load('current', { 'packages': ['corechart'] });

// Set a callback to run when the Google Visualization API is loaded.
//google.charts.setOnLoadCallback(drawChart);


// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {

    // Create the data table.
    data = new google.visualization.DataTable();
    data.addColumn('string', 'Country');
    data.addColumn('number', 'Relations');

    // Set chart options
    options = {
        'title': 'Ocurrencias De Países',
        'titleTextStyle': {
            color: 'blue'
        },
        'width': 400,
        'height': 300
    };

    // Instantiate and draw our chart, passing in some options.
    chart = new google.visualization.PieChart(document.getElementById('pie-chart'));

    //google.visualization.events.addListener(chart, 'ready', updatePieChart);

    chart.draw(data, options);
}

function updatePieChart(element) {
    const countryCode = element.dataset.code;
    const countryName = gameData.countries.filter(country => country.code === countryCode).map(country => country.name)[0];

    const chartCountryValues = data.getDistinctValues(0);
    if (!chartCountryValues.includes(countryName)) {
        data.addRow([countryName, 1]);
    } else {
        const rowIndex = data.getFilteredRows([{
            column: 0,
            value: countryName
        }])[0];
        console.log(rowIndex)
        let relationsCellValue = data.getValue(rowIndex, 1);
        console.log(relationsCellValue)
        data.setValue(rowIndex, 1, relationsCellValue + 1);
    }

    chart.draw(data, options)
}

export {
    drawChart,
    updatePieChart
}