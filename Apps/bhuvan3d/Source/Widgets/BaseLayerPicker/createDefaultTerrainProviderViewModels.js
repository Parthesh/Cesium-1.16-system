/*global define*/
define([
        '../../Core/buildModuleUrl',
        '../../Core/CesiumTerrainProvider',
        '../../Core/EllipsoidTerrainProvider',
        '../BaseLayerPicker/ProviderViewModel'
    ], function(
        buildModuleUrl,
        CesiumTerrainProvider,
        EllipsoidTerrainProvider,
        ProviderViewModel) {
    "use strict";

    /**
     * @private
     */
    function createDefaultTerrainProviderViewModels() {
        var providerViewModels = [];
          providerViewModels.push(new ProviderViewModel({
            name : 'WGS84 Ellipsoid',
            iconUrl : buildModuleUrl('Widgets/Images/TerrainProviders/Ellipsoid.png'),
            tooltip : 'WGS84 standard ellipsoid, also known as EPSG:4326',
            creationFunction : function() {
                return new EllipsoidTerrainProvider();
            }
        }));

	
		
		/*providerViewModels.push(new ProviderViewModel({
            name : '',//STK World Terrain meshes bhuvan
            iconUrl : buildModuleUrl('Widgets/Images/TerrainProviders/STK.png'),
            tooltip : 'SRTM 90m Terrain',
            creationFunction : function() {
                return new Cesium.GeoserverTerrainProvider({
		proxy : new Cesium.DefaultProxy('proxy.php'),
		//service : "WMTS",
        url : "http://bhuvan.nrsc.gov.in/nuis/global_dem/srtm_global_90m_tiled/ows?",
        layerName: "srtm_global_90m_tiled"
    });
            }
        })); */
		
		
     providerViewModels.push(new ProviderViewModel({
            name : '',//STK World Terrain meshes bhuvan
            iconUrl : buildModuleUrl('Widgets/Images/TerrainProviders/STK.png'),
            tooltip : 'High-resolution, mesh-based terrain for the entire globe. Free for use on the Internet. Closed-network options are available.\nhttp://www.agi.com',
            creationFunction : function() {
                return new CesiumTerrainProvider({
                    url : '//assets.agi.com/stk-terrain/tilesets/world/tiles',
					credit : 'Terrain data courtesy AGI. Powered by Cesium' //bhuvan
                });
            }
        })); 


		
		
		
       /* providerViewModels.push(new ProviderViewModel({
            name : 'Small Terrain heightmaps with water',
            iconUrl : buildModuleUrl('Widgets/Images/TerrainProviders/STK.png'),
            tooltip : 'Medium-resolution, heightmap-based terrain for the entire globe. This tileset also includes a water mask. Free for use on the Internet.\nhttp://www.agi.com',
            creationFunction : function() {
                return new CesiumTerrainProvider({
                    url : '//cesiumjs.org/smallterrain',
                    credit : 'Terrain data courtesy Analytical Graphics, Inc.'
                });
            }
        })); */

        return providerViewModels;
    }

    return createDefaultTerrainProviderViewModels;
});