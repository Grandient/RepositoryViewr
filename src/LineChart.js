import Chart from 'chart.js';
import * as scale from 'd3-scale';
import * as scaleChrome from 'd3-scale-chromatic';
import moment from 'moment';

export function createLineChart(chart){
    chart = new Chart(document.getElementById("canvas2"), {
      type: 'line',
      data: {
        labels: null,
        datasets: [
          {
            label: "Total Changes Per Day",
            backgroundColor: "white",
            data: null,
            fill: false
          }
        ]
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Number of Changes'
        }
      }
    });
    return chart;
}

export function clearLineChart(chart){
    chart.data.labels = []
    chart.data.datasets.forEach((dataset) => {
        dataset.data = [];
    });
    chart.update();
    return chart;
}
    
function compare(a,b){
    let A = moment(a.date).toDate();
    let B = moment(b.date).toDate();
    let comparison = 0;
    if (A > B){ comparison = 1};
    if (B > A){ comparison = -1};
    return comparison; 
}
    
export function updateLineChart(data, chart) {
    data = data.sort(compare);
    let normalizedData = {}
    data.forEach(function(commit) {
        if(normalizedData.hasOwnProperty(commit.date)){
            normalizedData[commit.date] += commit.stats.total;
        } else {
            normalizedData[commit.date] = commit.stats.total;
        }
    })
    let labels = [];
    let points = [];
    let colors = [];

    const dates = Object.keys(normalizedData)
    let max = 0;
    for (const date of dates) {
        if(max < normalizedData[date]){
            max = normalizedData[date];
        }
    }
    var cScale = scale.scaleSequential(scaleChrome.interpolateViridis).domain([0,max]); 

    for (const date of dates) {
        labels.push(date)
        points.push(normalizedData[date])
        colors.push(cScale(normalizedData[date]))
    }

    
    chart.data.datasets[0].backgroundColor = colors;
    chart.data.datasets[0].data = points;
    chart.data.labels = labels;
    chart.update();
    return chart;
}
  
    