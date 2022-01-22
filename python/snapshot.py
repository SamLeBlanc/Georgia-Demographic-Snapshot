from PyQt5.QtCore import *
from qgis.utils import iface
from os import path
import processing
import os
from qgis.core import ( QgsVectorLayer )
import requests
import json
import pandas as pd
import time
import requests, zipfile, io
from datetime import datetime

folder_path = f'/home/sam/Desktop/SNAPSHOT/GIS/'

# Three dictionaries connecting state initials, names, and FIPS code
# (01 -> 56, Alabama -> Wyoming, *Also 72->Puerto Rico )
code_to_state = {
  '56':'WY'
}
state_to_code = {
  'AL':'01' , 'AK':'02' , 'AZ':'04' , 'AR':'05' , 'CA':'06' , 'CO':'08' , 'CT':'09' , 'DE':'10' , 'DC':'11' , 'FL':'12' ,
  'GA':'13' , 'HI':'15' , 'ID':'16' , 'IL':'17' , 'IN':'18' , 'IA':'19' , 'KS':'20' , 'KY':'21' , 'LA':'22' , 'ME':'23' ,
  'MD':'24' , 'MA':'25' , 'MI':'26' , 'MN':'27' , 'MS':'28' , 'MO':'29' , 'MT':'30' , 'NE':'31' , 'NV':'32' , 'NH':'33' ,
  'NJ':'34' , 'NM':'35' , 'NY':'36' , 'NC':'37' , 'ND':'38' , 'OH':'39' , 'OK':'40' , 'OR':'41' , 'PA':'42' , 'RI':'44' ,
  'SC':'45' , 'SD':'46' , 'TN':'47' , 'TX':'48' , 'UT':'49' , 'VT':'50' , 'VA':'51' , 'WA':'53' , 'WV':'54' , 'WI':'55' ,
  'WY':'56' , 'PR': '72'
}
code_to_state_name = {
  '01':'Alabama' , '02':'Alaska' , '04':'Arizona' , '05':'Arkansas' , '06':'California' , '08':'Colorado' , '09':'Connecticut' , '10':'Delaware' , '11':'District_of_Columbia' , '12':'Florida' ,
  '13':'Georgia' , '15':'Hawaii' , '16':'Idaho' , '17':'Illinois' , '18':'Indiana' , '19':'Iowa' , '20':'Kansas' , '21':'Kentucky' , '22':'Louisiana' , '23':'Maine' ,
  '24':'Maryland' , '25':'Massachusetts' , '26':'Michigan' , '27':'Minnesota' , '28':'Mississippi' , '29':'Missouri' , '30':'Montana' , '31':'Nebraska' , '32':'Nevada' , '33':'New_Hampshire' ,
  '34':'New_Jersey' , '35':'New_Mexico' , '36':'New_York' , '37':'North_Carolina' , '38':'North_Dakota' , '39':'Ohio' , '40':'Oklahoma' , '41':'Oregon' , '42':'Pennsylvania' , '44':'Rhode_Island' ,
  '45':'South_Carolina' , '46':'South_Dakota' , '47':'Tennessee' , '48':'Texas' , '49':'Utah' , '50':'Vermont' , '51':'Virginia' , '53':'Washington' , '54':'West_Virginia' , '55':'Wisconsin' ,
  '56':'Wyoming' , '72':'Puerto_Rico'
}

# Downloads and unzips Census shapefiles from official TIGER directories
# If the file name already exists, the method will skip download to save time
# census_geography_keys are key,value pairs containing the "Census terminology" and "Sam's terminology" for each geography
# Currently downloading the block, group, tract, and county files (the directory only has CDs for 108th and 111th Congress...dumb)
# Example url for Alaska block file --> https://www2.census.gov/geo/pvs/tiger2010st/02_Alaska/02/tl_2010_02_tabblock10.zip
def download_census_files(code):
    census_geography_keys = [
        #['tabblock10','blocks10'],
        ['tract10'   ,'tracts10'],
        ['county10'  ,'countys10'],
        ['bg10'      ,'groups10']
    ];
    for web_name, my_file_name in census_geography_keys:
        file_path = folder_path + f'{code2}_{my_file_name}.shp';
        if not path.exists(file_path):
            current_time = datetime.now().strftime("%H:%M");
            print(f'Downloading Census File: {web_name}  State:{code}  Start Time:{current_time}');
            download_path = f'https://www2.census.gov/geo/pvs/tiger2010st/{code}_{code_to_state_name[code]}/{code}/tl_2010_{code}_{web_name}.zip';
            response = requests.get(download_path);
            z = zipfile.ZipFile(io.BytesIO(response.content));
            z.extractall(folder_path);

