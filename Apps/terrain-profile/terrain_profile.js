require(['jquery','Cesium','plotly-latest.min.js'], function(jQuery,Cesium,Plotly) {
        //"use strict";
    require(['jquery-ui'], function() {
        //"use strict";
    var url = 'http://bhuvan3.nrsc.gov.in/tilecache/tilecache.py?';
    var viewer = new Cesium.Viewer('cesiumContainer',{
		imageryProvider : new Cesium.WebMapServiceImageryProvider({
			url : url,
			//url : 'http://bhuvannuis.nrsc.gov.in/bhuvan/gwc/service/wms?',
			layers: 'bhuvan_imagery',
            enablePickFeatures: false,
			//layers : 'india3'
			//proxy : new Cesium.DefaultProxy('proxy.php') 
        }),
        baseLayerPicker : false
    });
    //var viewer = new Cesium.Viewer('cesiumContainer');
/////////////////////////////////////////////////////////////////////////////////////////////    
    //Baselayerpicker Issue
       /* var viewer = new Cesium.Viewer('cesiumContainer',{imageryProvider:false, baseLayerPicker:false});

var imageryViewModels = []; // I populate this as an array of ProviderViewModel objects 
imageryViewModels.push(new Cesium.ProviderViewModel({
            name : 'Bhuvan Satellite Imagery',
            //iconUrl : buildModuleUrl('Widgets/Images/ImageryProviders/sat1.jpg'),
            iconUrl : Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/openStreetMap.png'),
            tooltip : 'Bhuvan Satellite imagery',
            creationFunction : function() {
                return new OpenStreetMapImageryProvider({
	//url : 'http://bhuvan.nrsc.gov.in/tilecache/tilecache.py/1.0.0/bhuvan_imagery2/',
	url : 'http://bhuvan3.nrsc.gov.in/tilecache/tilecache.py/1.0.0/bhuvan_imagery2/',
	
	maximumLevel : 16,
	//proxy: new DefaultProxy('proxy.php'), //to be commmented when making live
    credit : ' '
})
            }
        }));

		 imageryViewModels.push(new Cesium.ProviderViewModel({
            name : 'Bhuvan Maps',
            //iconUrl : buildModuleUrl('Widgets/Images/ImageryProviders/map2.jpg'),
            iconUrl : Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/openStreetMap.png'),
            tooltip : 'Bhuvan Maps data',
            creationFunction : function() {
                return new WebMapServiceImageryProvider({
        url : 'http://bhuvan.nrsc.gov.in/nuis/gwc/service/wms/',        
        layers: 'india3',
		//proxy : new DefaultProxy('proxy.php')
    });
            }
        }));


var blp2 = new Cesium.BaseLayerPicker('baseLayerPickerContainer',  {
//        globe: Cesium.Ellipsoid.WGS84,  // Psych! this is wrong.
        globe:viewer.scene, // Yep, this is right
        imageryProviderViewModels : imageryViewModels
        });
    
    
    
    
    */
    
    
 //////////////////////////////////////////////////////////////////////////////////////   
	var scene = viewer.scene;
	//var canvas = document.getElementById('cesiumContainer');
	var ellipsoid = viewer.scene.globe.ellipsoid;
    var entity;
    var latlong_carto;
    var CLICKED = false;  // Whether user has CLICKED on Choose points before going for Terrain Profile
	//var ROUND = 0;
    var id_poly = 0;
    var id_point = 0;
	var DOWNLOAD_DATA = "";
	var SAMPLE_DIST;
	var handler; //make handler global to avoid creating entities at every click even after terrain profile is shown
    //document.getElementById("View_graph").style.visibility = "hidden";
//////////////////////////////////////////////////////////////////////////////////	
	
	// LOAD LAYER		
	/*var url='http://bhuvan3.nrsc.gov.in/tilecache/tilecache.py?'; //Service URL
	var layers = viewer.scene.globe.imageryLayers;
    layers.removeAll();
    layers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
		//proxy : new Cesium.DefaultProxy('proxy.php'),
        url : url,        
        layers: 'bhuvan_imagery'
    }));*/

/////////////////////////////////////////////////////////////////////////////////
	(function() {
	var OGCHelper = {};
	var intersectionRectangle=function(rectangle0,rectangle1){
		var west = Math.max(rectangle0.west, rectangle1.west);
		var east = Math.min(rectangle0.east, rectangle1.east);
		var south = Math.max(rectangle0.south, rectangle1.south);
		var north = Math.min(rectangle0.north, rectangle1.north);
		var resultat;
		if ((east <= west)||(south >= north)) {
			resultat=undefined;
		}else{
			resultat=new Cesium.Rectangle(west, south, east, north);
		}
		return resultat;
	};
	/**
	 * static array where CRS availables for OGCHelper are defined
	 */
	 OGCHelper.CRS = [ {
	 	name : "CRS:84",
	 	ellipsoid : Cesium.Ellipsoid.WGS84,
	 	firstAxeIsLatitude : false,
	 	tilingScheme : Cesium.GeographicTilingScheme,
	 	supportedCRS:"urn:ogc:def:crs:OGC:2:84"
	 }, {
	 	name : "EPSG:4326",
	 	ellipsoid : Cesium.Ellipsoid.WGS84,
	 	firstAxeIsLatitude : true,
	 	tilingScheme : Cesium.GeographicTilingScheme,
	 	SupportedCRS:"urn:ogc:def:crs:EPSG::4326"
	 }, {
	 	name : "EPSG:3857",
	 	ellipsoid : Cesium.Ellipsoid.WGS84,
	 	firstAxeIsLatitude : false,
	 	tilingScheme : Cesium.WebMercatorTilingScheme,
	 	SupportedCRS: "urn:ogc:def:crs:EPSG::3857"
	 }, {
	 	name : "OSGEO:41001",
	 	ellipsoid : Cesium.Ellipsoid.WGS84,
	 	firstAxeIsLatitude : false,
	 	tilingScheme : Cesium.WebMercatorTilingScheme,
	 	SupportedCRS: "urn:ogc:def:crs:EPSG::3857"
	 } ];

	/**
	 * static array where image formats available for OGCHelper are
	 * defined
	 */
	 OGCHelper.FormatImage = [ {
	 	format : "image/png",
	 	extension: "png"
	 }, {
	 	format : "image/jpeg",
	 	extension: "jpg"
	 }, {
	 	format : "image/jpeg",
	 	extension: "jpeg"
	 }, {
	 	format : "image/gif",
	 	extension: "gif"
	 }, {
	 	format : "image/png; mode=8bit",
	 	extension: "png"
	 } ];

	/**
	 * static array where data array availables for OGCHelper are defined
	 */
	 OGCHelper.FormatArray = [ {
	 	format : "image/bil",
		/**
		* bufferIn : buffer to process (switch byte order and check the data limitations)
		* size: defines the dimension of the array (size.height* size.width cells)
		* highest: defines the highest altitude (without offset) of the data. 
		* lowest: defines the lowest altitude (without offset) of the data. 
		* offset: defines the offset of the data in order adjust the limitations
		*/
		postProcessArray : function(bufferIn, size,highest,lowest,offset) {
			var resultat;
			var viewerIn = new DataView(bufferIn);
			var littleEndianBuffer = new ArrayBuffer(size.height * size.width * 2);
			var viewerOut = new DataView(littleEndianBuffer);
			if (littleEndianBuffer.byteLength === bufferIn.byteLength) {
				// time to switch bytes!!
				var temp, goodCell = 0, somme = 0;
				for (var i = 0; i < littleEndianBuffer.byteLength; i += 2) {
					temp = viewerIn.getInt16(i, false)-offset;
					if (temp > lowest && temp < highest) {
						viewerOut.setInt16(i, temp, true);
						somme += temp;
						goodCell++;
					} else {
						var val = (goodCell == 0 ? 1 : somme / goodCell);
						viewerOut.setInt16(i, val, true);
					}
				}
				resultat = new Int16Array(littleEndianBuffer);
			}
			return resultat;
		}
	} ];

	OGCHelper.WMSParser={};
	OGCHelper.TMSParser={};
	OGCHelper.WMTSParser={};
	/**
	 * parse wms,TMS or WMTS url from an url and a layer. request metadata information on server.
	 * 
	 * 
	 * @param {String}
	 *            description.layerName the name of the layer.
	 * @param {String}
	 *            [description.url] The URL of the server providing wms.
	 * @param {String}
	 *            [description.xml] the xml after requesting "getCapabilities"
	 *            from web map server.
	 * @param {String}
	 *            [description.service] the type of service requested (WMS,TMS,WMTS). WMS is default
	 *            from web map server.
	 * @param {Object}
	 *            [description.proxy] A proxy to use for requests. This object
	 *            is expected to have a getURL function which returns the
	 *            proxied URL, if needed.
	 * @param {Number}
	 *            [description.heightMapWidth] width  of a tile in pixels
	 * @param {Number}
	 *            [description.heightMapHeight] height of a tile in pixels
	 * @param {Number}
	 *            [description.offset] offset of the tiles (in meters)
	 * @param {Number}
	 *            [description.highest] highest altitude in the tiles (in meters)
	 * @param {Number}
	 *            [description.lowest] lowest altitude in the tiles (in meters)
	 * @param {String}
	 *            [description.styleName] name of the Style used for images.
	 * @param {boolean}
	 *            [description.hasStyledImage] indicates if the requested images are styled with SLD
	 * @param {Boolean}
	 *            [description.waterMask] indicates if a water mask will be
	 *            displayed (experimental)
	 * @param {Number}
	 *            [description.maxLevel] maximum level to request
	 * @param {Object}
	 *            [description.formatImage] see OGCHelper.FormatImage
	 * @param {Object}
	 *            [description.formatArray] see OGCHelper.FormatArray
	 * return a promise with:
	 *	- ready : boolean which indicates that the parsing didn't have issue
	 *	- [URLtemplateImage]: function which takes in parameters x,y,level and return the good URL template to request an image
	 *	- [URLtemplateArray]: function which takes in parameters x,y,level and return the good URL template to request an typedArray
	 *	- highest: integer indicates the highest elevation of the terrain provider
	 *	- lowest: integer indicates the lowest elevation of the terrain provider
	 *	- offset: integer indicates the offset of the terrain
	 *	- hasStyledImage: boolean indicates if the images use a style (change the offset)
	 *	- heightMapWidth: integer with of the hightMapTerrain
	 *	- heightMapHeight: integer height of the hightMapTerrain
	 *	- waterMask: boolean indicates if a water mask should be used
	 *	- getTileDataAvailable: function determines whether data for a tile is available to be loaded
	 *	- tilingScheme: the tiling scheme to use
	 *	- [imageSize]: {width:integer, height:integer} dimension of the requested images
	 */
	 OGCHelper.parser=function(description){
	 	var resultat;
	 	description = Cesium.defaultValue(description,
	 		Cesium.defaultValue.EMPTY_OBJECT);
	 	switch(description.service){
	 		case "TMS":
	 		resultat=OGCHelper.TMSParser.generate(description);
	 		break;
	 		case "WMTS":
	 		resultat=OGCHelper.WMTSParser.generate(description);
	 		break;
	 		default: resultat=OGCHelper.WMSParser.generate(description);
	 	}
	 	return resultat;
	 }

	 OGCHelper.WMSParser.generate=function(description){
	 	var resultat;
	 	description = Cesium.defaultValue(description,
	 		Cesium.defaultValue.EMPTY_OBJECT);
	 	if (Cesium.defined(description.url)) {
	 		var urlofServer=description.url;
	 		var index=urlofServer.lastIndexOf("?");
	 		if(index>-1){
	 			urlofServer=urlofServer.substring(0,index);
	 		}
            alert(urlofServer);
	 		var urlGetCapabilities = urlofServer
	 		+ '?SERVICE=WMS&REQUEST=GetCapabilities&tiled=true';
	 		if (Cesium.defined(description.proxy)) {
	 			urlGetCapabilities = description.proxy.getURL(urlGetCapabilities);
	 		}
	 		resultat=Cesium.when(Cesium.loadXML(urlGetCapabilities), function(xml) {
	 			return OGCHelper.WMSParser.getMetaDatafromXML(xml, description);
	 		});
	 	} else if (Cesium.defined(description.xml)) {
	 		resultat=OGCHelper.WMSParser.getMetaDatafromXML(description.xml, description);
	 	}else{
	 		throw new Cesium.DeveloperError(
	 			'either description.url or description.xml are required.');
	 	}
	 	return resultat;
	 };

	 OGCHelper.WMSParser.getMetaDatafromXML = function(xml, description) {
	 	if (!(xml instanceof XMLDocument)) {
	 		throw new Cesium.DeveloperError('xml must be a XMLDocument');
	 	}
		// get version of wms 1.1.X or 1.3.X=> for 1.3 use firstAxe for order of
		// CRS
		if (!Cesium.defined(description.layerName)) {
			throw new Cesium.DeveloperError(
				'description.layerName is required.');
		}
		var resultat={};
		var layerName = description.layerName;
		var maxLevel = Cesium.defaultValue(description.maxLevel, 11);
		var version = undefined;
		resultat.heightMapWidth = Cesium.defaultValue(description.heightMapWidth,65);
		resultat.heightMapHeight = Cesium.defaultValue(description.heightMapHeight,resultat.heightMapWidth);
		var requestedSize={width:65,height:65};
		var CRS = undefined;
		resultat.formatImage = description.formatImage;
		resultat.formatArray = description.formatArray;
		resultat.tilingScheme = undefined;
		var firstAxeIsLatitude = undefined;
		var isNewVersion = undefined;
		resultat.ready = false;
		resultat.levelZeroMaximumGeometricError = undefined;
		resultat.waterMask = Cesium.defaultValue(description.waterMask, false);
		if (typeof (resultat.waterMask) != "boolean") {
			resultat.waterMask = false;
		}
		resultat.offset=Cesium.defaultValue(description.offset,0);
		resultat.highest=Cesium.defaultValue(description.highest,12000);
		resultat.lowest=Cesium.defaultValue(description.lowest,-500);
		var styleName = description.styleName;
		resultat.hasStyledImage=Cesium.defaultValue(description.hasStyledImage,typeof(description.styleName)==="string");
		// get version
		var versionNode = xml.querySelector("[version]");
		if (versionNode !== null) {
			version = versionNode.getAttribute("version");
			isNewVersion = /^1\.[3-9]\./.test(version);
		}

		var url=xml.querySelector("Request>GetMap OnlineResource").getAttribute("xlink:href");
		var index=url.indexOf("?");
		if(index>-1){
			url=url.substring(0,index);
		}
		if (Cesium.defined(description.proxy)) {
			url = description.proxy.getURL(url);
		}

		// get list of map format
		var nodeFormats = xml.querySelectorAll("Request>GetMap>Format");

		if (!Cesium.defined(resultat.formatImage)) {
			for(var j=0;j<nodeFormats.length && !Cesium.defined(resultat.formatArray);j++){
				var OGCAvailables=OGCHelper.FormatArray.filter(function(elt){
					return elt.format===nodeFormats[j].textContent;
				});
				if(OGCAvailables.length>0){
					resultat.formatArray=OGCAvailables[0];
				}
			}
		}
		if (Cesium.defined(resultat.formatArray)
			&& typeof (resultat.formatArray.format) === "string"
			&& typeof (resultat.formatArray.postProcessArray) === "function") {
			resultat.formatArray.terrainDataStructure = {
				heightScale : 1.0,
				heightOffset : 0,
				elementsPerHeight : 1,
				stride : 1,
				elementMultiplier : 256.0,
				isBigEndian : false
			};
		} else {
			resultat.formatArray = undefined;
		}
		// a formatImage should always exist !!
		for(var j=0;j<nodeFormats.length && !Cesium.defined(resultat.formatImage);j++){
			var OGCAvailables=OGCHelper.FormatImage.filter(function(elt){
				return elt.format===nodeFormats[j].textContent;
			});
			if(OGCAvailables.length>0){
				resultat.formatImage=OGCAvailables[0];
			}
		}
		if (Cesium.defined(resultat.formatImage)
			&& typeof (resultat.formatImage.format) === "string") {
			resultat.formatImage.terrainDataStructure = {
				heightScale : 1.0,
				heightOffset : 0,
				elementsPerHeight : 2,
				stride : 4,
				elementMultiplier : 256.0,
				isBigEndian : true
			};
		} else {
			resultat.formatImage = undefined;
		}
		var layerNodes = xml
		.querySelectorAll("Layer[queryable='1'],Layer[queryable='true']");
		var layerNode;
		for (var m = 0; m < layerNodes.length && !Cesium.defined(layerNode); m++) {
			if (layerNodes[m].querySelector("Name").textContent === layerName) {
				layerNode = layerNodes[m];
				var fixedHeight=layerNode.getAttribute("fixedHeight");
				var fixedWidth=layerNode.getAttribute("fixedWidth");
				if(Cesium.defined(fixedHeight)){
					fixedHeight=parseInt(fixedHeight);
					resultat.heightMapHeight=fixedHeight>0&&fixedHeight<resultat.heightMapHeight?fixedHeight:resultat.heightMapHeight;
					requestedSize.height=fixedHeight>0?fixedHeight:requestedSize.height;
				}
				if(Cesium.defined(fixedWidth)){
					fixedWidth=parseInt(fixedWidth);
					resultat.heightMapWidth=fixedWidth>0&&fixedWidth<resultat.heightMapWidth?fixedWidth:resultat.heightMapWidth;
					requestedSize.width=fixedWidth>0?fixedWidth:requestedSize.width;
				}
			}
		}

		if (Cesium.defined(layerNode) && Cesium.defined(version)) {
			var found = false;
			for (var n = 0; n < OGCHelper.CRS.length && !found; n++) {
				var CRSSelected = OGCHelper.CRS[n];
				var referentialName = CRSSelected.name;
				var nodeBBox = layerNode.querySelector("BoundingBox[SRS='"
					+ referentialName + "'],BoundingBox[CRS='"
					+ referentialName + "']");

				if (nodeBBox !== null) {
					CRS = referentialName;
					firstAxeIsLatitude = CRSSelected.firstAxeIsLatitude;
					resultat.tilingScheme = new CRSSelected.tilingScheme({
						ellipsoid : CRSSelected.ellipsoid
					});

					var west,east,south,north;
					if(firstAxeIsLatitude && isNewVersion){
						west=parseFloat(nodeBBox.getAttribute("miny"));
						east=parseFloat(nodeBBox.getAttribute("maxy"));
						south=parseFloat(nodeBBox.getAttribute("minx"));
						north=parseFloat(nodeBBox.getAttribute("maxx"));
					}else{
						west=parseFloat(nodeBBox.getAttribute("minx"));
						east=parseFloat(nodeBBox.getAttribute("maxx"));
						south=parseFloat(nodeBBox.getAttribute("miny"));
						north=parseFloat(nodeBBox.getAttribute("maxy"));
					}
					var rectReference=new Cesium.Rectangle(west,south,east,north);
					resultat.getTileDataAvailable = function(x, y, level){
						var retour=false;
						var rectangleCalcul = resultat.tilingScheme.tileXYToNativeRectangle(x, y,level);
						if(level<maxLevel){
							var scratchRectangle=intersectionRectangle(rectReference, rectangleCalcul);
							retour= Cesium.defined(scratchRectangle);
						}
						return retour;
					};
					found = true;
				}
			}
			// style défini et existant?
			if(Cesium.defined(styleName)){
				var styleNodes = layerNode.querySelectorAll("Style>Name");
				var styleFound = false;
				for (var z = 0; z < styleNodes.length && !styleFound; z++) {
					if (styleName === styleNodes[z].textContent) {
						styleFound = true;
					}
				}
				if (!styleFound) {
					styleName = undefined;
				}
			}
			//changer resolution height et width si existence de tileset dans le xml!!
			var tileSets=xml.querySelectorAll("VendorSpecificCapabilities>TileSet");
			var out=false;
			for (var q=0;q<tileSets.length&&!out;q++){
				var isGoodSRS=tileSets[q].querySelector("BoundingBox[SRS='"
					+ CRS + "'],BoundingBox[CRS='"
					+ CRS + "']")!==null;
				var isGoodLayer=tileSets[q].querySelector("Layers").textContent=== layerName;
				if(isGoodLayer&&isGoodSRS){
					requestedSize.width=parseInt(tileSets[q].querySelector("Width").textContent);
					requestedSize.height=parseInt(tileSets[q].querySelector("Height").textContent);
					out=true;
				}
			}

			resultat.ready = found
			&& (Cesium.defined(resultat.formatImage) || Cesium.defined(resultat.formatArray))
			&& Cesium.defined(version);
		}
       // url = "http://localhost:8080/geoserver/gwc/service/wms"
		if(resultat.ready){
			var URLtemplate=url+'?SERVICE=WMS&REQUEST=GetMap&layers='+ layerName + '&version=' + version+'&bbox=';
			if(isNewVersion && firstAxeIsLatitude){
				URLtemplate+='{south},{west},{north},{east}';
			}else{
				URLtemplate+='{west},{south},{east},{north}';
			}
			URLtemplate+='&crs='+CRS+'&srs='+CRS;

			if(resultat.formatImage){
				var URLtemplateImage=URLtemplate+'&format=' + resultat.formatImage.format+'&width='+ requestedSize.width +'&height=' + requestedSize.height;
				if (Cesium.defined(styleName)) {
					URLtemplateImage += "&styles=" + styleName+ "&style="+ styleName;
				}
				resultat.URLtemplateImage=function(){return URLtemplateImage;};
				resultat.imageSize=requestedSize;
			}

			if(resultat.formatArray){
				var URLtemplateArray=URLtemplate+ '&format=' +resultat.formatArray.format+ '&width='
				+ resultat.heightMapWidth + '&height=' + resultat.heightMapHeight;
				resultat.URLtemplateArray=function(){return URLtemplateArray;};
			}
		}
		return resultat;
	};

	OGCHelper.TMSParser.generate=function(description){
		var resultat;
		description = Cesium.defaultValue(description,
			Cesium.defaultValue.EMPTY_OBJECT);
		if (Cesium.defined(description.url)) {
			resultat=Cesium.loadXML(description.url).then(function(xml){return OGCHelper.TMSParser.parseXML(xml,description);});
		} else if (Cesium.defined(description.xml)) {
			resultat=OGCHelper.TMSParser.parseXML(description.xml,description);
		}else{
			throw new Cesium.DeveloperError(
				'either description.url or description.xml are required.');
		}
		return resultat;
	};

	OGCHelper.TMSParser.parseXML=function(xml,description){
		if (!(xml instanceof XMLDocument)) {
			throw new Cesium.DeveloperError('xml must be a XMLDocument');
		}
		var resultat;
		//description of a tile map service or of a tile map?
		if(xml.querySelector("TileMapService")!=null){
			if (!Cesium.defined(description.layerName)) {
				throw new Cesium.DeveloperError('layerName is required.');
			}
			var mapServiceNodes=[].slice.apply(xml.querySelectorAll("TileMap[title='"+description.layerName+"']"));
			var promises=mapServiceNodes.map(function(elt){
				var url=elt.getAttribute("href");
				if(Cesium.defined(description.proxy)){
					url=description.proxy.getURL(url);
				}
				return Cesium.when(Cesium.loadXML(url),function(xml){
					return OGCHelper.TMSParser.getMetaDatafromXML(xml,description);
				});
			});
			var promise=Cesium.when.all(promises).then(function(tabResult){
				var retour;
				for(var i=0;i<tabResult.length&&!Cesium.defined(retour);i++){
					if(Cesium.defined(tabResult[i])){
						retour=tabResult[i];
					}
				}
				return retour;
			});
			resultat=promise.then(function(retour){return retour;});
		}else{
			resultat=OGCHelper.TMSParser.getMetaDatafromXML(xml,description);
		}
		return resultat;
	};

	OGCHelper.TMSParser.getMetaDatafromXML=function(xml,description){
		var resultat={};
		resultat.ready = false;
		resultat.heightMapWidth = Cesium.defaultValue(description.heightMapWidth,65);
		resultat.heightMapHeight = Cesium.defaultValue(description.heightMapHeight,resultat.heightMapWidth);
		var maxLevel = Cesium.defaultValue(description.maxLevel, 11);
		var proxy=description.proxy;
		resultat.hasStyledImage=Cesium.defaultValue(description.hasStyledImage,typeof(description.styleName)==="string");
		resultat.waterMask=Cesium.defaultValue(description.waterMask, false);
		if (typeof (resultat.waterMask) != "boolean") {
			resultat.waterMask = false;
		}
		resultat.offset=Cesium.defaultValue(description.offset,0);
		resultat.highest=Cesium.defaultValue(description.highest,12000);
		resultat.lowest=Cesium.defaultValue(description.lowest,-500);

		var srs=xml.querySelector("SRS").textContent;
		var goodCRS=OGCHelper.CRS.filter(function(elt){
			return elt.name===srs;
		});
		if(goodCRS.length>0){
			resultat.tilingScheme = new goodCRS[0].tilingScheme({
				ellipsoid : goodCRS[0].ellipsoid
			});
		}

		var format=xml.querySelector("TileFormat");
		var goodFormatImage=OGCHelper.FormatImage.filter(function(elt){
			return elt.extension==format.getAttribute("extension");
		});
		if(goodFormatImage.length>0){
			resultat.formatImage = goodFormatImage[0];
			resultat.imageSize={};
			resultat.imageSize.width=parseInt(format.getAttribute("width"));
			resultat.imageSize.height=parseInt(format.getAttribute("height"));
		}

		var tilsetsNode=[].slice.call(xml.querySelectorAll("TileSets>TileSet"));
		var tileSets=[];

		if(Cesium.defined(resultat.formatImage)){
			tileSets=tilsetsNode.map(function(tileSet){
				var url=tileSet.getAttribute("href")+"/{x}/{tmsY}."+resultat.formatImage.extension;
				if(Cesium.defined(proxy)){
					url=proxy.getURL(url);
				}
				var level=parseInt(tileSet.getAttribute("order"));
				return {url:url,level:level};
			});
			tileSets.sort(function(a,b){
				return a.level-b.level;
			});
			if(tileSets.length>0){
				resultat.tileSets=tileSets;
			}
		}

		if(!Cesium.defined(resultat.tileSets)||!Cesium.defined(resultat.formatImage)||!Cesium.defined(resultat.tilingScheme)){
			resultat=undefined;
		}else{
			resultat.URLtemplateImage=function(x,y,level){
				var retour="";
				if(level<tileSets.length){
					retour=tileSets[level].url;
				}
				return retour;
			}
			var boundingBoxNode=xml.querySelector("BoundingBox");
			var miny=parseFloat(boundingBoxNode.getAttribute("miny"));
			var maxy=parseFloat(boundingBoxNode.getAttribute("maxy"));
			var minx=parseFloat(boundingBoxNode.getAttribute("minx"));
			var maxx=parseFloat(boundingBoxNode.getAttribute("maxx"));
			var limites=new Cesium.Rectangle(minx,miny,maxx,maxy);
			resultat.getTileDataAvailable=function(x,y,level){
				var rect= resultat.tilingScheme.tileXYToNativeRectangle(x, y,level);
				var scratchRectangle=intersectionRectangle(limites, rect);
				return Cesium.defined(scratchRectangle) && level<maxLevel && level<tileSets.length;
			}
			resultat.ready=true;
		}
		return resultat;
	};
////////////////////////////////////////////////////////////
	OGCHelper.WMTSParser.generate=function(description){
		description = Cesium.defaultValue(description,
			Cesium.defaultValue.EMPTY_OBJECT);
		var resultat;
		if (Cesium.defined(description.url)) {
			var urlofServer=description.url;
			var index=urlofServer.lastIndexOf("?");
			if(index>-1){
				urlofServer=urlofServer.substring(0,index);
			}
			var urlGetCapabilities = urlofServer
			+ '?REQUEST=GetCapabilities';
			if (Cesium.defined(description.proxy)) {
				urlGetCapabilities = description.proxy.getURL(urlGetCapabilities);
			}
			resultat=Cesium.loadXML(urlGetCapabilities).then(function(xml){return OGCHelper.WMTSParser.getMetaDatafromXML(xml,description);});
		} else if (Cesium.defined(description.xml)) {
			resultat=OGCHelper.WMTSParser.getMetaDatafromXML(description.xml,description);
		}else{
			throw new Cesium.DeveloperError(
				'either description.url or description.xml are required.');
		}
       // console.log (description);
     //  console.log (resultat);
		return resultat;
	};

	OGCHelper.WMTSParser.getMetaDatafromXML = function(xml,description){
		if (!(xml instanceof XMLDocument)) {
			throw new Cesium.DeveloperError('xml must be a XMLDocument');
		}

		var resultat={};
		var layerName = description.layerName;
		resultat.ready = false;
		resultat.heightMapWidth = Cesium.defaultValue(description.heightMapWidth,65);
		resultat.heightMapHeight = Cesium.defaultValue(description.heightMapHeight,resultat.heightMapWidth);
		var maxLevel = Cesium.defaultValue(description.maxLevel, 12);
		var proxy=description.proxy;
		var styleName = description.styleName;
		resultat.hasStyledImage=Cesium.defaultValue(description.hasStyledImage,typeof(description.styleName)==="string");
		resultat.waterMask=Cesium.defaultValue(description.waterMask, false);
		if (typeof (resultat.waterMask) != "boolean") {
			resultat.waterMask = false;
		}
		resultat.offset=Cesium.defaultValue(description.offset,0);
		resultat.highest=Cesium.defaultValue(description.highest,12000);
		resultat.lowest=Cesium.defaultValue(description.lowest,-500);
		var template;
		var listTileMatrixSetLinkNode=[];

		var urlKVP,urlRESTful;
		var formatImage;
		//KVP support for now
		var nodesGetOperation=[].slice.call(xml.querySelectorAll('Operation[name="GetTile"] HTTP Get'));
		var correctEncoding=nodesGetOperation.map(function(elt){
			var val=elt.querySelector("Value").textContent;
			var retour;
			if("KVP"===val){
				retour={node:elt,type:"KVP"};
			}
			if("RESTful"===val){
				retour={node:elt,type:"RESTful"};
			}
			return retour;
		}).filter(function(elt){
			return Cesium.defined(elt);
		});

		for(var i=0;i<correctEncoding.length;i++){
			var node=correctEncoding[i];
			if(node.type==="RESTful" && !Cesium.defined(urlRESTful)){
				urlRESTful=node.node.getAttribute("xlink:href");
				if (Cesium.defined(proxy)) {
					urlRESTful = proxy.getURL(urlRESTful);
				}
			}
			if(node.type==="KVP" && !Cesium.defined(urlKVP)){
				urlKVP=node.node.getAttribute("xlink:href");
				if (Cesium.defined(proxy)) {
					urlKVP = proxy.getURL(urlKVP);
				}
			}
		}

		var nodeIdentifiers=xml.querySelectorAll("Contents>Layer>Identifier");
		var layerNode;
		for (var i = 0; i < nodeIdentifiers.length && !Cesium.defined(layerNode); i++) {
			if(layerName===nodeIdentifiers[i].textContent){
				layerNode=nodeIdentifiers[i].parentNode;
			}
		}

		if(Cesium.defined(layerNode)){
			//optionality of style in geoserver is not compliant with OGC rules!!
			var styleNodes=layerNode.querySelectorAll("Style");
			var defaultStyle;
			var selectedStyle;
			
			for (var i = 0; i < styleNodes.length; i++) {
				var style=styleNodes[i].querySelector("Identifier").textContent;
				if(styleNodes[i].getAttribute("isDefault")!=null){
					defaultStyle=style;
				}
				if(style===styleName){
					selectedStyle=style;
				}
			}
			//Work with attribute isDefault when no style was defined!!
			if(!Cesium.defined(styleName) || styleName!=selectedStyle){
				styleName=Cesium.defaultValue(defaultStyle,"");
			}

			//format
			var nodeFormats=[].slice.call(layerNode.querySelectorAll("Format"));
			for (var l = 0; l < OGCHelper.FormatImage.length
				&& !Cesium.defined(formatImage); l++) {
				var validFormats=nodeFormats.filter(function(elt){
					return elt.textContent === OGCHelper.FormatImage[l].format;
				});
			if(validFormats.length>0){
				formatImage = OGCHelper.FormatImage[l];
                //console.log("format image:",formatImage);
			}
		}
			//TileMatrixSetLink =>TileMatrixSet
			listTileMatrixSetLinkNode=layerNode.querySelectorAll("TileMatrixSetLink");
		}

		var nodeMatrixSetIds=[].slice.call(xml.querySelectorAll("TileMatrixSet>Identifier"));
		for(var a=0;a<listTileMatrixSetLinkNode.length && !resultat.ready;a++){
			var matrixSetLinkNode=listTileMatrixSetLinkNode[a];
			var tileMatrixSetLinkName=matrixSetLinkNode.querySelector("TileMatrixSet").textContent;
			var tileMatrixSetNode;
			var CRSSelected;

			for (var i = 0; i < nodeMatrixSetIds.length && !Cesium.defined(tileMatrixSetNode); i++) {
				if(nodeMatrixSetIds[i].textContent===tileMatrixSetLinkName){
					tileMatrixSetNode=nodeMatrixSetIds[i].parentNode;
				} 
			}

			var supportedCRS=tileMatrixSetNode.querySelector("SupportedCRS").textContent;
			for (var n = 0; n < OGCHelper.CRS.length && !Cesium.defined(CRSSelected); n++) {
				if(OGCHelper.CRS[n].SupportedCRS===supportedCRS){
					CRSSelected = OGCHelper.CRS[n];
				}
			}
			
			if(Cesium.defined(CRSSelected)){
				var tileSets;
				
				var nodeTileSets=[].slice.call(tileMatrixSetNode.querySelectorAll("TileMatrix"));
				tileSets=nodeTileSets.map(function(noeud){
					var id=noeud.querySelector("Identifier").textContent;
					var maxWidth=parseInt(noeud.querySelector("MatrixWidth").textContent);
					var maxHeight=parseInt(noeud.querySelector("MatrixHeight").textContent);
					var tileWidth=parseInt(noeud.querySelector("TileWidth").textContent);
					var tileHeight=parseInt(noeud.querySelector("TileHeight").textContent);
					var scaleDenominator=parseFloat(noeud.querySelector("ScaleDenominator").textContent);
					return {id:id,maxWidth:maxWidth,maxHeight:maxHeight,scaleDenominator:scaleDenominator,complete:false,
						tileWidth:tileWidth,tileHeight:tileHeight};
					});

				tileSets.sort(function(a,b){
					return b.scaleDenominator-a.scaleDenominator;
				});
				listTileMatrixLimits=matrixSetLinkNode.querySelectorAll("TileMatrixSetLimits>TileMatrixLimits");
				for(var t=0;t<tileSets.length;t++){
					var tile=tileSets[t];
					for(var w=0;w<listTileMatrixLimits.length;w++){
						var nodeLink=listTileMatrixLimits[w];
						if(tile.id===nodeLink.querySelector("TileMatrix").textContent){
							tile.minTileRow=parseInt(nodeLink.querySelector("MinTileRow").textContent);
							tile.maxTileRow=parseInt(nodeLink.querySelector("MaxTileRow").textContent);
							tile.minTileCol=parseInt(nodeLink.querySelector("MinTileCol").textContent);
							tile.maxTileCol=parseInt(nodeLink.querySelector("MaxTileCol").textContent);
							tile.complete=true;
							tileSets[t]=tile;
						}
					}
				}

				if(tileSets.length>0){
					resultat.tilingScheme = new CRSSelected.tilingScheme({
						ellipsoid : CRSSelected.ellipsoid,
						numberOfLevelZeroTilesX:tileSets[0].maxWidth,
						numberOfLevelZeroTilesY:tileSets[0].maxHeight});
					var resourceURL=layerNode.querySelector("ResourceURL[format='"+formatImage.format+"']");

					if(resourceURL!=null){
						template=resourceURL.getAttribute("template").replace("{TileRow}","{y}").replace("{TileCol}","{x}").replace("{Style}",styleName).
						replace("{TileMatrixSet}",tileMatrixSetLinkName).replace("{layer}",layerName).replace("{infoFormatExtension}",formatImage.extension);
					}else if(Cesium.defined(urlKVP)){
                 //alert(urlKVP);
						template=urlKVP+"service=WMTS&request=GetTile&version=1.0.0&layer="+layerName+"&style=&"+styleName+"format="+formatImage.format+"&TileMatrixSet="+tileMatrixSetLinkName+"&TileMatrix={TileMatrix}&TileRow={y}&TileCol={x}"
					}
					
					if(Cesium.defined(template)){
						resultat.getTileDataAvailable=function(x,y,level){
							var retour=false;
							if(level<maxLevel && level<tileSets.length){
								var tile=tileSets[level];
								if(tile.complete){
									retour= (y<=tile.maxTileRow && y>=tile.minTileRow) && (x<=tile.maxTileCol && x>=tile.minTileCol);
								}else{
									retour= x<tile.maxWidth && y<tile.maxHeight;
								}
							}
							return retour;
						};
						resultat.URLtemplateImage=function(x,y,level){
							var retour="";
							if(resultat.getTileDataAvailable(x,y,level)){
								var tile=tileSets[level];
								retour=template.replace("{TileMatrix}",tile.id);
							}
							return retour;
						};

						var imageSize={width:tileSets[0].tileWidth,height:tileSets[0].tileHeight};
						var checkSize=tileSets.filter(function(elt){
							return elt.tileWidth!=imageSize.width || elt.tileHeight!=imageSize.height;
						});
						if(checkSize.length==0){
							resultat.imageSize=imageSize;
						}
						resultat.ready=true;
					}
				}
				
			}
		}
		return resultat;
	};

	/**
	 * A {@link TerrainProvider} that produces geometry by tessellating height
	 * maps retrieved from a geoserver terrain server.
	 * 
	 * @alias GeoserverTerrainProvider
	 * @constructor
	 * 
	 * @param {String}
	 *            description.url The URL of the geoserver terrain server.
	 * @param {String}
	 *            description.layerName The layers to include, separated by
	 *            commas.
	 * @param {Proxy}
	 *            [description.proxy] A proxy to use for requests. This object
	 *            is expected to have a getURL function which returns the
	 *            proxied URL, if needed.
	 * @param {Credit|String}
	 *            [description.credit] A credit for the data source, which is
	 *            displayed on the canvas.
	 * @param {Number}
	 *            [description.heightMapWidth] width and height of the tiles
	 * @param {Number}
	 *            [description.maxLevel] max level of tiles
	 * @param {String}
	 *            [description.service] type of service to use (WMS, TMS or WMTS) 
	 * @param {String}
	 *            [description.xml] the xml after requesting "getCapabilities".
	 * @see TerrainProvider
	 */
	 var GeoserverTerrainProvider = function GeoserverTerrainProvider(
	 	description) {
	 	if (!Cesium.defined(description)) {
	 		throw new Cesium.DeveloperError('description is required.');
	 	}
	 	var errorEvent = new Cesium.Event();

	 	var credit = description.credit;
	 	if (typeof credit === 'string') {
	 		credit = new Cesium.Credit(credit);
	 	}

	 	this.ready=false;
	 	this._readyPromise = Cesium.when.defer();

	 	Cesium.defineProperties(this, {
	 		errorEvent : {
	 			get : function() {
	 				return errorEvent;
	 			}
	 		},
	 		credit : {
	 			get : function() {
	 				return credit;
	 			}
	 		},
	 		hasVertexNormals : {
	 			get : function() {
	 				return false;
	 			}
	 		},
	        /**
         * Gets a promise that resolves to true when the provider is ready for use.
         * @memberof CesiumTerrainProvider.prototype
         * @type {Promise.<Boolean>}
         * @readonly
         */
         readyPromise : {
         	get : function() {
         		return this._readyPromise.promise;
         	}
         }
     });
	 	var promise=OGCHelper.parser(description);
	 	TerrainParser(promise,this);
	 };
	/**
	*
	* arrayBuffer: 	the arrayBuffer to process to have a HeightmapTerrainData
	* limitations: 	object which defines highest (limitations.highest), lowest (limitations.lowest) altitudes 
	* 			   	and the offset (limitations.offset) of the terrain.
	* size: 		number defining the height and width of the tile (can be a int or an object with two attributs: height and width)
	* formatArray: 	object which defines the terrainDataStructure (formatArray.terrainDataStructure) and 
	* 			   	the postProcessArray (formatArray.postProcessArray)
	* hasWaterMask: boolean to indicate to generate a waterMask
	* childrenMask: Number defining the childrenMask
	*
	*/
	GeoserverTerrainProvider.arrayToHeightmapTerrainData=function(arrayBuffer,limitations,size,formatArray,hasWaterMask,childrenMask){
		if(typeof(size)=="number"){
			size={width:size,height:size};
		}
		var heightBuffer = formatArray.postProcessArray(arrayBuffer,size,limitations.highest,limitations.lowest,
			limitations.offset);
		if (!Cesium.defined(heightBuffer)) {
			throw new Cesium.DeveloperError("no good size");
		}
		var optionsHeihtmapTerrainData={
			buffer : heightBuffer,
			width : size.width,
			height : size.height,
			childTileMask : childrenMask,
			structure : formatArray.terrainDataStructure
		};
		if(hasWaterMask){
			var waterMask = new Uint8Array(
				heightBuffer.length);
			for (var i = 0; i < heightBuffer.length; i++) {
				if (heightBuffer[i] <= 0) {
					waterMask[i] = 255;
				}
			}
			optionsHeihtmapTerrainData.waterMask=waterMask;
		}
		return new Cesium.HeightmapTerrainData(optionsHeihtmapTerrainData);
	};

/**
	*
	* image: 					the image to process to have a HeightmapTerrainData
	* limitations: 				object which defines highest (limitations.highest), lowest (limitations.lowest) altitudes 
	* 			   				and the offset (limitations.offset) of the terrain. The style defined in mySLD use an offset of 32768 meters
	* size: 					number defining the height and width of the tile
	* hasWaterMask: 			boolean to indicate to generate a waterMask
	* childrenMask: 			Number defining the childrenMask
	*/
	GeoserverTerrainProvider.imageToHeightmapTerrainData=function(image,limitations,size,hasWaterMask,childrenMask,hasStyledImage){
		if(typeof(size)=="number"){
			size={width:size,height:size};
		}
		var dataPixels = Cesium.getImagePixels(image,size.width,size.height);
		var waterMask = new Uint8Array(dataPixels.length / 4);
		var buffer = new Int16Array(dataPixels.length / 4);
		var goodCell = 0, somme = 0;
		for (var i = 0; i < dataPixels.length; i += 4) {
			var msb=dataPixels[i];
			var lsb=dataPixels[i+1];
			var isCorrect=dataPixels[i+2]>128;
			var valeur = (msb<< 8 | lsb) - limitations.offset-32768;
			if (valeur > limitations.lowest && valeur < limitations.highest && (isCorrect||hasStyledImage)) {
				buffer[i / 4] = valeur;
				somme += valeur;
				goodCell++;
			} else {
				buffer[i / 4] = (goodCell == 0 ? 0 : somme / goodCell);
				//buffer[i / 4] = 0;
			}
		}

		var optionsHeihtmapTerrainData={
			buffer : buffer,
			width : size.width,
			height : size.height,
			childTileMask : childrenMask,
			structure : {heightScale : 1.0,
				heightOffset : 0.0,
				elementsPerHeight : 1,
				stride : 1,
				elementMultiplier : 256.0,
				isBigEndian : false}
			};

			if(hasWaterMask){
				var waterMask = new Uint8Array(buffer.length);
				for(var i = 0; i < buffer.length; i++){
					if(buffer[i]<=0){
						waterMask[i] = 255;
					}
				}
				optionsHeihtmapTerrainData.waterMask = waterMask;
			}
			return new Cesium.HeightmapTerrainData(optionsHeihtmapTerrainData);
		};

		function TerrainParser(promise,provider){
			Cesium.when(promise,function(resultat){
				//console.log(resultat);
				if(Cesium.defined(resultat)&&(resultat.ready)){
					resultat.levelZeroMaximumGeometricError = Cesium.TerrainProvider.getEstimatedLevelZeroGeometricErrorForAHeightmap(
						resultat.tilingScheme.ellipsoid, resultat.heightMapWidth,
						resultat.tilingScheme.getNumberOfXTilesAtLevel(0));
					if(Cesium.defined(resultat.URLtemplateImage)){
						resultat.getHeightmapTerrainDataImage=function(x,y,level){
							var retour;
							if(!isNaN(x+y+level)){
								var urlArray=templateToURL(resultat.URLtemplateImage(x,y,level),x, y, level,provider);
								var limitations={highest:resultat.highest,lowest:resultat.lowest,offset:resultat.offset};
								var hasChildren = terrainChildrenMask(x, y, level,provider);
								var promise = Cesium.throttleRequestByServer(urlArray,Cesium.loadImage);
								if (Cesium.defined(promise)) {
									retour = Cesium.when(promise,function(image){
										return GeoserverTerrainProvider.imageToHeightmapTerrainData(image,limitations,
											{width:resultat.heightMapWidth,height:resultat.heightMapHeight},resultat.waterMask,hasChildren,resultat.hasStyledImage);
									}).otherwise(function(){
										return new Cesium.HeightmapTerrainData({
											buffer : new Uint16Array(
												resultat.heightMapWidth
												* resultat.heightMapHeight),
											width : resultat.heightMapWidth,
											height : resultat.heightMapHeight,
											childTileMask : hasChildren,
											waterMask : new Uint8Array(resultat.heightMapWidth
												* resultat.heightMapHeight),
											structure : resultat.formatImage.terrainDataStructure
										});
									});}
								}
								return retour;
							};
						}

						if(Cesium.defined(resultat.URLtemplateArray)){
							resultat.getHeightmapTerrainDataArray=function(x, y, level){
								var retour;
								if(!isNaN(x+y+level)){
									var urlArray=templateToURL(resultat.URLtemplateArray(x,y,level),x, y, level,provider);
									var limitations={highest:resultat.highest,lowest:resultat.lowest,offset:resultat.offset};
									var hasChildren = terrainChildrenMask(x, y, level,provider);

									var promise = Cesium.throttleRequestByServer(urlArray,Cesium.loadArrayBuffer);
									if (Cesium.defined(promise)) {
										retour = Cesium.when(promise,
											function(arrayBuffer) {
												return GeoserverTerrainProvider.arrayToHeightmapTerrainData(arrayBuffer,limitations,
													{width:resultat.heightMapWidth,height:resultat.heightMapHeight},resultat.formatArray,resultat.waterMask,hasChildren);
											}
											).otherwise(
											function() {
												if (Cesium.defined(resultat.getHeightmapTerrainDataImage)) {
													return resultat.getHeightmapTerrainDataImage(x, y, level);
												}else{
													return new Cesium.HeightmapTerrainData({
														buffer : new Uint16Array(
															resultat.heightMapWidth
															* resultat.heightMapHeight),
														width : resultat.heightMapWidth,
														height : resultat.heightMapHeight,
														childTileMask : hasChildren,
														waterMask : new Uint8Array(resultat.heightMapWidth
															* resultat.heightMapHeight),
														structure : resultat.formatImage.terrainDataStructure
													});
												}
											});
										}

									}
									return retour;
								};
							}

							provider.getLevelMaximumGeometricError=function(level){
								return resultat.levelZeroMaximumGeometricError/ (1 << level);
							};

							provider.requestTileGeometry=function(x, y, level){
								var retour;
								if(Cesium.defined(resultat.getHeightmapTerrainDataArray)){
									retour=resultat.getHeightmapTerrainDataArray(x, y, level);
								}else if(Cesium.defined(resultat.getHeightmapTerrainDataImage)){
									retour=resultat.getHeightmapTerrainDataImage(x, y, level);
								}
								return retour;
							}

							Cesium.defineProperties(provider, {
								tilingScheme : {
									get : function() {
										return resultat.tilingScheme ;
									}
								},
								ready : {
									get : function() {
										return resultat.ready;
									}
								},
								hasWaterMask : {
									get : function() {
										return resultat.waterMask;
									}
								},
								heightMapHeight : {
									get : function() {
										return resultat.heightMapHeight;
									}
								},
								heightMapWidth : {
									get : function() {
										return resultat.heightMapWidth;
									}
								},
								getTileDataAvailable: {
									get : function() {
										return resultat.getTileDataAvailable;
									}
								}
							});
						}
						provider._readyPromise.resolve(resultat.ready);
					});
}

function templateToURL(urlParam,x,y,level,provider){
	var rect= provider.tilingScheme.tileXYToNativeRectangle(x, y,level);
	var xSpacing = (rect.east - rect.west)/ (provider.heightMapWidth - 1);
	var ySpacing = (rect.north - rect.south)/ (provider.heightMapHeight - 1);
	rect.west -= xSpacing * 0.5;
	rect.east += xSpacing * 0.5;
	rect.south -= ySpacing * 0.5;
	rect.north += ySpacing * 0.5;

	var yTiles = provider.tilingScheme.getNumberOfYTilesAtLevel(level);
	var tmsY = (yTiles - y - 1);

	return urlParam.replace("{south}",rect.south).replace("{north}",rect.north).replace("{west}",rect.west)
	.replace("{east}",rect.east).replace("{x}",x).replace("{y}",y).replace("{tmsY}",tmsY);
}

function terrainChildrenMask(x, y, level,provider){
	var mask=0;
	var childLevel = level + 1;
	mask |= provider.getTileDataAvailable( 2 * x, 2 * y,childLevel) ? 1 : 0;
	mask |= provider.getTileDataAvailable( 2 * x + 1, 2 * y,childLevel) ? 2 : 0;
	mask |= provider.getTileDataAvailable( 2 * x, 2 * y + 1,childLevel) ? 4 : 0;
	mask |= provider.getTileDataAvailable( 2 * x + 1, 2 * y + 1,childLevel) ? 8 : 0;
	return mask;
}

Cesium.GeoserverTerrainProvider = GeoserverTerrainProvider;
})();	
		
/////////////////////////////////////////////////////////////////////////////////		
	// LOAD TERRAIN
    //alert("hello");
	var terrainProvider = new Cesium.GeoserverTerrainProvider({
	//var terrainProvider = new Cesium.CesiumTerrainProvider({
		//proxy : new Cesium.DefaultProxy('proxy.php'),
		//service : "WMTS",
        //url : "http://localhost:8080/geoserver/gwc/service/wmts",
        url : "http://localhost:8080/geoserver/elevation/wms",
		//url : '//assets.agi.com/stk-terrain/world',
		//requestWaterMask : true,
		//requestVertexNormals : true,
		//url : 'http://localhost/cgi-bin/proxy.cgi',
        //layerName: "SRTM_1km",
		layerName: "srtm_global_90m_tiled",
        //layerName: "elevation:srtm_global_90m_translated",
        //layerName: "srtm_global_90m_translated"
		//hasStyledImage: false,
		//styleName:"grayToColor",
        //waterMask:true
        //service : "WMTS",
        //url : "http://localhost:8080/geoserver/gwc/service/wmts",
		//layerName: "elevation:srtm_global_90m_tiled",
    });
	
	
	viewer.terrainProvider = terrainProvider;	
	
	
	
//////////////////////////////////////////////////////////////////////////////////	
	//var ps=new Cesium.Cartographic.fromDegrees(78.3352765625, 21.173860625, 6900000);
	viewer.scene.camera.setView({
		destination : Cesium.Cartesian3.fromDegrees(78.3352765625, 21.173860625, 6900000)
	});
////////////////////////////////////////////////////////////////////////////////// BUTTONS
	$('#IV').click(function() {
	initialView();
	
	});
	$('#TP').click(function() {
	choose_pts();
	
	});
   /* $('#View_graph').click(function() {
	show_terrain_profile();
	
	});*/
    /*$('#lighting').click(function() {
	lighting();
	
	});*/
    $('#rem').click(function() {
	remove_all();
	
	});
//////////////////////////////////////////////////////////////////////////////////	


	function initialView() {
		scene.camera.flyTo({
			destination : Cesium.Cartesian3.fromDegrees(78.3352765625, 21.173860625, 6900000)
		});
	}
//////////////////////////////////////////////////////////////////////////////////	
	function choose_pts(){	
        try {
            if (handler.isDestroyed()==false){handler.destroy();}}
        catch(err){}
        handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        $(function() {
            $( "#dialog2" ).dialog({
                  dialogClass: "no-close",
                  position: { my : "left centre" , at: "left centre" ,of: window },
                  buttons: [
                    {
                      text: "CANCEL",
                      click: function() {
                        if (handler.isDestroyed()==false){handler.destroy();}
                        remove_all();
                        $( this ).dialog( "close" );
                      }
                    },
                    {
                      text: "SUBMIT",
                      click: function() {
                        if (latlong_carto.length>=2)
                        {
                            show_terrain_profile();
                            //document.getElementById("View_graph").style.visibility = "visible";
                            $( this ).dialog( "close" );
                        } else{
                            document.getElementById("demo1").innerHTML = "Please choose at least 2 or more points first";
                            //remove_all();
                            viewer.entities.removeAll();
                        }
                      }
                    }
                    
                  ] , height:'auto',width:'auto'
                });
        });
		latlong_carto = [];
        id_poly = 0;
        id_point = 0;
        var pt_pos = document.getElementById("demo1");
        pt_pos.innerHTML = "";
		//Disable depth testing so choosen points are properly visible.
		viewer.scene.globe.depthTestAgainstTerrain = false;
			handler.setInputAction(function (movement) {
			var pickRay = viewer.scene.camera.getPickRay(movement.position);
			var cartesian = viewer.scene.globe.pick(pickRay, viewer.scene);
            
			if (cartesian) {
					var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                    pt_pos.innerHTML = pt_pos.innerHTML + "<br>" + Cesium.Math.toDegrees(cartographic.longitude).toFixed(2) + ",\t" + Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);
					//console.log(Cesium.Math.toDegrees(cartographic.longitude),Cesium.Math.toDegrees(cartographic.latitude));
					latlong_carto.push(cartographic);
                    id_point += 1;
					viewer.entities.add({
                        id : "pt"+id_point,
						position : cartesian,
						point : {
							pixelSize : 15,
							color : Cesium.Color.RED
							
						}
					});
					if (latlong_carto.length>=2) {
					    LINE_DRAWN = false;
						CLICKED = true;	
					}						
				} 
		}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        return;
	}		

////////////////////////////////////////////////////////////////////////////////////////////////	
		
    function show_terrain_profile(){
        if (handler.isDestroyed()==false){handler.destroy();}
        // Dialog for sampling distance
        if(CLICKED == true && latlong_carto.length>1) {
            $(function() {
            
            $( "#dialog1" ).dialog({
                  dialogClass: "no-close",
                  buttons: [
                    {
                      text: "CANCEL",
                      click: function() {
                        remove_all();
                        $( this ).dialog( "close" );
                      }
                    },
                    {
                      text: "SUBMIT",
                      click: function()	{
                        SAMPLE_DIST = Number(document.getElementById("sample_dist").value);
                        show();
                        $( this ).dialog( "close" );
                      }
                    }
                  ] , height:'200',width:'500',modal:true
                });
    
            });
        } else {show();}
        
        function submit() {
            SAMPLE_DIST = Number(document.getElementById("sample_dist").value);
        }
        
        
        
        
        function show() {
        
            // Dialog box of the graph
            $(function() {
                $( "#dialog" ).dialog({
                      dialogClass: "no-close",
                      buttons: [
                        {
                          text: "CLOSE",
                          click: function() {
                            remove_all();
                            $( this ).dialog( "close" );
                          }
                        },
                        {
                          text: "Download data as text file",
                          click: function()	{
                            //dld();
                            download("Terrain_Profile.txt",DOWNLOAD_DATA);
                          }
                        }
                      ] , height:'auto',width:'auto',modal:false
                    });
            });
            
            if(CLICKED==true && latlong_carto.length>1) {
                //ROUND+=1;   //no of times terrain profile graphs
                //Make heights of all to 0 to be able to use Cesium.Cartesian3.distance
                for(i=0;i<=latlong_carto.length - 1;i++){
                    latlong_carto[i].height = 0;
                }
                
                
                
                //Find all the points
                var count = 0;
                dist=0;
                dist_arr = [0];
                ht = [];
                inter_pts = [];
                
                for(i=1;i<=latlong_carto.length-1;i++){
                
                    samples = new Cesium.EllipsoidGeodesic(latlong_carto[i-1],latlong_carto[i],ellipsoid);    //Geodesic path between selected points
                    var fraction = parseInt((samples._distance)/SAMPLE_DIST)-1;
                    //console.log(fraction);

                    //Interpolate points using geodesic surface distance
                    var j=1;
                    while(j<=fraction){
                       inter_pts[count+j] = samples.interpolateUsingSurfaceDistance(SAMPLE_DIST*j);
                       ht[count+j] = viewer.scene.globe.getHeight(inter_pts[count+j]);
                       j++;
                    }
                    if(count==0){         // To push the starting point in inter_pts since this will be used only once
                        inter_pts[count] = samples._start;
                        ht[count] = viewer.scene.globe.getHeight(inter_pts[count]);

                    }	
                    inter_pts.push(samples._end);
                    ht.push(viewer.scene.globe.getHeight(inter_pts[inter_pts.length-1]));

                    for(k=1;k<=fraction+1;k++){
                            dist = dist + ((Cesium.Cartesian3.distance(Cesium.Cartesian3.fromRadians(inter_pts[count+k-1].longitude,inter_pts[count+k-1].latitude),Cesium.Cartesian3.fromRadians(inter_pts[count+k].longitude,inter_pts[count+k].latitude)))/1000);
                            dist_arr[count+k] = dist;	
                    }
                    count = count + fraction + 1;
                }
                CLICKED = false;
                //Prepare Data for plotting and downloading				
                p_ht_arr = [];
                p_dist_arr = [];
                p_lat_arr = [];
                p_lon_arr = [];
                for(ii=0;ii<=inter_pts.length-1;ii++) {
                        p_lat = Cesium.Math.toDegrees(inter_pts[ii].latitude);
                        p_lon = Cesium.Math.toDegrees(inter_pts[ii].longitude);
                        p_ht = ht[ii];
                        p_dist = dist_arr[ii];
                        if(typeof p_lat != 'undefined' && typeof p_lon != 'undefined' && typeof p_ht != 'undefined' && typeof p_dist != 'undefined'){
                            p_lat_arr.push(p_lat);
                            p_lon_arr.push(p_lon);
                            p_ht_arr.push(p_ht);
                            p_dist_arr.push(p_dist);
                        }
                }
                
                    //debugger;
                    for (pp=0;pp<=p_lat_arr.length-3;pp++){
                        id_poly += 1;
                        viewer.entities.add({
                            id : "poly"+id_poly,
                            polyline : {
                                positions : Cesium.Cartesian3.fromDegreesArrayHeights([p_lon_arr[pp], p_lat_arr[pp],p_ht_arr[pp],
                                                                                p_lon_arr[pp+1], p_lat_arr[pp+1],p_ht_arr[pp+1]]),
                                width : 10,
                                material : new Cesium.PolylineGlowMaterialProperty({
                                    glowPower : 0.2,
                                    color : Cesium.Color.BLUE
                                })
                            }
                        });
                    
                    }
                    
                    
                    //Enable depth testing so things behind the terrain disappear.
                    viewer.scene.globe.depthTestAgainstTerrain = true;
                
                 //Plot the terrain profile
                var TESTER = document.getElementById('tester');
                    //Plotly.plot( TESTER, [{
                    Plotly.newPlot( TESTER, [{
                    x: p_dist_arr,
                    y: p_ht_arr }], {
                    margin: { t: 0 },
                    xaxis:{title:'Distance in km'},
                    yaxis:{title:'Altitude in meters'} }
                    
                    );

                

                
               // DOWNLOAD_DATA = DOWNLOAD_DATA + "\r\n\n\n\nSelection - " + ROUND + "\r\nSN  Location             " + "           Altitude " + " Distance along path from origin(in km)";
               DOWNLOAD_DATA = "\r\nSN  Location             " + "           Altitude " + " Distance along path from origin(in km)";
                for(aa=0;aa<=p_lat_arr.length-1;aa++) {
                    p_lat_arr[aa] = p_lat_arr[aa].toFixed(5);
                    p_lon_arr[aa] = p_lon_arr[aa].toFixed(5);
                    p_ht_arr[aa] = p_ht_arr[aa].toFixed(2);
                    p_dist_arr[aa] = p_dist_arr[aa].toFixed(2);
                    DOWNLOAD_DATA = DOWNLOAD_DATA + "\r\n" + (aa+1) + "   Lat: " + p_lat_arr[aa] + "," + "  Lon: " + p_lon_arr[aa] + "   " + p_ht_arr[aa] + "   " + p_dist_arr[aa];
                }							
            }
            
            if (latlong_carto.length==1){
                    alert("Please choose at least 2 points first");
            } 
              
            // Download 1)Heights 2)Distances from original points, and 3)All the point locations
            function download(filename, text) {
              var element = document.createElement('a');
              element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
              element.setAttribute('download', filename);

              element.style.display = 'none';
              document.body.appendChild(element);

              element.click();

              document.body.removeChild(element);
            }
            
            dist=0;
            dist_arr = [0];
            ht = [];
            //inter_pts = new Array();
            inter_pts = [];
            latlong_carto=[] //new
        }	
        
                
        
    }

///////////////////////////////////////////////////////////////////////////////////////////////////////////		

    function lighting(){
        viewer.scene.globe.enableLighting = !viewer.scene.globe.enableLighting;
    }

/////////////////////////////////////////////////////////////////////////////////////	
	function remove_all(){ 
        if(id_point!=0){
            for(xx=1;xx<=id_point;xx++){
                viewer.entities.removeById("pt"+xx);
            }
        }    
        if(id_poly!=0){
            for(yy=1;yy<=id_poly;yy++){
                viewer.entities.removeById("poly"+yy);
            }
        }    
        latlong_carto = [];
	}
//////////////////////////////////////////////////////////////////////////////////// test


/////////////////////////////////////////////////////////////////////////////////////	
  });
}); 