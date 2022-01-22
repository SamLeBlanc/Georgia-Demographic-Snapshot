function minimizeAll(){
  for(i = 0; i < 100 ; i++){
    if ($("#win-".concat(i.toString()))){
      if ($("#win-".concat(i.toString())).height() > 20) {
        $("#box-".concat(i.toString())).slideToggle();
      }
    }
  }
}

function maximizeAll(){
  for(i = 0; i < 100 ; i++){
    if ($("#win-".concat(i.toString()))){
      if ($("#win-".concat(i.toString())).height() < 25) {
        $("#box-".concat(i.toString())).slideToggle();
      }
    }
  }
}

function buttonBoys(){
  $("#min-all").click(function(){ minimizeAll() });
  $("#max-all").click(function(){ maximizeAll() });
  $("#butt-1").click(function(){
    $(this).html("↕");
    $("#box-1").slideToggle();
  });
  $("#butt-2").click(function(){
    $(this).html("↕");
    $("#box-2").slideToggle();
  });
  $("#butt-3").click(function(){
    $(this).html("↕");
    $("#box-3").slideToggle();
  });
  $("#butt-4").click(function(){
    $(this).html("↕");
    $("#box-4").slideToggle();
  });
  $("#butt-5").click(function(){
    $(this).html("↕");
    $("#box-5").slideToggle();
  });
  $("#butt-5A").click(function(){
    $(this).html("↕");
    $("#box-5A").slideToggle();
  });
  $("#butt-5B").click(function(){
    $(this).html("↕");
    $("#box-5B").slideToggle();
  });
  $("#butt-5C").click(function(){
    $(this).html("↕");
    $("#box-5C").slideToggle();
  });
  $("#butt-5D").click(function(){
    $(this).html("↕");
    $("#box-5D").slideToggle();
  });
  $("#butt-6").click(function(){
    $(this).html("↕");
    $("#box-6").slideToggle();
  });
  $("#butt-7").click(function(){
    $(this).html("↕");
    $("#box-7").slideToggle();
  });
  $("#butt-8").click(function(){
    $(this).html("↕");
    $("#box-8").slideToggle();
  });
  $("#butt-9").click(function(){
    $(this).html("↕");
    $("#box-9").slideToggle();
  });
  $("#butt-10").click(function(){
    $(this).html("↕");
    $("#box-10").slideToggle();
  });

  $("#pv").click(function(){
    if ($(this).html() == "#"){
      $(this).html("%");
    }
    else {
      $(this).html("#");
    }
    raceInfoBox(eFeats)
  });
  $("#lin-log").click(function(){
    if ($(this).html() == "Linear"){
      $(this).html("Log");
    }
    else {
      $(this).html("Linear");
    }
    raceInfoBox(eFeats)
  });
  $("#chart-type").click(function(){
    if ($(this).html() == "Bar"){
      $(this).html("Donut");
    }
    else {
      $(this).html("Bar");
    }
    raceInfoBox(eFeats)
  });
  $("#graph-table").click(function(){
    if ($(this).html() == "Graph"){
      $(this).html("Table");
      disableButton('#chart-type')
      disableButton('#lin-log')
    }
    else {
      $(this).html("Graph");
      undisableButton('#chart-type')
      undisableButton('#lin-log')
    }
    raceInfoBox(eFeats)
  });
  $("#any-all").click(function(){
    if ($('#any-all').html() == "any"){
      console.log('any')
      $('#any-all').html("all");
    }
    else if ($('#any-all').html() == "all"){
      console.log('all')
      $('#any-all').html("none");
    }
    else if ($('#any-all').html() == "none"){
      console.log('none')
      $('#any-all').html("any");
    }
    resetFilterLayer();
  });
}

function disableButton(id){
  var btn = $(id);
  btn.attr("disabled", "disabled");
  btn.css("background-color", "#bbc4cc");
}
function undisableButton(id){
  var btn = $(id);
  btn.removeAttr("disabled");
  btn.css("background-color", "white");
  $(".buttonA1").hover(function(e) {
    $(this).css("background-color",e.type === "mouseenter"?"rgba(147,112,219, 0.7)":"white")
  });
}
