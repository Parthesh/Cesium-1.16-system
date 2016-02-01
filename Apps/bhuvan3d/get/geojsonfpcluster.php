<?php

 header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Tue, 01 Dec 1987 14:20:00 GMT");
 function escapeJsonString($value) { # list from www.json.org: (\b backspace, \f formfeed)
  $escapers = array("\\", "/", "\"", "\n", "\r", "\t", "\x08", "\x0c");
  $replacements = array("\\\\", "\\/", "\\\"", "\\n", "\\r", "\\t", "\\f", "\\b");
  $result = str_replace($escapers, $replacements, $value);
  return $result;
}

	// database stuff
	 define("PG_DB"  , "geoprocess");
	define("PG_HOST", "10.71.1.39");
	define("PG_USER", "postgres");
	define("PG_PORT", "5433");
	define("PG_PWD", "bhuvan@123");
	
	$pgcon = pg_connect("dbname=".PG_DB." host=".PG_HOST." port=".PG_PORT." user=".PG_USER." password=".PG_PWD);
if (!$pgcon) {
    echo "Not connected : " . pg_error();
    exit;
}	
 
  $category=pg_escape_string($_GET["category"]);
  $category_array=split(',',$category);
  $length=count($category_array);
  $category="";
 
  for($i=0;$i<$length-1;++$i)
	  $category=$category.'"'.$category_array[$i].'"+';	
 if($length) 
 $category=$category.'"'.$category_array[$length-1].'"';
 
 //echo $category.'..';
$zoom=$_GET["zoom"];
$sql = "select" .$category." count,st_asgeojson(randgeom) AS geojson from clusterphotos where st_WithIn(geom,ST_GeomFromText('POLYGON((".$_GET["sql"]."))', 4326))and zoom =".$zoom ; 
//echo $sql;
//$sql = "select count,st_asgeojson(randgeom) AS geojson from clustertestrandom where st_WithIn(geom,ST_GeomFromText('POLYGON((".$_GET["sql"]."))', 4326))and zoom =".$zoom ; 


$query = pg_query($pgcon, $sql);
if (!$query) {
    echo "An SQL error occured.\n";
    exit;
}


while ($row = pg_fetch_array($query))
{ 
    $rowOutput = (strlen($rowOutput) > 0 ? ',' : '') . '{"type": "Feature", "geometry": ' . $row['geojson'] . ', "properties": {'; $props = '';   $id    = '';
    foreach ($row as $key => $val) {
        if ($key != "geojson") {
            $props .= (strlen($props) > 0 ? ',' : '') . '"' . $key . '":"' . escapeJsonString($val) . '"';
        }
        if ($key == "id") {
            $id .= ',"id":"' . escapeJsonString($val) . '"';
        }
    }
    
    $rowOutput .= $props . '}';
    $rowOutput .= $id;
    $rowOutput .= '}';
    $output .= $rowOutput;

} 
$output = '{ "type": "FeatureCollection", "features": [ ' . $output . ' ]}';
echo $output;

?> 


