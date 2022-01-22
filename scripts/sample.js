var colorDictRace = {
  '0':'#27A060',
  '1':'#247BA0',
  '2':'#85E2F7',
  '3':'#F9A061',
  '4':'#FFE066',
  '5':'#E1766A',
  '6':'#663f00',
}
var colorDictEthnicity = {
  '0':'#999999',
  '1':'#E26DBA',
}
var nameDictRace = {
	0:'White',
	1:'Black',
	2:'Asian',
	3:'Native',
	4:'Pacific',
	5:'Other',
	6:'Mixed',
}
var nameDictEthnicity = {
	0:'Not Hispanic',
	1:'Hispanic',
}

function switchFoci(){
  if (currentFoci == "Race") currentFoci = "Ethnicity";
	else currentFoci = "Race";
	restart()
}
function switchColors(){
  if (currentColors == "Race") currentColors = "Ethnicity";
	else currentColors = "Race";
  d3.selectAll("circle")
    .attr("fill", function(d) {
      if (currentColors == "Race") return colorDictRace[d.Race.toString()];
			else return colorDictEthnicity[d.Ethnicity.toString()];
     })
}

function getRandomInt(min, max) {
  // max is exclusive and min is inclusive
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min)) + Math.ceil(min));
}

var fociA = [
  {x:110,y:60},
  {x:190,y:60},
  {x:110,y:110},
  {x:190,y:110},
  {x:110,y:160},
  {x:190,y:160},
  {x:150,y:210}
]
var fociB = [{x:200,y:150},{x:100,y:150}];
var fociC = [{x:150,y:90}]

var currentFoci = "All";
var currentColors = "Race";

function createData(){
  return d3.range(100).map(function(i) {
    var n = {};
    n.Race = getRandomInt(0,7);
    n.Ethnicity = getRandomInt(0,2);
    return n;
  })
}
var nodes = createData()

var tooltip = d3.select("body")
	.append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);

function countSample(n){
	C = [0,0,0]
	nodes.forEach(function(d){
		if (d.Race == n.Race) C[0]++
		if (d.Ethnicity == n.Ethnicity) C[1]++
		if (d.Race == n.Race && d.Ethnicity == n.Ethnicity) C[2]++
	})
	return C
}

function toolTipText(d,C){
	var display = $("input[name='display']:checked").val();
	line0 = "<b>In Arizona...<br></b>";
	if (display == 'Percent') {
		line1 = C[0] + "% are " + nameDictRace[d.Race] + "&nbsp<br>";
		line2 = C[1] + "% are " + nameDictEthnicity[d.Ethnicity] + "&nbsp<br>";
		line3 = C[2] + "% are both^";
	} else if (display == 'Ratio') {
		var L1 = ratio(C[0]/100);
		var L2 = ratio(C[1]/100);
		var L3 = ratio(C[2]/100);
		line1 = L1[0] + " in " + L1[1] + " are " + nameDictRace[d.Race] + "&nbsp<br>";
		line2 = L2[0] + " in " + L2[1] + " are " + nameDictEthnicity[d.Ethnicity] + "&nbsp<br>";
		line3 = L3[0] + " in " + L3[1] + " are both^";
	}

	if (currentColors == 'Race') return line0+line1+line2+line3
	if (currentColors == 'Ethnicity') return line0+line2+line1+line3
}

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");
    radius = 10;

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 3));

function createToolTip(d){
  C = countSample(d)
  tooltip.transition()
    .duration(300)
    .style("opacity", .9);
  tooltip.html(toolTipText(d,C))
    .style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY + 10) + "px");
}
function destroyToolTip(){
  tooltip.transition()
    .duration(100)
    .style("opacity", 0);
}
function moveToolTip(){
  tooltip.style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY + 10) + "px");
}
function colorNode(d){

}

