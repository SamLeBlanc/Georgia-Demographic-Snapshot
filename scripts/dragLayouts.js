function reLayout(){
  if (layout == 1) { layout1() }
}

function layout1(){
  console.log('layout1')
  //if ($("#win-6").height() > 183) { $("#box-6").slideToggle(); }
  $("#drag-1").css('top',0).css('left',0);
  div_height = parseInt($("#win-1").css('height').slice(0,-2));
  $("#drag-9").css('top', div_height + 12).css('left',0);
  map_height = parseInt($("#map").css('height').slice(0,-2));
  div_height = div_height + parseInt($("#win-9").css('height').slice(0,-2));
  $("#drag-4").css('top', div_height + 24).css('left',0);
  $("#drag-5").css('top', 0).css('left', 311);
  $("#drag-6").css('top', div_height + 24).css('left',130);
  map_width = parseInt($("#map").css('width').slice(0,-2));
  $("#drag-3").css('top',0).css('left',map_width - 464);
  if ($("#win-7").height() > 20) { $("#box-7").slideToggle(); }
  $("#drag-7").css('top',0).css('left','35%');
  $("#drag-10").css('top',0).css('left', window.innerWidth - $("#drag-10").css('width').slice(0, -2) - 14 );
}

function extraWindows(){
  if (parseInt($("#drag-5A").css('left').slice(0,-2)) > 2000){
    $("#drag-5A").css('top', map_height-125).css('left','32%');
    $("#drag-5B").css('top', map_height-125).css('left','44%')
    $("#drag-5C").css('top', map_height-125).css('left','56%')
    $("#drag-5D").css('top', map_height-125).css('left','68%')
  } else {
    $("#drag-5A").css('top', map_height-125).css('left',2500);
    $("#drag-5B").css('top', map_height-125).css('left',2500)
    $("#drag-5C").css('top', map_height-125).css('left',2500)
    $("#drag-5D").css('top', map_height-125).css('left',2500)
  }
}

function hideAllDrags(){
  for(i = 0; i < 100 ; i++){
    if ($("#drag-".concat(i.toString()))){
      $("#drag-".concat(i.toString())).css('left','250%');
    }
  }
}

function alignDragsLeft(){
  for(i = 0; i < 100 ; i++){
    if ($("#drag-".concat(i.toString()))){
      $("#drag-".concat(i.toString())).css('left','0');
      $("#drag-".concat(i.toString())).css('top',(30*i).toString());
    }
  }
}