# Renames the downloaded Census files from download_census_files, using same census_geography_keys as before
# Files are renamed to shorter titles (blocks10, groups10, tracts10, countys10)
# Since shapefiles need 5 files to work (?) we must rename each file type in a loop
def rename_census_files(code):
    census_geography_keys = [
        #['tabblock10','blocks10'],
        ['tract10'   ,'tracts10'],
        ['county10'  ,'countys10'],
        ['bg10'      ,'groups10']
    ];
    for web_name, my_file_name in census_geography_keys:
        old_path = folder_path + '/tl_2010_' + code + '_' + web_name;
        new_path = folder_path + code2 + '_' + my_file_name;
        file_endings = ['.shp','.prj','.shx','.dbf','.shp.xml'];
        for type in file_endings:
            if path.exists(old_path+type):
                os.rename(old_path+type, new_path+type);


# Opens shapefiles in QGIS from all states of a desired geography
# Accepts list of strings of desired geography size as a parameter e.g. ['tracts','countys']
def open_selected_file_types_from_all_states(types):
    files = [];
    for t in types:
        if t == 'tracts': files.append('tracts10');
        elif t == 'countys': files.append('countys10');
        elif t == 'congs': files.append('congs19');
        elif t == 'blocks': files.append('blocks10');
        elif t == 'districts': files.append('districts20');
        elif t == 'groups': files.append('groups10');
        for c in reversed(code_to_state):
            for f in files:
                open_Vector_Layer_From_File(folder_path + c + code_to_state[c] + '_'+ f +'.shp', c + code_to_state[c] + '_' + f);

# Opens shapefiles in QGIS from all states for all available geographies
def open_all_files_types_from_all_states():
    files = ['tracts10','countys10','congs19','blocks10','districts20','groups10'];
    for c in reversed(code_to_state):
        for f in files:
            open_Vector_Layer_From_File(folder_path + c + code_to_state[c] + '_'+ f +'.shp', c + code_to_state[c] + '_' + f);

# Opens shapefiles in QGIS from selected states for all available geographies
# Accepts states via their FIPS code e.g. ['01','02','06']
def open_all_file_types_from_selected_states(codes):
    for c in codes:
        files = ['tracts10','countys10','congs19','blocks10','districts20','groups10'];
        for f in files:
            open_Vector_Layer_From_File(folder_path + c + code_to_state[c] + '_'+ f +'.shp', c + code_to_state[c] + '_' + f);

# Opens shapefiles in QGIS from selected states of a desired geography
# Same as the other three add functions but this one accepts two lists, one for types, one for state codes
def open_selected_file_types_from_selected_states(types,codes):
    files = [];
    for t in types:
        if t == 'tracts': files.append('tracts10');
        elif t == 'countys': files.append('countys10');
        elif t == 'congs': files.append('congs19');
        elif t == 'blocks': files.append('blocks10');
        elif t == 'districts': files.append('districts20');
        elif t == 'groups': files.append('groups10');
        for c in codes:
            for f in files:
                open_Vector_Layer_From_File(folder_path + c + code_to_state[c] + '_'+ f +'.shp', c + code_to_state[c] + '_' + f);

# Opens vector layer in QGIS from file path, includes parameter for new_layer_name
def open_Vector_Layer_From_File(input_file_path, new_layer_name):
    vlayer = QgsVectorLayer(input_file_path, new_layer_name, 'ogr');
    if not vlayer.isValid():
        print('Layer failed to load:', new_layer_name);
    else:
        QgsProject.instance().addMapLayer(vlayer);

