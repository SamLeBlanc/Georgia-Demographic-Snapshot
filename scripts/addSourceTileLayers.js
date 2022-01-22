var tilesetIDs = {
  // Mapbox vector tileset urls for districts
  '13-district' : 'mapbox://samleblanc.81rcyumq',
  '13-county' : 'mapbox://samleblanc.0i3fzd52',
  '13-zip' : 'mapbox://samleblanc.5p2baaxr',
}
var sourceLayerIDs = {
  // Names(?) of tilset source layers, don't really understand what this is...
  '13-district' : '13GA_districts201-dw13g1',
  '13-county' : '13GA_countys10-11rhmx',
  '13-zip' : '13GA_zips201-13rme9', 
}
function addTilesetSource(code,SIZE){
  var c = code.concat('-').concat(SIZE)
  var n = 'stateVectorTiles'.concat('-').concat(SIZE)
  map.addSource(n, {
    'type': 'vector',
    'url': tilesetIDs[c],
    'generateId': true,
  });
}
function addBaseDistrictLayer(map,code,SIZE){
  var c = code.concat('-').concat(SIZE)
  var n = 'stateVectorTiles'.concat('-').concat(SIZE)
  var b = 'base-districts'.concat('-').concat(SIZE)
  map.addLayer({
    'id': b,
    'type': 'fill',
    'source': n,
    'source-layer': sourceLayerIDs[c],
    'layout': {'visibility': 'visible'},
    'paint': {'fill-color': '#000000', 'fill-opacity': 0}
  });
}
function addLayer(id,code,SIZE){
  var c = code.concat('-').concat(SIZE)
  var n = 'stateVectorTiles'.concat('-').concat(SIZE)
  map.addLayer({
    'id': id,
    'source': n,
    'source-layer': sourceLayerIDs[c],
    'type': 'fill',
    'layout':{'visibility': 'none'},
    'paint': {'fill-color': '#FFFFFF', 'fill-opacity': 0}
  });
}
function addLayersByGeogrpahy(SIZE){
  for (const [key, value] of Object.entries(qgisFields)) {
    addLayer(key,code,SIZE)
  }
}
