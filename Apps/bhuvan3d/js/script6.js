var viewer =null;
var layercounter=0; // 0 is the base layer basically
var name_arr = [];
var playcount=0,replaycount=0,playx=[],playy=[],playz=[],playrole=[],playpitch=[],playhdng=[],recordintvl,playintvl;

name_arr.push('base');

require(['jquery','Cesium','jquery-ui'], function(jQuery,Cesium) {
    "use strict";

	  
     viewer = new Cesium.Viewer('cesiumContainer', {
    
	  baseLayerPicker : true,
	 infoBox : false
	  }
	  );
	  
	var layers = viewer.scene.imageryLayers;

	  	
	layers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
        url : 'http://bhuvan.nrsc.gov.in/ogcs/gwc/service/wms',        
        layers: 'vector:city_hq',
		proxy : new Cesium.DefaultProxy('proxy.php')
    }));
	  
	layercounter++;
	name_arr.push('cityhq');
	
	Sandcastle.finishedLoading();
	
	viewer.animation.container.style.display="none";
	viewer.timeline.container.style.display="none";

    var scene = viewer.scene;
	
	var ps=new Cesium.Cartographic.fromDegrees(78.3352765625, 21.173860625, 6900000);
	scene.camera.setView({positionCartographic : ps});


	

	
function makeline(r)
{

 var entity = viewer.entities.add({
  polyline : {
    positions : Cesium.Cartesian3.fromDegreesArray(r),
    width : 8,
    material : new Cesium.PolylineGlowMaterialProperty({
	glowPower : 0.2,
	color : Cesium.Color.BLUE
})
  }
});

}

	
	function zoom_in(lon,lat,elev)
	{
	
  	scene.camera.flyTo({  destination : Cesium.Cartesian3.fromDegrees(lon, lat, elev)   });
	}
	
	
		
	$('#search_button').click(function() {
	find();
	
	});
	
	$('#searchval').bind("enterKey",function(e){
  find();
});
$('#searchval').keyup(function(e){
    if(e.keyCode == 13)
     $(this).trigger("enterKey");
});
	
function find()
{
//zoom_in(77.8833300000297,29.8666700003278,1000);
	var q=$("#searchval").val();
	if(q=="")
	return;
	
	var iChars = "!@#$%^&*()+=[]\\\';/{}|\":<>?";
    for (var i = 0; i <q.length; i++) {
         if (iChars.indexOf(q.charAt(i)) != -1) {
              alert("Please do not give special characters");
            return;
         }
    }
	
	$.ajax({url:"get/search.php?q="+q,success:function(result){
      
   $("#searchdiv").html(result);
   $("#searchdiv").dialog();
   var num=parseInt($("#searchnum").html());
   
	for(var i=0;i<num;i++)
	{
	
	$('#find'+i).click(function() {
var id=this.id.substring(4);
var temp = $("#findtry"+id).html().split(",");

	zoom_in(temp[1],temp[0],7000)});
	}
   
   }});
}
	
	
$("#layers").html(" <input id='chkadminb' type='checkbox' style='float:left' ><label style='float:left'>Administrative Boundaries</label><br/><input id='chktrans' type='checkbox' style='float:left' ><label style='float:left'>Infrastructure (Road & Rail)</label><br/><input id='chkpanchayat' type='checkbox' style='float:left' ><label style='float:left'>Panchayat Boundaries</label><br/><input id='chksubbasin' type='checkbox' style='float:left' ><label style='float:left'>Sub Basin</label><br/><input id='chkbasin' type='checkbox' style='float:left' ><label style='float:left'>Basin</label><br/><input id='chkriver' type='checkbox' style='float:left' ><label style='float:left'>Rivers</label>");	
	var userdbox = $("#addlayers").dialog({
				autoOpen: false,
				resizable: false,
				width: 350,
				close: function () {}				
		});


$('#chktrans').click(function() { 
if(this.checked) loadlayer_gen("infra:road_grouped","bhuvantransportnetwork","http://bhuvannuis.nrsc.gov.in/bhuvan/gwc/service/wms/"); 
else removelayer("bhuvantransportnetwork");
});	

$('#chkadminb').click(function() { 
if(this.checked) loadlayer_gen("basemap:admin_group","bhuvanadminb","http://bhuvannuis.nrsc.gov.in/bhuvan/gwc/service/wms/"); 
else removelayer("bhuvanadminb");
});	

