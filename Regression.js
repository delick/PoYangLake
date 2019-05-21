// Define starting and finishing date for Landsat 8
var start = ee.Date('2017-04-23');
var finish = ee.Date('2017-04-06');

// Filtering Sentinel-1 imagery
var sentinel_filtered = ee.ImageCollection('COPERNICUS/S1_GRD')
.filterDate('2017-01-01', '2017-12-31')
.filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
.filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
.filterBounds(geometry)
.sort('system:time_start',true);
print('sentinel_filtered',sentinel_filtered)

// Filtering Landsat 8 imagery
var landsat_filtered = ee.ImageCollection("LANDSAT/LC08/C01/T1_SR")
.filterDate(start,finish)
.filterBounds(vector)
//.filterMetadata('CLOUD_COVER_LAND','less_than',50)

// NDVI model
function ndviRegress(image){
  var bands = image.select('VV','VH');
  var ndvi = bands.expression('0.5789 - 0.04885 * b(0) - 0.01021 * b(1) - 0.00341 * b(0) * b(1)').rename('NDVI');
  //return NDVI;
  return image.addBands(ndvi);
}

// EVI model
function eviRegress(image){
  var bands = image.select('VV','VH');
  var evi = bands.expression('1.05843 - 0.0355 * b(0) + 0.01774 * b(1) - 0.00219 * b(0) * b(1)').rename('EVI');
  //return NDVI;
  return image.addBands(evi);
}

// Apply models
var preCollection = sentinel_filtered.map(ndviRegress).map(eviRegress).select('NDVI','EVI');

// Display results
var composite = preCollection.first();
print('composite', composite);
print('preCollection',preCollection);
Map.addLayer(preCollection.first(),[],'Sentinel 1');
Map.addLayer(landsat_filtered,landsatImageVisParam,'Landsat 8');
Map.addLayer(PoYangLake,[],'PoYangLakeBounds',true, 0.3);



////////////////////////////
//  Batch Output Imagery  //
////////////////////////////
var size = preCollection.size().getInfo();
var S1_list = preCollection.toList(size);
// by default output file name is in format YYYY-DD. DD stands for DOY in year.
for (var n=0; n<size; n++) {
  var image = ee.Image(S1_list.get(n));
  var date = ee.Date(image.get('system:time_start')).format('YYYY-DDD');
  date = date.getInfo();
  //var collection = ee.ImageCollection(image1,image2)

  Export.image.toDrive({
    image: image,
    description: date,
    fileNamePrefix: date,
    folder: 'PoYangLake/EVI',
    scale: 30,
    region: vector,
    skipEmptyTiles: true,
    maxPixels: 130000000000
  });
}
