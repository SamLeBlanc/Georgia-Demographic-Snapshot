function marginRecolor(features){
  var descriptions = []
  drawLegend(visibleLayer,marginColorMap,descriptions)
  map.setPaintProperty(visibleLayer, 'fill-color', [
    'interpolate',
    ['linear'],
    ['get', qgisFields[visibleLayer]],
    marginColorMap[0][1], marginColorMap[0][0],
    marginColorMap[1][1], marginColorMap[1][0],
    marginColorMap[2][1], marginColorMap[2][0],
    marginColorMap[3][1], marginColorMap[3][0],
    marginColorMap[4][1], marginColorMap[4][0],
    marginColorMap[5][1], marginColorMap[5][0],
    marginColorMap[6][1], marginColorMap[6][0],
    marginColorMap[7][1], marginColorMap[7][0],
    marginColorMap[8][1], marginColorMap[8][0],
    marginColorMap[9][1], marginColorMap[9][0],
    marginColorMap[10][1], marginColorMap[10][0],
    marginColorMap[11][1], marginColorMap[11][0],
    marginColorMap[12][1], marginColorMap[12][0],
    marginColorMap[13][1], marginColorMap[13][0],
    marginColorMap[14][1], marginColorMap[14][0],
    marginColorMap[15][1], marginColorMap[15][0],
    marginColorMap[16][1], marginColorMap[16][0],
    marginColorMap[17][1], marginColorMap[17][0],
    marginColorMap[18][1], marginColorMap[18][0],
    marginColorMap[19][1], marginColorMap[19][0],
  ]);
}
function quartileRecolor(features){
  quartileMap = quartileColors(features)
  var descriptions = ['Q0 ','Q1 ','Q2 ','Q3 ','Q4 ']
  quartileMap = quartileMap.map(function(Q){
    return [Q[0],Number(Q[1].toFixed(3))];
  });
  for (i = 0; i < quartileMap.length-1; i++) {
    if (quartileMap[i][1] == quartileMap[i+1][1]){
      quartileMap[i+1][1] += 0.0005
    }
  }
  drawLegend(visibleLayer,quartileMap,descriptions)
  map.setPaintProperty(visibleLayer, 'fill-color', [
    'interpolate',
    ['linear'],
    ['get', qgisFields[visibleLayer]],
    quartileMap[0][1], quartileMap[0][0],
    quartileMap[1][1], quartileMap[1][0],
    quartileMap[2][1], quartileMap[2][0],
    quartileMap[3][1], quartileMap[3][0],
    quartileMap[4][1], quartileMap[4][0],
  ]);
}
function find_all_source_values(layer,field) {
  var c = code.concat('-').concat(SIZE)
  var n = 'stateVectorTiles'.concat('-').concat(SIZE)
  var features = map.querySourceFeatures(n, {sourceLayer: sourceLayerIDs[c]});
  var list = []
  features.forEach(function(f){
    list.push(f.properties[field])
  })
  var list = list.filter(function(el) {
    return !isNaN(parseFloat(el)) && isFinite(el);
  });
  return list
}
const median = arr => {
  const mid = Math.floor(arr.length / 2),
  nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;};
const quartile = (percent,arr) => {
  const quant = Math.floor(percent*arr.length),
  nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[quant] : (nums[quant - 1] + nums[quant]) / 2;
};
function drawLegend(visibleLayer, map, descriptions){
  document.getElementById('legend').innerHTML = "";
  var item = document.createElement('div');
  item.style["padding-left"] = "5px";
  var value = document.createElement('span');
  //value.innerHTML = ('&nbsp').concat(titleCase(visibleLayer.slice(0,-4)));
  value.innerHTML = titleCase(visibleLayer.replace('percent','perc.').slice(0,-4));
  value.style["font-size"] = "16px";
  value.style["font-weight"] = "bold";
  value.style["line-height"] = "1.6";
  value.style["font-variant"] = "small-caps";
  //item.style["text-align"] = "center";
  item.appendChild(value);
  item.appendChild(document.createElement('br'));
  legend.appendChild(item);
  for (i = 0; i < map.length; i++) {
    var num = map[i][1];
    var color = map[i][0];
    if (descriptions.length == map.length){
      var description = descriptions[i]
    } else {
      var description = ""
    }
    var item = document.createElement('div');
    var key = document.createElement('span');
    var value = document.createElement('span');
    var descrip = document.createElement('span');
    key.style.height = '15px';
    key.style.width = '15px';
    key.className = 'legend-key';
    key.style.backgroundColor = color;
    key.style.border = 'solid 0.5px black';
    if (num == 1e-6){
      value.innerHTML = "0+"
    } else if (num == -1e-6){
      value.innerHTML = "0-"
    } else {
      num = num > 1 ? Math.round(num) : num
      value.innerHTML = num;
    }
    descrip.innerHTML = description;
    item.appendChild(descrip);
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
  }
}