# Removes all the layers, duh...
def remove_all_layers():
    layers = QgsProject.instance().mapLayers().values();
    for layer in layers: QgsProject.instance().removeMapLayer(layer);

def trim_census_layer_fields(layer,is_county_layer):
    delete_fields = ['NAME10','STATEFP10','COUNTYFP10', 'TRACTCE10', 'BLOCKCE10', 'MTFCC10', 'UR10',
    'UACE10', 'FUNCSTAT10', 'INTPTLAT10', 'INTPTLON10' , 'NAMELSAD10', 'COUNTYNS10',
    'LSAD10', 'CLASSFP10', 'CSAFP10', 'CBSAFP10', 'METDIVFP10', 'BLKGRPCE10'];
    if is_county_layer:
        delete_fields.pop(0);
    for f in delete_fields:
        if f in layer.fields().names():
            index = layer.fields().indexFromName(f);
            res = layer.dataProvider().deleteAttributes([index]);
            layer.updateFields();

# Add a field (column) to a layer in QGIS
# Parameters: layer to add to, new field name, and type (AS A STRING) ¯\_(ツ)_/¯
# Returns boolean value True if field was added, otherwise False
def add_field_to_layer(layer,field_name,type):
  if field_name not in layer.fields().names():
    res = False;
    if type == 'string': res = layer.dataProvider().addAttributes([QgsField(field_name, QVariant.String)]);
    if type == 'double': res = layer.dataProvider().addAttributes([QgsField(field_name, QVariant.Double)]);
    if type == 'int': res = layer.dataProvider().addAttributes([QgsField(field_name, QVariant.Int)]);
    if res:
         print(f'New field "{field_name}" added to layer {layer}');
    layer.updateFields();
    return True
  else:
    print(f'Field "{field_name}" -NOT- added to layer {layer}, field already exists in layer');
    return False

# Retrives data from Census API and joins it to geogrpahy file via GEOID10
# This method contains several other methods, for a description of those, refer to those methods specifically
# First, this method checks whether the API data has already been saved locally to a .csv, if so, just read it in
# If not, call get_census10_api_data for the data and api_data_to_dataframe to send it to pandas format
# Finally, add the .csv back to QGIS as delimited text layer, then join it to block layer vis GEOID10
def add_api_field_to_census_layer(layer,size,n,type,api_code):
    if size == 'block': TLA = 'B';
    if size == 'group': TLA = 'G';
    if size == 'county': TLA = 'C';
    if size == 'tract': TLA = 'T';
    field_name = api_code
    if size in ['block']: add_field_to_layer(BLOCK_LAYER, field_name, type);
    if size in ['county']: add_field_to_layer(COUNTY_LAYER, field_name, type);
    if size in ['group']: add_field_to_layer(GROUP_LAYER, field_name, type);
    if size in ['tract']: add_field_to_layer(TRACT_LAYER, field_name, type);
    string = api_code + TLA;
    print(f'Adding {api_code} data to {layer}');
    file_path = folder_path + f'{code2}_{size}_{api_code}.csv';
    if not path.exists(file_path):
        api_data = get_census10_api_data(size,api_code);
        api_data_to_dataframe(code2, size, api_code, api_data,"Z");
    create_csv_type_file(code2, size, api_code, type);
    N = QgsVectorLayer(folder_path + f'{code2}_{size}_{api_code}.csv', string, "ogr");
    newLayer = QgsProject.instance().addMapLayer(N);
    API = QgsProject.instance().mapLayersByName(string)[0];
    join_census_api_data_to_census_layer(layer, API, 'GEOID10');

