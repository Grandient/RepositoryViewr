import Chart from 'chart.js';
import * as scale from 'd3-scale';
import * as scaleChrome from 'd3-scale-chromatic';

export function createChart(chart){
    chart = new Chart(document.getElementById("canvas"), {
      type: 'bar',
      data: {
        labels: null,
        datasets: [
          {
            label: "Number of changes",
            backgroundColor: "#FFFFFF",
            data: null
          }
        ]
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: 'File Changes'
        }
      }
    });
    return chart;
  }

export function clearChart(chart){
  chart.data.labels = []
  chart.data.datasets.forEach((dataset) => {
      dataset.data = [];
  });
  chart.update();
  return chart;
}
  
  
export function updateChart(data, chart) {
  let max = 0;
  data.forEach((file) => {
    if(file.changes > max) max = file.changes;
  })
  
  console.log(max);
  var cScale = scale.scaleSequential(scaleChrome.interpolateViridis).domain([0,max]); 
  data.sort(function(a,b) {
    return b.changes - a.changes;
  });
  
  let labels = [];
  let points = [];
  let colors = [];
  
  data.forEach(function(file) {
    if(file.name.length > 20){
      labels.push(file.name.slice(file.name.length-20,file.name.length))
    } else {
      labels.push(file.name)
    }
    points.push(file.changes)
    colors.push(cScale(file.changes))
  })
  chart.data.datasets[0].backgroundColor = colors;
  chart.data.datasets[0].data = points;
  chart.data.labels = labels;
  chart.update();
  return chart;
}

  
  