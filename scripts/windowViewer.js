function windowBoxes(){
  windowViewerBox(eFeats,'','visible')
}

function getWindowColor(visibleLayer,val){
  var map = []
  if (visibleLayer == 'dem-margin'){
    map = marginColorMap;
  } else {
    try {
      map = qMap;
    }
    catch(err) {
      return "rgb(0,0,0)"
    }
  }
  for (i = 0; i < map.length-1; i++) {
    var val1 = map[i][1];
    var val2 = map[i+1][1];
    if (val >= val1 && val <= val2){
      var color1hex = map[i][0];
      var color2hex = map[i+1][0];
      var color1rgb = hexToRgb(color1hex);
      var color2rgb = hexToRgb(color2hex);
      var r = color1rgb.r + (color2rgb.r-color1rgb.r)/2;
      var g = color1rgb.g + (color2rgb.g-color1rgb.g)/2;
      var b = color1rgb.b + (color2rgb.b-color1rgb.b)/2;

      var rgbcolor = "rgb(";
      rgbcolor += [r,g,b].join();
      rgbcolor += ")";
      return rgbcolor
    }
  }
}
function windowViewerBox(eFeats, num, layer_name){
  $('#box-5'.concat(num)).css('padding','5px 10px 5px 10px');
  if (layer_name == 'visible') { layer = document.getElementById("tog-layer").value.concat('-'+layer_geo_code); }
  else { layer = layer_name; }
  var gqisCode = qgisFields[layer]
  var windowDisplay = document.getElementById('N'.concat(num));
  var windowDescription = document.getElementById('D'.concat(num));
  var windowValue = eFeats[0].properties[gqisCode]
  if (layer.includes('dem-margin')) {
    windowDisplay.textContent = (100*windowValue).toFixed(1);
  } else if (layer.includes('total-pop')) {
    windowDisplay.textContent = windowValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    windowDisplay.textContent = (100*windowValue).toFixed(1).concat('%');
  }
  windowDescription.textContent = titleCase(layer.replace('-percent',' population').slice(0,-4))
  var visibleLayer = document.getElementById("tog-layer").value.concat('-'+layer_geo_code);
  if (layer_name == 'visible') { var winColor = getWindowColor(visibleLayer,windowValue); }
  else { var winColor = 'grey'};
  document.getElementById('N'.concat(num)).style.color = winColor
}
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