# Run API Census 2010 request for the 'api_code' value for all geographies of that selected size in the state
# THIS IS MY PERSONAL CENSUS API KEY, don't be an asshole
# The api_code 'P001001' is total population, you can look up the rest...
# Returns the raw Census API data, to be put into a dataframe by method api_data_to_dataframe
def get_census10_api_data(size,api_code):
    api_key = 'dd677280c5e9a6f9c1f6c4929fa378c2e3f1ebc5';
    base_url = f'https://api.census.gov/data/2010/dec/sf1';
    block_url = f'{base_url}?get={api_code}&for=block:*&in=state:{code}%20county:*%20tract:*&key={api_key}';
    group_url = f'{base_url}?get={api_code}&for=block%20group:*&in=state:{code}%20county:*%20tract:*&key={api_key}';
    county_url = f'{base_url}?get={api_code}&for=county:*&in=state:{code}&key={api_key}';
    tract_url = f'{base_url}?get={api_code}&for=tract:*&in=state:{code}&key={api_key}';
    if size == 'block': url = block_url;
    if size == 'group': url = group_url;
    if size == 'county': url = county_url;
    if size == 'tract': url = tract_url;
    data = requests.get(url).json();
    return data

# Reads Census API raw return from mthod get_census10_api_data into pandas DataFrame
# Saves .csv file of the synthesized GEOID10 and api_code returned values
# Returns the dataframe with just GEOID10 and api_code values
def api_data_to_dataframe(code2, size, api_code, data, field_name):
    df = pd.DataFrame(data[1:], columns=data[0]);
    if size == 'block':
        df['GEOID10'] = df.state + df.county + df.tract + df.block;
        df.drop(columns=['state','county','tract','block'],inplace=True);
    if size == 'group':
        df['GEOID10'] = df.state + df.county + df.tract + df['block group'];
        df.drop(columns=['state','county','tract','block group'],inplace=True);
    if size == 'tract':
        df['GEOID10'] = df.state + df.county + df.tract;
        df.drop(columns=['state','county','tract'],inplace=True);
    if size == 'county':
        df['GEOID10'] = df.state + df.county;
        df.drop(columns=['state','county'],inplace=True);
    df.set_index('GEOID10',inplace=True);
    df.to_csv(index=True,path_or_buf=folder_path + f'{code2}_{size}_{api_code}.csv');
    return df

# Creates a csv type file (.csvt) which designated the type (int,double,string) of csv data
# Very helpful later on in QGIS because I cannot dynamically change column type for some reason...
def create_csv_type_file(code2,size,api_code,type):
    f = open(folder_path + f'{code2}_{size}_{api_code}.csvt', "w");
    if type == 'int': f.write(f'"String","Integer"');
    if type == 'double': f.write(f'"String","Double"');
    f.close()

# Joins .csv created from API data to layer based on join_field
def join_census_api_data_to_census_layer(layer, data, join_field):
    joinObject = QgsVectorLayerJoinInfo();
    joinObject.setJoinFieldName(join_field);
    joinObject.setTargetFieldName(join_field);
    joinObject.setJoinLayerId(data.id());
    joinObject.setUsingMemoryCache(True);
    joinObject.setJoinLayer(data);
    layer.addJoin(joinObject);

def callHoard(hoard):
    for i, call in enumerate(hoard):
        add_api_field_to_census_layer(COUNTY_LAYER, 'county', i ,'int', call)
        add_api_field_to_census_layer(GROUP_LAYER, 'group', i ,'int', call)
        add_api_field_to_census_layer(TRACT_LAYER, 'tract', i ,'int', call)

# Updates a feature at a specific field...sigh
# SOMEHOW, this is so hard in QGIS but here is a method that hopefully won't break...although it always seems to...
# layer: the layer the feature is on
# feature: the feature itself
# field_name: the field name that the change is occuring to
# fix: what to change the value to
def update_feature_at_field(layer,feature,field_name,fix):
    col_index = layer.fields().indexFromName(field_name);
    attrs = { col_index : fix};
    layer.dataProvider().changeAttributeValues({ feature.id() : attrs });

def removeAllLayersExcept(keep_layers):
    layers = QgsProject.instance().mapLayers().values()
    will_be_deleted = [l for l in layers if l not in keep_layers]
    for layer in will_be_deleted:
        QgsProject.instance().removeMapLayer(layer)

