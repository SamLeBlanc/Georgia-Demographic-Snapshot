function districtInfoBox(fips_dict,eFeats){
  var nameDisplay = document.getElementById('name');
  var idDisplay = document.getElementById('did');
  var countygeoDisplay = document.getElementById('cty');
  var countynameDisplay = document.getElementById('ctyname');
  if (SIZE == 'district') {
    var dist_name = eFeats[0].properties.PRECINCT_N;
    dist_name = titleCase(dist_name)
    var dist_id = eFeats[0].properties.DIST_ID;
    var dist_countygeo = eFeats[0].properties.COUNTY_GEO;
    var dist_countyname = fips_dict[eFeats[0].properties.COUNTY_GEO];
  } else if (SIZE == 'county'){
    var dist_name = "";
    var dist_id = "";
    var dist_countygeo = eFeats[0].properties.GEOID10;
    var dist_countyname = fips_dict[eFeats[0].properties.GEOID10];
  } else if (SIZE == 'zip'){
    var dist_name = eFeats[0].properties.GEOID10;
    var dist_id = "";
    var dist_countygeo = "";
    var dist_countyname = "";
  }
  if (eFeats.length > 0) {
    nameDisplay.textContent = dist_name;
    idDisplay.textContent = dist_id;
    countygeoDisplay.textContent = dist_countygeo;
    countynameDisplay.textContent = dist_countyname;
  }
}
function titleCase(str) {
// Format district name strings
// Split on hyphens and spaces, and capitalize first letter of each unless the word has a number
var splitStr = str.split(/-| /) ;
for (var i = 0; i < splitStr.length; i++) {
  if(!hasNumber(splitStr[i])){
   splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1).toLowerCase();
  }
}
return splitStr.join(' ');
}
function hasNumber(str) {
// Check if string has a number in it
return /\d/.test(str);
}