$('#chkpanchayat').click(function() { 
if(this.checked) loadlayer_gen("sde:panchayat","bhuvanpanchayat","http://bhuvan-panchayat.nrsc.gov.in:8080/geoserver/sde/wms"); 
else removelayer("bhuvanpanchayat");
});	

$('#chksubbasin').click(function() { 
if(this.checked) loadlayer_gen("sde:subbasin","bhuvansubbasin","http://bhuvan-panchayat.nrsc.gov.in:8080/geoserver/sde/wms"); 
else removelayer("bhuvansubbasin");
});	

$('#chkbasin').click(function() { 
if(this.checked) loadlayer_gen("sde:basin","bhuvanbasin","http://bhuvan-panchayat.nrsc.gov.in:8080/geoserver/sde/wms"); 
else removelayer("bhuvanbasin");
});	


$('#chkriver').click(function() { 
if(this.checked) loadlayer_gen("sde:river","bhuvanriver","http://bhuvan-panchayat.nrsc.gov.in:8080/geoserver/sde/wms"); 
else removelayer("bhuvanriver");
});	

$('#overlaylayer').click(function() {
	userdbox.dialog("open");
});

function removelayer(name)
{
for (var i=0;i<name_arr.length;i++)
{
if(name_arr[i]==name)
layers.get(i).show=false;
}
}


function loadlayer_gen(layername,displayname,url1)
{
var layer1= new Cesium.WebMapServiceImageryProvider({
        url : url1,        
        layers: layername// Here just give layer name
		,proxy : new Cesium.DefaultProxy('proxy.php')
    })
layers.addImageryProvider(layer1);
layercounter++;
name_arr.push(displayname);
}
var modelbox=null;
$('#models').click(function() {
if(modelbox==null)
{
modelbox = $("#modeldiv").dialog({
				autoOpen: false,
				resizable: false,
				width: 450,
				position: [300,125],
				close: function () {}				
		});
modelbox.load("get/model.php",function(response,status){
      if (status=="success")
      {
	 
	  $('#modelopt').change(function(){
if(this.value=="" || this.value=="Select")
{
$("#modeldesc").html("");
return;
}
loadmodel(this.value,true);
  
});	


 $('#citymodelopt').change(function(){
if(this.value=="" || this.value=="Select")
{
$("#modeldesc").html("");
return;
}
modelbnglr(this.value,true);
  
});	



$('#modelremoveall').click(function() {
 scene.primitives.removeAll();// Remove previous all models
 $("#modeldesc").html("");
});	

}});
}
modelbox.dialog("open");	
});	

$('.cesium-viewer-bottom ').attr('style', 'left:0');

var userdbox = $("#addlayers").dialog({
				autoOpen: false,
				resizable: false,
				width: 350,
				position: [200,125],
				close: function () {}				
		});

function modelbnglr(value) {
var t=value.split("#");
var cityname=t[0];
scene.primitives.removeAll();
var htm="";
var mnum=0;
$("#modelopt option").each(function()
{
var str=$(this).text();
var txt=$(this).val();

    if (str.toLowerCase().indexOf(cityname.toLowerCase()) >= 0) 
	{
	var val = ($(this).val()).split("_#_");
	
	if(val[7]==1) //Only onload models will be loaded
	{
	loadmodel($(this).val(),false);
	htm=htm+"<span id='modelfind"+mnum+"' style='cursor:pointer;color:blue'>" +str.replace(","+cityname,"")+"</span><span id='modelfindtry"+mnum+"'  style='display:none'   >"+$(this).val()+"</span><br/>"; }
	else
	htm=htm+"<span id='modelfind"+mnum+"' style='cursor:pointer'   onclick=\"this.style.color='blue';\">" +str.replace(","+cityname,"")+"</span><span id='modelfindtry"+mnum+"'  style='display:none'   >"+$(this).val()+"</span><br/>";
	mnum=mnum+1;
	}
});
zoom_in(parseFloat(t[1]), parseFloat(t[2]), parseInt(t[3]));


if(htm!="")
{
$("#modeldesc").html("<span id='modelsearchnum' style='display:none'>"+mnum+"</span><u>Following 3D Models are available </u><br/>"+htm);

var num=parseInt($("#modelsearchnum").html());
for(var i=0;i<num;i++)
{

$('#modelfind'+i).click(function() { 
var id=this.id.substring(9);

var temp = $("#modelfindtry"+id).html().split("_#_");
if(temp[7]==0) //No onload models will be loaded now
loadmodel($("#modelfindtry"+id).html(),false);

zoom_in(parseFloat(temp[1]),parseFloat(temp[0]),parseInt(temp[6])+200)});
}
}

}
		
