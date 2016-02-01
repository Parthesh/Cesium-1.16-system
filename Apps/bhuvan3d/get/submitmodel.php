<?php
	include_once('CAS.php');
		phpCAS::setDebug();
		phpCAS::client(CAS_VERSION_2_0,'bhuvan-cas.nrsc.gov.in',80,'cas');
		phpCAS::setNoCasServerValidation();
		phpCAS::forceAuthentication();
		$u=phpCAS::getUser();
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
	
	$i=pg_escape_string($_GET["i"]);
	$n=pg_escape_string($_GET["n"]);
	$lt=floatval($_GET["lt"]);
	$ln=floatval($_GET["ln"]);
	$sc=floatval($_GET["sc"]);
	$h=floatval($_GET["h"]);
	
	$f=pg_escape_string($_GET["f"]);
	  date_default_timezone_set('Asia/Calcutta');
 $d= date('m/d/Y G:i:s');
$ip=$_SERVER['REMOTE_ADDR'];
	
		
	$sql = "INSERT INTO model3d_user(
            model, filename,  description, latitude, longitude, scale, 
            height, dated, ip,username)
    VALUES ('$n', '$f','$i', $lt, $ln, $sc,$h , '$d','$ip','$u')";
	
		

	$result = pg_query($con,$sql);
$tp = pg_affected_rows($result);
if($tp == 1)
echo " <span style='color:green'> <b> Model submitted successfully. </b> </span>\n";
else
echo " <span style='color:red' ><b> Either the model is already submitted or There was an error in submitting.  <b> </span>\n";
	pg_close($con); 
	
?>
<br/>
<div id='modeldesc'></div>