var node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .on('mouseover.tooltip', function(d) { createToolTip(d); })
      .on("mouseout.tooltip", function() { destroyToolTip(); })
      .on("mousemove", function() { moveToolTip() })
      .attr("r", 5.8)
      .attr("fill", function(d) {
          if (currentColors == "Race") return colorDictRace[d.Race.toString()];
          else return colorDictEthnicity[d.Ethnicity.toString()];
         })
      .style("stroke-width", 1)
      .style("stroke", "black")
    simulation
        .nodes(nodes)
        .on("tick", ticked);

function ticked() {
  var k = (this.alpha() * 0.6);
  // nudge nodes to proper foci:
  if(currentFoci == "Race" ) {
    nodes.forEach(function(n, i) {
      n.y += (fociA[n.Race].y - n.y) * k * 1.1 + 20;
      n.x += (fociA[n.Race].x - n.x) * k;
    });
  }
  else if(currentFoci == "Ethnicity" ) {
    nodes.forEach(function(n, i) {
      n.y += (fociB[n.Ethnicity].y - n.y) * k*1.4;
      n.x += (fociB[n.Ethnicity].x - n.x) * k;
    });
  } else {
		nodes.forEach(function(n, i) {
      n.y += (fociC[0].y - n.y) * k + 40;
      n.x += (fociC[0].x - n.x) * k;
    });
	}

  node
    .attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
    .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); })
}

function ratio(x){
	var size = 0;
	if (x <= 0.9 && x >= 0.1){
		size = 10;
	} else if (x < 0.1){
		size = 100;
	}

	if (size > 0){
		var m = new Array(size).fill(0).map(() => new Array(size).fill(0));
		var d = new Array(size).fill(0).map(() => new Array(size).fill(0));
		[...Array(size).keys()].forEach(function(i){
			[...Array(size).keys()].forEach(function(j){
				m[i][j] =((i+1)/(j+1)).toFixed(5);
        d[i][j] = (Math.abs(x-m[i][j])).toFixed(5);
			})
		})
	} else if (x > 0.9){
		var m = [[0.9,0.95,0.98,0.99,1],[0,0,0,0,0]];
    var d = [[99,99,99,99,99],[0,0,0,0,0]];
		[...Array(2).keys()].forEach(function(i){
			[...Array(4).keys()].forEach(function(j){
				d[i][j] = (Math.abs(x-m[i][j])).toFixed(5);
			})
		})
	}

	var min = 999;
	var minIndex = [999,999];
	[...Array(m.length).keys()].forEach(function(i){
		[...Array(m[0].length).keys()].forEach(function(j){
			if (d[i][j] < min && (i == 0 || (j != 6 && j != 8))){
        min = d[i][j]
				if (x < 0.1 && i == 0) minIndex = [i+1,j+1]
        else if (x >= 0.1 && x <= 0.9) minIndex = [i+1,j+1];
        else if (x > 0.9 && i == 0){
          if (j == 0) minIndex = [9,10]
          else if (j == 1) minIndex = [19,20]
          else if (j == 2) minIndex = [49,50]
          else if (j == 3) minIndex = [99,100]
          else if (j == 4) minIndex = [100,100]
				}
			}
		})
	})
	return minIndex
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function restart() {
  node = node.data(nodes, function(d) { return d.id;});
  node.exit().remove();
  d3.selectAll("g > *").remove();
  nodes = createData()
  node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .on('mouseover.tooltip', function(d) { createToolTip(d); })
        .on("mouseout.tooltip", function() { destroyToolTip(); })
        .on("mousemove", function() { moveToolTip() })
        .attr("r", 5.8)
        .attr("fill", function(d) {
            if (currentColors == "Race") return colorDictRace[d.Race.toString()];
            else return colorDictEthnicity[d.Ethnicity.toString()];
           })
        .style("stroke-width", 1)
        .style("stroke", "black")
      simulation
          .nodes(nodes)
          .on("tick", ticked);

  simulation.nodes(nodes);
  simulation.alpha(1).restart();
}
