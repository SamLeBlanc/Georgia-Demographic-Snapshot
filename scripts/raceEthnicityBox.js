function preTextRaceBox(){
  var canvas = document.getElementById("race-chart");
  var ctx = canvas.getContext("2d");
  ctx.font = "14px Arial";
  ctx.fillStyle = "grey";
  ctx.textAlign = "center";
  ctx.fillText("Hover over a tile to view data!",  canvas.width/2, canvas.height/2);
}

function getSomeLists(eFeats, list_percent, list_whole){
  var key_list = [];
  var value_list_percent = [];
  var value_list_whole = [];
  for (var [key, value] of Object.entries(list_percent)) {
    var display = document.getElementById(key);
    var output = eFeats[0].properties[value];
    key_list.push(key);
    value_list_percent.push((output*100).toFixed(1));
  }
  for (var [key, value] of Object.entries(list_whole)) {
    var display = document.getElementById(key);
    var output = eFeats[0].properties[value];
    value_list_whole.push(output.toFixed(0))
  }
  return [key_list,value_list_percent,value_list_whole]
}

function getCharts(eFeats){
  destroyChart()
  document.getElementById('table-test').innerHTML = "";
  if ($("#pv").html() == "%"){
    var valueList = value_list_percent;
  } else {
    var valueList = value_list_whole;
  }
  if ($("#graph-table").html() == "Table"){
    document.getElementById('race-chart').innerHTML = "";
    var output = eFeats[0].properties[layer_geo_sumBy.concat("0")];
    value_list_whole.unshift(output.toFixed(0))
    key_list = ['Total','White','Black','Native','Asian','Pacific','Other']
    value_list_percent.unshift('100')
    table(key_list,value_list_whole,value_list_percent)
  }
  else if (($("#pv").html() == "%") && ($("#lin-log").html() == "Linear") && ($("#chart-type").html() == "Bar")){
    linearPercentBarChart(key_list,valueList)
  }
  else if ((($("#pv").html() == "%") && $("#lin-log").html() == "Log") && ($("#chart-type").html() == "Bar")){
    logPercentBarChart(key_list,valueList)
  }
  else if (($("#pv").html() == "#") && ($("#lin-log").html() == "Linear") && ($("#chart-type").html() == "Bar")){
    linearValueBarChart(key_list,valueList)
  }
  else if ((($("#pv").html() == "#") && $("#lin-log").html() == "Log") && ($("#chart-type").html() == "Bar")){
    logValueBarChart(key_list,valueList)
  }
  else if ($("#chart-type").html() == "Donut"){
    doughnut(key_list,valueList)
  }
}

function showPopCount(){
  var pop = eFeats[0].properties[layer_geo_sumBy.concat("0")]
  var nfObject = new Intl.NumberFormat('en-US');
  var output = nfObject.format(pop);
  document.getElementById('total-pop').textContent = output;
}

function raceInfoBox(eFeats){
  var list_percent = {
  'White': layer_geo_sumBy.concat('2P'),
  'Black':layer_geo_sumBy.concat('3P'),
  'Native':layer_geo_sumBy.concat('4P'),
  'Asian':layer_geo_sumBy.concat('5P'),
  'Pacific':layer_geo_sumBy.concat('6P'),
  'Other':layer_geo_sumBy.concat('7P'),
  }
  var list_whole = {
  'White':layer_geo_sumBy.concat('2'),
  'Black':layer_geo_sumBy.concat('3'),
  'Native':layer_geo_sumBy.concat('4'),
  'Asian':layer_geo_sumBy.concat('5'),
  'Pacific':layer_geo_sumBy.concat('6'),
  'Other':layer_geo_sumBy.concat('7'),
  }

  var lists = getSomeLists(eFeats, list_percent, list_whole);
  key_list = lists[0]
  value_list_percent = lists[1]
  value_list_whole = lists[2]
  showPopCount()
  destroyChart()
  getCharts(eFeats)
}