def updateFeatures():
    for f in COUNTY_LAYER.getFeatures():
        for h in hoard:
            update_feature_at_field(COUNTY_LAYER, f, h, f[f'{h}C_{h}']);
    for g in GROUP_LAYER.getFeatures():
        for h in hoard:
            update_feature_at_field(GROUP_LAYER, g, h, g[f'{h}G_{h}']);
    for t in TRACT_LAYER.getFeatures():
        for h in hoard:
            update_feature_at_field(TRACT_LAYER, t, h, t[f'{h}T_{h}']);

def exportCSVs():
    QgsVectorFileWriter.writeAsVectorFormat(COUNTY_LAYER, f"{folder_path}{code2}_COUNTY.csv", "utf-8", COUNTY_LAYER.crs(), 'CSV')
    QgsVectorFileWriter.writeAsVectorFormat(TRACT_LAYER, f"{folder_path}{code2}_TRACT.csv", "utf-8", TRACT_LAYER.crs(), 'CSV')
    QgsVectorFileWriter.writeAsVectorFormat(GROUP_LAYER, f"{folder_path}{code2}_GROUP.csv", "utf-8", GROUP_LAYER.crs(), 'CSV')

def delete_fields(layer):
    delete_fields = hoard;
    for f in delete_fields:
        if f in layer.fields().names():
            index = layer.fields().indexFromName(f);
            res = layer.dataProvider().deleteAttributes([index]);
            layer.updateFields();
    delete_fields = ['ALAND10','AWATER10','NAME10'];
    for f in delete_fields:
        if f in layer.fields().names():
            index = layer.fields().indexFromName(f);
            res = layer.dataProvider().deleteAttributes([index]);
            layer.updateFields();

######################################################################################################
######################################################################################################
######################################################################################################

year = '2020'
for code in code_to_state:
    remove_all_layers()
    #
    code2 = code + code_to_state[code]
    print(code2)
    #
    download_census_files(code)
    rename_census_files(code)
    #
    #open_all_files_types_from_all_states()
    open_selected_file_types_from_selected_states(['tracts'],[code])
    open_selected_file_types_from_selected_states(['groups'],[code])
    open_selected_file_types_from_selected_states(['countys'],[code])
    #
    COUNTY_LAYER = QgsProject.instance().mapLayersByName(code2 + '_countys10')[0]
    TRACT_LAYER = QgsProject.instance().mapLayersByName(code2 + '_tracts10')[0]
    GROUP_LAYER = QgsProject.instance().mapLayersByName(code2 + '_groups10')[0]
    #
    trim_census_layer_fields(GROUP_LAYER,False)
    trim_census_layer_fields(TRACT_LAYER,False)
    trim_census_layer_fields(COUNTY_LAYER,True)
    #
    hoard = [
    "P001001",
    "P002001",
    "P002002",
    "P002003",
    "P002004",
    "P002005",
    "P002006",
    "P006001",
    "P006002",
    "P006003",
    "P006004",
    "P006005",
    "P006006",
    "P006007",
    "P008001",
    "P008002",
    "P008003",
    "P008004",
    "P008005",
    "P008006",
    "P008007",
    "P008008",
    "P008009",
    "P008010",
    "P008011",
    "P008012",
    "P008013",
    "P008014",
    "P008015",
    "P008016",
    "P008017",
    "P008018",
    "P008019",
    "P008020",
    "P008021",
    "P008022",
    "P008023",
    "P008024",
    "P008025",
    "P008026",
    "P004001",
    "P004002",
    "P004003",
    "P005001",
    "P005002",
    "P005003",
    "P005004",
    "P005005",
    "P005006",
    "P005007",
    "P005008",
    "P005009",
    "P005010",
    "P005011",
    "P005012",
    "P005013",
    "P005014",
    "P005015",
    "P005016",
    "P005017",
    ]
    callHoard(hoard)
    #
    updateFeatures()
    #
    removeAllLayersExcept([COUNTY_LAYER,GROUP_LAYER,TRACT_LAYER])
    #
    exportCSVs()
    #
    delete_fields(COUNTY_LAYER)
    delete_fields(GROUP_LAYER)
    delete_fields(TRACT_LAYER)
