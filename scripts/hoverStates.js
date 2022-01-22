function setupHoverStates(){
  var b = 'base-districts'.concat('-').concat(SIZE)
  map.on('mousemove', b, function (e) {
    hoveredId = setHoverState(e,hoveredId);
  });
  map.on('mouseleave', b, function () {
    removeHoverState(hoveredId);
  });
  map.on('mousedown', b, function (e) {
    heldId = holdDistrict(e,heldId)
  });
  map.on('mousemove', b, function (e) {
    if (!heldDistrict){
      eFeats = e.features;
      updateBoxes(eFeats)
    };
  });
}

function setHoverState(e,hoveredId){
  var c = code.concat('-').concat(SIZE)
  var n = 'stateVectorTiles'.concat('-').concat(SIZE)
  if (e.features.length > 0) {
    if (hoveredId) {
      map.setFeatureState(
        { source: n, id: hoveredId, sourceLayer:sourceLayerIDs[c] },
        { hover: false }
      );
    }
    hoveredId = e.features[0].id;
    map.setFeatureState(
      { source: n, id: hoveredId, sourceLayer:sourceLayerIDs[c] },
      { hover: true }
    );
  }
  return hoveredId
}

function removeHoverState(hoveredId){
  var c = code.concat('-').concat(SIZE)
  var n = 'stateVectorTiles'.concat('-').concat(SIZE)
  if (hoveredId) {
    map.setFeatureState(
      { source: n, id: hoveredId, sourceLayer:sourceLayerIDs[c] },
      { hover: false }
    );
  }
  hoveredId = null;
}

function setHoldState(e,heldId){
  var c = code.concat('-').concat(SIZE)
  var n = 'stateVectorTiles'.concat('-').concat(SIZE)
  if (e.features.length > 0) {
    heldId = e.features[0].id;
    map.setFeatureState(
      { source: n, id: heldId, sourceLayer:sourceLayerIDs[c] },
      { hold: true }
    );
  }
  return heldId
}

function removeHoldState(hhh){
  var c = code.concat('-').concat(SIZE)
  var n = 'stateVectorTiles'.concat('-').concat(SIZE)
  console.log(hhh)
  if (hhh) {
    map.setFeatureState(
      { source: n, id: hhh, sourceLayer:sourceLayerIDs[c] },
      { hold: false }
    );
  }
}

function holdDistrict(e,heldId){
  var c = code.concat('-').concat(SIZE)
  var n = 'stateVectorTiles'.concat('-').concat(SIZE)
  if (heldId){
    heldDistrict = false;
    map.setFeatureState(
      { source: n, id: heldId, sourceLayer:sourceLayerIDs[c] },
      { hold: false }
    );
    heldId = null;
  } else {
    heldDistrict = true;
    heldId = setHoldState(e,heldId)
  }
  return heldId
}
