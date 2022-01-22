function destroyChart(){
  if (myChart){
    myChart.destroy()
  }
}
function doughnut(key_list,value_list) {
  value_list.push("0","0")
  $("race-chart").empty();
  var ctx = document.getElementById('race-chart');
  ctx.height = 300;
  myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['White ','Black ','Native ','Asian ', 'Pacific ','Other ', 'Hispanic ','Not Hispanic '],
      datasets: [{
        label: 'bars',
        weight:2,
        backgroundColor: [
          '#27A060',
          '#247BA0',
          '#85E2F7',
          '#F9A061',
          '#FFE066',
          '#E1766A',
          '#E26DBA',
          '#D8D9D3',
        ],
        labels: [
          'White',
          'Black',
          'Asian',
          'Native',
          'Pacific',
          'Other'
        ],
        data: value_list,
        datalabels: {
          anchor: 'end'
      },
    },
    {
      weight: 2
    },
    {
      label: 'name',
      weight:2,
      backgroundColor: [
        '#27A060',
        '#247BA0',
        '#85E2F7',
        '#F9A061',
        '#FFE066',
        '#E1766A',
        '#E26DBA',
        '#D8D9D3',
      ],
      labels: [
        'Hispanic',
        'Not Hispanic'
      ],
      data: [0,0,0,0,0,0, 40,60],
      datalabels: {
        anchor: 'end'
    },
    }]
    },
    options: {
      cutoutPercentage: 30,
      plugins: {
        datalabels: {
          backgroundColor: function(context) {
            return context.dataset.backgroundColor;
          },
          borderColor: 'white',
          borderRadius: 25,
          borderWidth: 2,
          color: 'white',
          display: function(context) {
            var dataset = context.dataset;
            var count = dataset.data.length;
            var value = dataset.data[context.dataIndex];
            var sum = value_list.reduce(function(prev, curr){
              return (Number(prev) || 0) + (Number(curr) || 0);
          });
            return value > 1.3*sum/100;
          },
          font: {
            weight: 'bold'
          },
          padding: 6,
          formatter: Math.round
        }
      },
      layout: {
        padding: {
          left: 20,
          right: 20,
          top: 0,
          bottom: 10
        }
      },
      elements: {
        arc: {
          borderWidth: 0
        }
      },
      "animation": {
        "duration": 0
      },
      legend: {
        display: false,
        labels:
        {
          boxWidth: 15
        },
        padding:5
      },
    }
  });

}
function linearPercentBarChart(key_list,value_list){
  value_list.push(0.16)
  value_list.push((Math.floor(Math.random() * 20)+20).toString())
   $("race-chart").empty();
  var ctx = document.getElementById('race-chart')
  ctx.height = 300;
  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['White','Black','Native','Asian', 'Pacific','Other', " ",'Hispanic'],
      datasets: [{
        label: 'state-avgs',
        data: [59.7, 30.4, 0.3, 3.2, 0.1, 5.0, 0, 8.8],
        type: 'scatter',
        fill: false,
        backgroundColor: "rgba(255,0,0,0.7)",
        borderColor: "rgba(0,0,0,0)",
      },{
        label: 'nation-avgs',
        data: [72.4, 12.6, 0.9, 4.7, 0.2, 6.2, 0, 16.3],
        type: 'scatter',
        fill: false,
        backgroundColor: "orange",
        borderColor: "rgba(0,0,0,0)",
      },{
        label: 'bars',
        backgroundColor: [
          '#27A060',
          '#247BA0',
          '#85E2F7',
          '#F9A061',
          '#FFE066',
          '#E1766A',
          '#ffffff',
          '#E26DBA',
        ],
        data: value_list,
      }]
    },
    options: {
      plugins: {
        datalabels: {display: false}
      },
      layout: {
        padding: {
          left: 5,
          right: 10,
          top: 15,
          bottom: 0
        }
      },
      "animation": {
        "duration": 0,
        "onComplete": function() {
          var chartInstance = this.chart,
          ctx = chartInstance.ctx;
          ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
          ctx.textAlign = 'center';
          this.data.datasets.forEach(function(dataset, i) {
            if (dataset.label == "bars") {
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function(bar, index) {
                var data = dataset.data[index];
                ctx.font = "11px Arial";
                if(data != 0.16){
                ctx.fillStyle = "black";
                } else {
                ctx.fillStyle = "white";
                }
                if (parseFloat(data) >= 0.0001 && parseFloat(data) < 0.9999){
                  data = data.toString().substring(1)
                } else if (parseFloat(data) == 0){
                  data = "0"
                }
                ctx.fillText(data.concat('%'), bar._model.x, bar._model.y-3);
              });
            }
          });
        }
      },
      legend: { display: false },
      scales: {
        yAxes: [{
          ticks: {
            suggestedMin: 0,
            suggestedMax: 100,
            stepSize: 20,
            callback: function (value, index, values) {
              return value.toString().concat("%");//pass tick values as a string into Number function
            }
          }
        }]
      }
    }
  });
}
function logPercentBarChart(key_list,value_list){
  value_list.push(0.16)
  value_list.push((Math.floor(Math.random() * 20)+20).toString())
  $("race-chart").empty();
 var ctx = document.getElementById('race-chart');
 ctx.height = 300;
  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['White','Black','Native','Asian', 'Pacific','Other', " ",'Hispanic'],
      datasets: [{
        label: 'state-avgs',
        data: [59.7, 30.4, 0.3, 3.2, 0.1, 5.0, 0, 8.8],
        type: 'scatter',
        fill: false,
        backgroundColor: "rgba(255,0,0,0.7)",
        borderColor: "rgba(0,0,0,0)",
      },{
        label: 'nation-avgs',
        data: [72.4, 12.6, 0.9, 4.7, 0.2, 6.2, 0, 16.3],
        type: 'scatter',
        fill: false,
        backgroundColor: "orange",
        borderColor: "rgba(0,0,0,0)",
      },{
        label: 'bars',
        backgroundColor: [
          '#27A060',
          '#247BA0',
          '#85E2F7',
          '#F9A061',
          '#FFE066',
          '#E1766A',
          '#ffffff',
          '#E26DBA',
        ],
        data: value_list,
      }]
    },
    options: {
      plugins: {
        datalabels: {display: false}
      },
      layout: {
        padding: {
          left: 5,
          right: 10,
          top: 15,
          bottom: 0
        }
      },
      "animation": {
        "duration": 0,
        "onComplete": function() {
          var chartInstance = this.chart,
          ctx = chartInstance.ctx;
          ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
          ctx.textAlign = 'center';
          this.data.datasets.forEach(function(dataset, i) {
            if (dataset.label == "bars") {
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function(bar, index) {
                var data = dataset.data[index];
                ctx.font = "11px Arial";
                if(data != 0.16){
                ctx.fillStyle = "black";
                } else {
                ctx.fillStyle = "white";
                }
                if (parseFloat(data) >= 0.0001 && parseFloat(data) < 0.9999){
                  data = data.toString().substring(1)
                } else if (parseFloat(data) == 0){
                  data = "0"
                }
                ctx.fillText(data.toString().concat('%'), bar._model.x, bar._model.y-3);
              });
            }
          });
        }
      },
      legend: { display: false },
      scales: {
        yAxes: [{
          type: 'logarithmic',
          position: 'left',
          ticks: {
            beginAtZero: true,
            min: 0.1, //minimum tick
            max: 100, //maximum tick
            callback: function (value, index, values) {
              return value.toString().concat("%");//pass tick values as a string into Number function
            }
          },
          afterBuildTicks: function (chartObj) { //Build ticks labelling as per your need
            chartObj.ticks = [];
            chartObj.ticks.push(0.1);
            chartObj.ticks.push(0.25);
            chartObj.ticks.push(0.5);
            chartObj.ticks.push(1);
            chartObj.ticks.push(2.5);
            chartObj.ticks.push(5);
            chartObj.ticks.push(10);
            chartObj.ticks.push(25);
            chartObj.ticks.push(50);
            chartObj.ticks.push(100);
          }
        }]
      }
    }
  });
}
function linearValueBarChart(key_list,value_list){
  value_list.push(0.16)
  value_list.push((Math.floor(Math.random() * 20)+20).toString())
  $("race-chart").empty();
 var ctx = document.getElementById('race-chart');
 ctx.height = 300;
  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['White','Black','Native','Asian', 'Pacific','Other', " ",'Hispanic'],
      datasets: [{
        label: 'state-avgs',
        data: [59.7, 30.4, 0.3, 3.2, 0.1, 5.0, 0, 8.8],
        type: 'scatter',
        fill: false,
        backgroundColor: "rgba(255,0,0,0.7)",
        borderColor: "rgba(0,0,0,0)",
      },{
        label: 'nation-avgs',
        data: [72.4, 12.6, 0.9, 4.7, 0.2, 6.2, 0, 16.3],
        type: 'scatter',
        fill: false,
        backgroundColor: "orange",
        borderColor: "rgba(0,0,0,0)",
      },{
        label: 'bars',
        backgroundColor: [
          '#27A060',
          '#247BA0',
          '#85E2F7',
          '#F9A061',
          '#FFE066',
          '#E1766A',
          '#ffffff',
          '#E26DBA',
        ],
        data: value_list,
      }]
    },
    options: {
      plugins: {
        datalabels: {display: false}
      },
      layout: {
        padding: {
          left: 5,
          right: 10,
          top: 15,
          bottom: 0
        }
      },
      "animation": {
        "duration": 0,
        "onComplete": function() {
          var chartInstance = this.chart,
          ctx = chartInstance.ctx;
          ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
          ctx.textAlign = 'center';
          this.data.datasets.forEach(function(dataset, i) {
            if (dataset.label == "bars") {
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function(bar, index) {
                var data = dataset.data[index];
                ctx.font = "11px Arial";
                if(data != 0.16){
                ctx.fillStyle = "black";
                } else {
                ctx.fillStyle = "white";
                }
                ctx.fillText(data, bar._model.x, bar._model.y-3);
              });
            }
          });
        }
      },
      legend: { display: false },
      scales: {
        yAxes: [{}]
      }
    }
  });
}
function logValueBarChart(key_list,value_list){
  value_list.push(0.16)
  value_list.push((Math.floor(Math.random() * 20)+20).toString())
  $("race-chart").empty();
 var ctx = document.getElementById('race-chart');
 ctx.height = 300;
  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['White','Black','Native','Asian', 'Pacific','Other', " ",'Hispanic'],
      datasets: [{
        label: 'state-avgs',
        data: [59.7, 30.4, 0.3, 3.2, 0.1, 5.0, 0, 8.8],
        type: 'scatter',
        fill: false,
        backgroundColor: "rgba(255,0,0,0.7)",
        borderColor: "rgba(0,0,0,0)",
      },{
        label: 'nation-avgs',
        data: [72.4, 12.6, 0.9, 4.7, 0.2, 6.2, 0, 16.3],
        type: 'scatter',
        fill: false,
        backgroundColor: "orange",
        borderColor: "rgba(0,0,0,0)",
      },{
        label: 'bars',
        backgroundColor: [
          '#27A060',
          '#247BA0',
          '#85E2F7',
          '#F9A061',
          '#FFE066',
          '#E1766A',
          '#ffffff',
          '#E26DBA',
        ],
        data: value_list,
      }]
    },
    options: {
      plugins: {
        datalabels: {display: false}
      },
      layout: {
        padding: {
          left: 5,
          right: 10,
          top: 15,
          bottom: 0
        }
      },
      "animation": {
        "duration": 0,
        "onComplete": function() {
          var chartInstance = this.chart,
          ctx = chartInstance.ctx;
          ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
          ctx.textAlign = 'center';
          this.data.datasets.forEach(function(dataset, i) {
            if (dataset.label == "bars") {
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function(bar, index) {
                var data = dataset.data[index];
                ctx.font = "11px Arial";
                if(data != 0.16){
                ctx.fillStyle = "black";
                } else {
                ctx.fillStyle = "white";
                }
                ctx.fillText(data, bar._model.x, bar._model.y-3);
              });
            }
          });
        }
      },
      legend: { display: false },
      scales: {
        yAxes: [{
          type: 'logarithmic',
          display:true,
          position: 'left',
          ticks: {
            beginAtZero: true,
            min: 1, //minimum tick
            callback: function (value, index, values) {
              return value.toString();//pass tick values as a string into Number function
            }
          },
          afterBuildTicks: function (chartObj) { //Build ticks labelling as per your need
            chartObj.ticks = [];
            chartObj.ticks.push(1);
            chartObj.ticks.push(10);
            chartObj.ticks.push(100);
            chartObj.ticks.push(1000);
            chartObj.ticks.push(10000);
          }
        }]
      }
    }
  });
}
function table(key_list,value_list,percent_list){
  var combined_List = [['value','#','%'],];
  var i = 0;
  key_list.forEach(function(){
    combined_List.push([key_list[i],value_list[i],percent_list[i]]);
    i++;
  })
  createTable(combined_List);
}
function createTable(tableData) {
  destroyChart()
  $("race-chart").empty();
  var ctx = document.getElementById('race-chart');
  ctx.style.height = "1px";
  var table = document.getElementById('table-test');
  table.style["table-layout"] = "fixed";
  table.innerHTML = "";
  var tableBody = document.createElement('tbody');
  tableData.forEach(function(rowData) {
    var row = document.createElement('tr');
    var i = 0;
    rowData.forEach(function(cellData) {
      var cell = document.createElement('td');
      if (i != 0 ){
        cell.style.width = "50px"
      } else {
        cell.style.width = "70px"
      }
      cell.style.border = "1px solid black";
      cell.appendChild(document.createTextNode(cellData));
      row.appendChild(cell);
      i++;
    });
    tableBody.appendChild(row);
  });
  table.appendChild(tableBody);
}
