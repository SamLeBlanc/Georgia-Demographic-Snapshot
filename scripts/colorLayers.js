function switchLayers(){
  visibleLayer = document.getElementById("tog-layer").value.concat('-'+layer_geo_code)
  hideAllLayers();
  recolor()
  map.setLayoutProperty(visibleLayer, 'visibility', 'visible');
}
function hideAllLayers(){
  for (const [key, value] of Object.entries(all_layers)) {
    if (map.getLayer(key)) {
      map.setLayoutProperty(key, 'visibility', 'none');
    }
  }
}
function recolor(){
  var visibleLayer = document.getElementById("tog-layer").value.concat('-'+layer_geo_code)
  var features = find_all_source_values(visibleLayer,qgisFields[visibleLayer])
  setTimeout(function() {
    if (visibleLayer == 'dem-margin'){
      marginRecolor(features)
    } else {
      quartileRecolor(features)
      qMap = quartileColors(features)
      for (i = 0; i < qMap.length-1; i++) {
        if (qMap[i][1] == qMap[i+1][1]){
          qMap[i+1][1] += 0.0005
        }
      }
    }
    map.setPaintProperty(visibleLayer, 'fill-opacity',0.9)
  }, 500);
}

function resetBorderTraits(){
  var d = 'district-borders'.concat('-').concat(SIZE)
  map.setPaintProperty(d, 'line-color', "#000000");
  map.setPaintProperty(d, 'line-width', 0.5);
  map.setPaintProperty(d, 'line-opacity', 0.2);
}

function drawBorders(SIZE){
  var c = code.concat('-').concat(SIZE)
  var n = 'stateVectorTiles'.concat('-').concat(SIZE)
  var d = 'district-borders'.concat('-').concat(SIZE)
  var max_expr = 4;
  map.addLayer({
    'id': d,
    'type': 'line',
    'source': n,
    'source-layer':sourceLayerIDs[c],
    'layout': {'visibility': 'visible'},
    'paint': {
      'line-color': ['case',['boolean', ['feature-state', 'hold'], false], '#ff5aac',['boolean', ['feature-state', 'hover'], false], '#FFFF00', '#000000'],
      'line-width': ['case',['boolean', ['feature-state', 'hold'], false], 4,['boolean', ['feature-state', 'hover'], false], 4, 0],
      'line-opacity': ['case',['boolean', ['feature-state', 'hold'], false], 1,['boolean', ['feature-state', 'hover'], false], 1, 0.2],
          }
        });
      }