function loadmodel(values,flag)
{

  var val = values.split("_#_");
	  var th=parseFloat(val[6])+100;
if(flag)
{
zoom_in(val[1],val[0],th);
$("#modeldesc").html(val[4]);
}

var  height = Cesium.defaultValue(  parseFloat(val[6]), 0.0);
var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(val[1],val[0],height));
 
	 //scene.primitives.removeAll(); 
var model = scene.primitives.add(Cesium.Model.fromGltf({
	url : 'models/'+val[2]+'.gltf',
    modelMatrix : modelMatrix,
    scale : parseFloat(val[5])
 
}));
}		


function load_video(name,video,tit,w,h) {

    $(function() {
        $(name).dialog({
	        autoOpen: false,
			resizable: false,
	        width: w,
	        height: h,
			position: [300,125],
			close: function () {  },
			zIndex: 3000,
	        title: tit
		  });
          $(name).load(video.replace(/ /g,"%20")).dialog('open');
           
    });
}

//login
$('#alogout').click(function() {
		load_video('#LogoutFrame','loading.php?q=logout.php','Logout','700','700');
		
		reloadlogin_afterlogout();
});
$('#alogin').click(function() {
		load_video('#LoginFrame','loading.php?q=login.php','Login','900','700');
		
		});	

//playback

$('#playback').click(function() {
resetplay();
playintvl = setInterval(function(){ replay() }, 500);
});

$('#startposition').click(function() {
alert("Recording starts Click on Stop button to stop");
resetplay();
playcount=0;playx=[];playy=[];playz=[];playrole=[];playpitch=[];playhdng=[];
recordintvl = setInterval(function(){ record() }, 500);
}); 

$('#stopposition').click(function() {
alert('Stopping recording. Click on Play button to playback');
resetplay();
}); 

function resetplay()
{
if(recordintvl)
clearInterval(recordintvl); 
if(playintvl)
clearInterval(playintvl);
replaycount=0;
}

function record()
{
playcount=playcount+1;
playx.push(scene.camera.position.x);
playy.push(scene.camera.position.y);
playz.push(scene.camera.position.z);
playrole.push(scene.camera.roll);
playpitch.push(scene.camera.pitch);
playhdng.push(scene.camera.heading);
}

function replay()
{
if(playcount>0 && replaycount<playcount)
{
//alert(playx[replaycount]+" y="+playy[replaycount]+" z= "+playz[replaycount]+ " hdng="+playhdng[replaycount]+" pitch="+playpitch[replaycount]+" role="+playrole[replaycount]);
scene.camera.setView({
    position : Cesium.Cartesian3.fromElements(playx[replaycount], playy[replaycount],playz[replaycount]),
    heading : playhdng[replaycount], // east, default value is 0.0 (north)
    pitch : playpitch[replaycount],    // default value (looking down)
    roll : playrole[replaycount]                             // default value
});
replaycount=replaycount+1;
}
else
{
if(playcount>0)
alert("Finished Play Back");
else
alert("No Records to Play.");
clearInterval(playintvl);
}
}


//playback ends

});	

function reloadlogin_afterlogout() {
		bhuvanusername = "empty";
		document.getElementById("loggedindiv").innerHTML = "<b>  Welcome User &nbsp;&nbsp; </b>";
		document.getElementById("alogout").style.display = 'none';
		document.getElementById("alogin").style.display = 'inline';
	$("#LogoutFrame").dialog("close");
			
	}


function reloadlogin() {
		document.getElementById("loggedindiv").innerHTML = "<b>  Welcome " + bhuvanusername + "  &nbsp;&nbsp;  </b>";
		document.getElementById("alogout").style.display = 'inline';
		document.getElementById("alogin").style.display = 'none';
		$("#LoginFrame").dialog("close");
				
	}
