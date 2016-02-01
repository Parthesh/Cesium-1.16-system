<?php
	header ('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
	
	define("PG_DB"  , "bhuvan3d");
	define("PG_HOST", "10.71.1.99");
	define("PG_USER", "postgres");
	define("PG_PORT", "5432");
	define("PG_PWD", "admin");
	ini_set("display_errors","Off");
	$con = pg_connect("dbname=".PG_DB." host=".PG_HOST." user=".PG_USER." password=".PG_PWD);
	if (!$con) {
		die('Something went wrong while connecting to database');
	}
	
		
	echo "<table><tr><td ><span ><b>Select City </b></span></td><td>";
	
	$sql = "SELECT model, filename, img, description, latitude, longitude,scale,height,city,onload  FROM citymodel3d_cesium where status=1 order by 1; ";
	
	$result = pg_query($con,$sql);
	$rows = pg_num_rows($result);
		
	echo "<select name='modelopt' id='modelopt' style='display:none' >";
	echo "<option>Select</option>";
	while($row=pg_fetch_array($result))
	echo "<option value='".$row[4]."_#_".$row[5]."_#_".$row[1]."_#_".$row[2]."_#_".$row[3]."_#_".$row[6]."_#_".$row[7]."_#_".$row[9]."'>".$row[0].",".$row[8]."</option>";
		
	echo "</select>";
	
	$sql = "SELECT distinct city,longitude,latitude,height  FROM city_cesium order by 1; ";
	
	$result = pg_query($con,$sql);
	$rows = pg_num_rows($result);
		
	echo "<select name='citymodelopt' id='citymodelopt' >";
	echo "<option>Select</option>";
	while($row=pg_fetch_array($result))
	echo "<option value='".$row[0]."#".$row[1]."#".$row[2]."#".$row[3]."#"."'>".$row[0]."</option>";
	
	
	echo"</select></td></tr></table>";
	pg_close($con); 
	
?>

<a href="#" id="modelremoveall">Remove All</a> &nbsp;&nbsp; <!--&nbsp;&nbsp;<a href="#" id="modelngpr">Nagpur City</a> -->
<br/><br/>
<div id='modeldesc'></div>

