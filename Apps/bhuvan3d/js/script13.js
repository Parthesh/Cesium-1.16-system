  var viewer = null;
    require(['jquery','Cesium'], function(jQuery,Cesium) {
    "use strict";
    require(['jquery-ui'], function() {
    "use strict";
    
    viewer = new Cesium.Viewer('cesiumContainer',{
		imageryProvider : new Cesium.WebMapServiceImageryProvider({
			url : 'http://bhuvan3.nrsc.gov.in/tilecache/tilecache.py?',
			//url : 'http://bhuvannuis.nrsc.gov.in/bhuvan/gwc/service/wms?',
			layers: 'bhuvan_imagery',
            enablePickFeatures: false
			//layers : 'india3'
			//proxy : new Cesium.DefaultProxy('proxy.php') 
        }),
        baseLayerPicker : false
    });
    //var viewer = new Cesium.Viewer('cesiumContainer');
	var scene = viewer.scene;
	//var canvas = document.getElementById('cesiumContainer');
	var ellipsoid = viewer.scene.globe.ellipsoid;
    var entity;
    var latlong_carto;
    var CLICKED = false;  // Whether user has CLICKED on Choose points before going for Terrain Profile
	var ROUND = 0;
	var DOWNLOAD_DATA = "";
	var SAMPLE_DIST;
	var handler; //make handler global to avoid creating entities at every click even after terrain profile is shown
    document.getElementById("View_graph").style.visibility = "hidden";
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
		
		
		
	// LOAD TERRAIN
	var terrainProvider = new Cesium.GeoserverTerrainProvider({
	//var terrainProvider = new Cesium.CesiumTerrainProvider({
		//proxy : new Cesium.DefaultProxy('proxy.php'),
		service : "WMTS",
        url : "http://localhost:8080/geoserver/gwc/service/wmts",
        //url : "http://localhost:8080/geoserver/elevation/wms",
		//url : '//assets.agi.com/stk-terrain/world',
		//requestWaterMask : true,
		//requestVertexNormals : true,
		//url : 'http://localhost/cgi-bin/proxy.cgi',
        //layerName: "SRTM_1km",
		//layerName: "srtm_global_90m_tiled",
        layerName: "elevation:srtm_global_90m_translated"
		//hasStyledImage: false,
		//styleName:"grayToColor",
        //waterMask:false
        //service : "WMTS",
        //url : "http://localhost:8080/geoserver/gwc/service/wmts",
		//layerName: "elevation:srtm_global_90m_tiled",
    });
	
	
	viewer.terrainProvider = terrainProvider;	
	
	
	
//////////////////////////////////////////////////////////////////////////////////	
	//var ps=new Cesium.Cartographic.fromDegrees(78.3352765625, 21.173860625, 6900000);
	viewer.camera.setView({
		destination : Cesium.Cartesian3.fromDegrees(78.3352765625, 21.173860625, 6900000)
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
                        $( this ).dialog( "close" );
                      }
                    },
                    {
                      text: "SUBMIT",
                      click: function() {
                        if (latlong_carto.length>=2)
                        {
                            show_terrain_profile();
                            document.getElementById("View_graph").style.visibility = "visible";
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
        var pt_pos = document.getElementById("demo1");
        pt_pos.innerHTML = "";
		//Disable depth testing so choosen points are properly visible.
		viewer.scene.globe.depthTestAgainstTerrain = false;
			handler.setInputAction(function (movement) {
			var pickRay = viewer.scene.camera.getPickRay(movement.position);
			var cartesian = viewer.scene.globe.pick(pickRay, viewer.scene);
			if (cartesian) {
					var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                    pt_pos.innerHTML = pt_pos.innerHTML + "<br>" + Cesium.Math.toDegrees(cartographic.longitude) + ",\t" + Cesium.Math.toDegrees(cartographic.latitude);
					console.log(Cesium.Math.toDegrees(cartographic.longitude),Cesium.Math.toDegrees(cartographic.latitude));
					latlong_carto.push(cartographic);
					viewer.entities.add({

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
                 // dialogClass: "alert",
                  buttons: [
                    {
                      text: "CANCEL",
                      click: function() {
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
                          text: "OK",
                          click: function() {
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
                      ] , height:'auto',width:'auto',modal:true
                    });
            });
            
            if(CLICKED==true && latlong_carto.length>1) {
                ROUND+=1;   //no of times terrain profile graphs
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
                    console.log(fraction);

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
                        viewer.entities.add({
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
                    Plotly.plot( TESTER, [{
                    x: p_dist_arr,
                    y: p_ht_arr }], {
                    margin: { t: 0 },
                    xaxis:{title:'Distance in km'},
                    yaxis:{title:'Altitude in meters'} }
                    
                    );

                

                
                DOWNLOAD_DATA = DOWNLOAD_DATA + "\r\n\n\n\nSelection - " + ROUND + "\r\nSN  Location             " + "           Altitude " + " Distance along path from origin(in km)";
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
            
        }	
        
                
        
    }

///////////////////////////////////////////////////////////////////////////////////////////////////////////		

    function lighting(){
        viewer.scene.globe.enableLighting = !viewer.scene.globe.enableLighting;
    }

/////////////////////////////////////////////////////////////////////////////////////	
	function remove_all(){ 
		viewer.entities.removeAll();
		viewer.dataSources.removeAll();
        viewer.trackedEntity = undefined;
        latlong_carto = [];
	}
/////////////////////////////////////////////////////////////////////////////////////	
   });
   });