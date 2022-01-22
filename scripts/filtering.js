function resetFilterLayer(){
  document.getElementById("filter-value").value = "";
  document.getElementById("filter-list-title").style["font-weight"] = "normal";
  document.getElementById("filter-list-title").style["font-size"] = "12px";
  document.getElementById("filter-list-title").style["color"] = "#696969";
  document.getElementById("filter-list-title").textContent = "No filters applied";
  document.getElementById("filter-list").textContent = "";
  // Reset filters on all layers
  for (const [key, value] of Object.entries(qgisFields)) {
    map.setFilter(key, null)
  }

  Filter1 = [$('#any-all').html()]
}
function filterLayer(){
  var qlayer = document.getElementById("filter-layer").value
  if (qlayer == 'Visible Layer'){
    qlayer = document.getElementById("tog-layer").value.concat('-'+layer_geo_code)
  }
  var layer = document.getElementById("tog-layer").value.concat('-'+layer_geo_code)
  var symbol = document.getElementById('filter-expression').value
  var value = parseFloat(document.getElementById('filter-value').value)
  var qgis = qgisFields[qlayer]
  if (Filter1.length < 2){
    document.getElementById("filter-list-title").style["color"] = "black";
    document.getElementById("filter-list").textContent = "";
  }
  Filter1.push([symbol,qgis,value])
  console.log(value)
  if(!isNaN(value)){
    map.setFilter(layer,Filter1);
    console.log(layer,Filter1)
  }
  htmlFilterList()
  document.getElementById("filter-value").value = "";
}
function htmlFilterList(){
  document.getElementById("filter-list-title").style["font-size"] = "17px";
  document.getElementById("filter-list-title").style["font-weight"] = "bold";
  document.getElementById("filter-list-title").textContent = Filter1[0];
  var n = "";
  for (i=1; i < Filter1.length; i++){
    n = n.concat(Filter1[i][1].toString()+'   ');
    n = n.concat(Filter1[i][0].toString()+'   ');
    n = n.concat(Filter1[i][2].toString()+'\n');
  }
  document.getElementById("filter-list").textContent = n
}
function expressionList(){
  // Create select element for expression in filter module
  elmts = ['>=','<=','==','!=','<','>']
  var select = document.getElementById("filter-expression");
  for (var i = 0; i < elmts.length; i++) {
    var optn = elmts[i];
    var el = document.createElement("option");
    el.textContent = optn;
    el.value = optn;
    select.appendChild(el);
  }
}
function filterList(elmts) {
  // Create select element for layer in filter module
  var select = document.getElementById("filter-layer");
  var length = select.options.length;
  for (i = length-1; i >= 0; i--) {
    select.options[i] = null;
  }
  var current = document.createElement("option");
  current.textContent = 'Visible Layer';
  current.value = 'Visible Layer'
  select.appendChild(current);
  for (var i = 0; i < elmts.length; i++) {
    var optn = elmts[i];
    var el = document.createElement("option");
    el.textContent = optn.slice(0,-4);
    el.value = optn;
    select.appendChild(el);
  }
}

function setInputFilter(textbox, inputFilter) {
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
    textbox.addEventListener(event, function() {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      } else {
        this.value = "";
      }
    });
  });
}
