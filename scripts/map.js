function initializeMap(){
  var map = new mapboxgl.Map({
    // Mapbox map object, i.e. where the magic happens
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10', // Mapbox style url
    zoom: 6, // Single state for small-ish states
    center: [-84, 33] // Central Georgia
  });

  var scale = new mapboxgl.ScaleControl({
    maxWidth: 200,
    unit: 'imperial',
    position: 'bottom-right',
  });

  map.addControl(scale, 'bottom-right');
  return map
}

function createQGISfields(SIZE){
  var qgisFields = {};
  for (const [key, value] of Object.entries(all_layers)) {
    if (key.includes(geogrpahy_codes[SIZE])){
      qgisFields[key] = value;
    }
  }
  return qgisFields
}
