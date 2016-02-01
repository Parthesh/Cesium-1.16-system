<?php
$db = pg_connect('host=10.71.1.99 dbname=bhuvanlulc user=postgres password=admin'); 
ini_set("display_errors","Off");
if (!$db) {
    die('Something went wrong while connecting to pgSQL');
}
 
 $q=pg_escape_string(ucwords(strtolower($_GET["q"])));
 if (strlen($q)>0)
 {
	$query = "select distinct name, ST_X(the_geom) as LON, ST_Y(the_geom) as LAT, dist, state  from place_names050813 WHERE name LIKE '";
	$query .=$q;
	$query .="' ORDER BY name ASC";
    //echo $query."<br/>";
	
	$result = pg_query($query);
	$numRows = pg_num_rows($result);
	if($numRows ){
		echo "<table id='ga'  >";
		$i=0;$j=0;
		while(($i)<10 && $row = pg_fetch_assoc($result))
		{
	
			echo "<tr>";
				echo "<td id='find".$j."' style='cursor:pointer' onmouseout= \"this.style.color='black';\"  onmouseover=\"this.style.color='blue';\">" . $row['name'] ."," . ucwords(strtolower($row['dist'])) .", " . ucwords(strtolower($row['state'])) ."</td>"; 
				
				//echo "<script>";
				//echo "('#find".$j."').click(function() { zoom_in(".$row['lon'].",".$row['lat'].",50000)});	</script>";
				//echo "</tr>";
				echo "<td id='findtry".$j."'  style='display:none'   >".$row['lat'].",".$row['lon']."</td>";
				
				//$j=$j+1; 
				$j=$j+1;
				$i=$i+1; 
		}
		echo "<tr><td id='searchnum' style='display:none'>".$i."</td></tr>";
		echo "</table>";
	}
	else
	{
	$query = "select distinct name, ST_X(the_geom) as LON, ST_Y(the_geom) as LAT, dist, state  from place_names050813 WHERE name LIKE '%";
	$query .=$q;
	$query .="%' ORDER BY name ASC";
    //echo $query."<br/>";
	
	$result = pg_query($query);
	$numRows = pg_num_rows($result);
	if($numRows ){
		echo "<table id='ga'  >";
		$i=0;$j=0;
		while(($i)<10 && $row = pg_fetch_assoc($result))
		{
	
			echo "<tr>";
				echo "<td id='find".$j."' style='cursor:pointer' onmouseout= \"this.style.color='black';\"  onmouseover=\"this.style.color='blue';\">" . $row['name'] ."," . ucwords(strtolower($row['dist'])) .", " . ucwords(strtolower($row['state'])) ."</td>"; 
				
				//echo "<script>";
				//echo "('#find".$j."').click(function() { zoom_in(".$row['lon'].",".$row['lat'].",50000)});	</script>";
				//echo "</tr>";
				echo "<td id='findtry".$j."'  style='display:none'   >".$row['lat'].",".$row['lon']."</td>";
				
				//$j=$j+1; 
				$j=$j+1;
				$i=$i+1; 
		}
		echo "<tr><td id='searchnum' style='display:none'>".$i."</td></tr>";
		echo "</table>";
	}
	else
	echo "No Results Found";
	}
 }
 pg_close($db);  
?>
