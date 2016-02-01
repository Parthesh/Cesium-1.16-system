<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">  <!-- Use Chrome Frame in IE -->
    <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
    <meta name="cesium-sandcastle-labels" content="Geometries">
    <title>Bhuvan 3D</title>
	<link rel="stylesheet" href="css/jquery-ui-1.7.2.custom.css" type="text/css">
	<link rel="stylesheet" href="css/style.css" type="text/css">
	
    <script type="text/javascript" src="js/Sandcastle-header.js"></script>
    <script type="text/javascript" src="ThirdParty/requirejs-2.1.9/require.js"></script>
    <script type="text/javascript">
    require.config({
        baseUrl : 'Source',
        waitSeconds : 60
    });
    </script>
</head>
<body class="sandcastle-loading">
<style>
    @import url(css/bucket.css);
  @import url(css/DrawHelper.css);
</style>
<?php
$ref = $_SERVER['HTTP_REFERER'];
$refData = parse_url($ref);
$pos = strrpos($refData['path'], "index.php");
if($pos==false)
{
if($_GET['b'] && $_GET['b'])
header('Location: index.php?l='.$_GET['l'].'&b='.$_GET['b']);
else
header('Location: index.php');

}
?>

<div id="banner">
			<table width="100%" border="0" cellspacing="0" cellpadding="0"  height="60px" bgcolor="#FFFFFF">
				<tr>
					<td width="42%" height="60px" valign="top">
						<a href='http://bhuvan.nrsc.gov.in/bhuvan/'>
							<img border=0  src="img/bhuvan_viewer3t3.png" style='float:left; padding-left:5px;  vertical-align:middle'>
						</a>
					</td>               
					<td width="20%" height="50px" style="font-family:Arial, Helvetica, sans-serif; font-size:18px"><b></b></td>
					<td width="72%" height="60px" valign="top">
						<img border=0  src="img/bhuvan_viewer3t2.png" style='float:right;vertical-align:middle'>
					</td>               
				</tr>
			</table>
			
			<div id="login" style="float:right;display:none">
				
				<div   id="logindiv" style="float:right; padding-top:4px; vertical-align:middle; color:#FFFFFF; font-family:Arial, Helvetica, sans-serif; font-size:11px" > 
					<b>
						<?php if($_SESSION['bhuvanusername']) { ?><a href="#" title="Click here to logout" alt="logout" id="alogout"  style="font-family: Arial; font-size: 11px; color: darkblue">Logout</a> <a href="#" title="Way to portal login" alt="login" id="alogin" style="font-family: Arial; font-size: 11px; color: darkblue;display:none">Login</a> 
						<?php } else { ?> <a href="#" title="Click here to logout" alt="logout" id="alogout"  style="display:none;font-family: Arial; font-size: 11px; color: darkblue">Logout</a><a href="#" title="Way to portal login" alt="login" id="alogin" style="font-family: Arial; font-size: 11px; color: darkblue">Login</a> 
						<?php } ?>
					</b>
				</div>
				
				<div id="loggedindiv" style="float:right; padding-top:4px; vertical-align:middle; font-family: Arial; font-size: 11px; color: darkblue">
					<b>
					   <?php 
							if($_SESSION['bhuvanusername'])
								echo "&nbsp;&nbsp;Welcome&nbsp;".$_SESSION['bhuvanusername']."&nbsp;&nbsp;";
							else
								echo "&nbsp;&nbsp;Welcome User &nbsp;&nbsp;"
					  ?>
					</b>
				</div> 
				
			</div>
			
</div> 


<div id="bannerstrip"  bgcolor="#FFFFFF">
		<table width='100%'>
			<tr bgcolor="#6495ED">
				<td width="300px" height="22px">	
					<div  style="vertical-align:middle; width:300px; height:100%;font-color:white;"> 
						<div id="titlediv" style="float:left;padding-top:4px;vertical-align:middle; width:80px; height:100%;font-family: Arial; font-size: 12px; 
						color: white">
							<b> Bhuvan 3D &nbsp;&nbsp; </b>
						</div>					
						<div>
																		
							<input  type="text" value="" id='searchval' style="color: Gray; font-size:12px;width:160px;" >
							
							<img src="img/searchnew.png" width="18" style="cursor:pointer"  id="search_button" height="15" border="0" /></a>									
						
						</div>
					</div>
					<div id="live"></div>
				</td>
				
				<td colspan="2">					
					<table cellpadding="0px" cellspacing="0px" border="0" style="float:left; padding-top:5px; vertical-align:middle; height:100%;font-family: Arial; font-size: 14px; color: white">
					<tr>
					


</table>
<table cellpadding="0px" cellspacing="0px" border="0" style="float:right; padding-top:2px; vertical-align:middle; height:100%;font-family: Arial; font-size: 14px; color: white">
					<tr>
					

			

	<td>&nbsp;|&nbsp;<b><a title="Click to start Recording" href="#" id="startposition" style="font-family: Arial; font-size: 12px; color: white">Start</a></b></td>
	<td>&nbsp;|&nbsp;<b><a href="#" title="Click to stop recording" id="stopposition" style="font-family: Arial; font-size: 12px; color: white">Stop</a></b></td>
	<td>&nbsp;|&nbsp;<b><a href="#" title="Click to Playback your recording" id="playback" style="font-family: Arial; font-size: 12px; color: white">Play back</a></b></td>

	<td>&nbsp;|&nbsp;<b><a href="#" id="models" style="font-family: Arial; font-size: 12px; color: white">3D Models</a></b></td>
	<td>&nbsp;|&nbsp;<b><a href="#" id="overlaylayer" style="font-family: Arial; font-size: 12px; color: white">Layers</a></b></td>
	
				
					<td>&nbsp;|&nbsp;<b><a href="http://bhuvan-forum.nrsc.gov.in" style="font-family: Arial; font-size: 12px; color: white" target='_blank' >Forum</a></b></td>
					<!--<td>&nbsp;|&nbsp;<b><a href="http://bhuvan3.nrsc.gov.in/bhuvan/help/bhuvan2d_help.html" target="_blank" title="Help" style="font-family: Arial; font-size: 12px; color: white">Help</a></b></td>-->	
					<td>&nbsp;|&nbsp;<b><a href="http://bhuvan.nrsc.gov.in/" target='_blank' style="font-family: Arial; font-size: 12px; color: white">Home</a></b></td>
					</tr>
					</table>
				</td>
			</tr>
		</table>
		</div>
		

		

<div id="cesiumContainer" class="fullSize"></div>
<div id="loadingOverlay"><img  src='img/loading.gif' style='	float: left;	position: fixed;	_position:absolute;	top: 95%; left: 5px;	_top:expression(eval(document.body.scrollTop)+150px);	z-index: 99999;' /> </div>
<div id="toolbar"></div>
<div id="toolbar1">
</div>

<div id="searchdiv"></div>

<!--add layer dialogue div-->
			<div title='ADD Layer' id='addlayers'>
			<span id='clrpicker' style='display:none;'>
			<b>Select Color</b> &nbsp 
			<input id='clr' class='color' title='color picker' style='cursor: pointer; background-image: none; background-color: rgb(102, 255, 0); color: rgb(0, 0, 0);' value='00ff00' size='6'>
			</span>
			<span id='layers'></span>
			</div>
			<!--end-->	
<div id="modeldiv" title="3D Models"></div>			

<img id="ld" src='img/loading.gif' style='	float: left;	position: fixed;	_position:absolute;	top: 95%; left: 5px;	_top:expression(eval(document.body.scrollTop)+150px);	z-index: 99999;' /> 

<div id="LogoutFrame" style="display: none;" ></div>
		<div id="LoginFrame" style="display: none;" ></div>
		


<script id="cesium_sandcastle_script" type="text/javascript" src="js/script12.js"> </script>


<?php
$browser = getBrowser();
function getBrowser()
{
    $u_agent = isset($_SERVER['HTTP_USER_AGENT'])?$_SERVER['HTTP_USER_AGENT']:'';
    $bname = 'Unknown';
    $platform = 'Unknown';
    $version= $ub ="";

    //First get the platform?
    if (preg_match('/linux/i', $u_agent)) {
        $platform = 'linux';
    }
    elseif (preg_match('/macintosh|mac os x/i', $u_agent)) {
        $platform = 'mac';
    }
    elseif (preg_match('/windows|win32/i', $u_agent)) {
        $platform = 'windows';
    }

    // Next get the name of the useragent yes seperately and for good reason
    if(preg_match('/MSIE/i',$u_agent) && !preg_match('/Opera/i',$u_agent))
    {
        $bname = 'Internet Explorer';
        $ub = "MSIE";
    }
    elseif(preg_match('/Firefox/i',$u_agent))
    {
        $bname = 'Mozilla Firefox';
        $ub = "Firefox";
    }
    elseif(preg_match('/Chrome/i',$u_agent))
    {
        $bname = 'Google Chrome';
        $ub = "Chrome";
    }
    elseif(preg_match('/Safari/i',$u_agent))
    {
        $bname = 'Apple Safari';
        $ub = "Safari";
    }
    elseif(preg_match('/Opera/i',$u_agent))
    {
        $bname = 'Opera';
        $ub = "Opera";
    }
    elseif(preg_match('/Netscape/i',$u_agent))
    {
        $bname = 'Netscape';
        $ub = "Netscape";
    }

    // finally get the correct version number
    $known = array('Version', $ub, 'other');
    $pattern = '#(?<browser>' . join('|', $known) .
    ')[/ ]+(?<version>[0-9.|a-zA-Z.]*)#';
    if (!preg_match_all($pattern, $u_agent, $matches)) {
        // we have no matching number just continue
    }

    // see how many we have
    $i = count($matches['browser']);
    if ($i != 1) {
        //we will have two since we are not using 'other' argument yet
        //see if version is before or after the name
        if (strripos($u_agent,"Version") < strripos($u_agent,$ub)){
            $version= $matches['version'][0];
        }
        else {
            $version= isset($matches['version'][1])?$matches['version'][1]:'';
        }
    }
    else {
        $version= $matches['version'][0];
    }

    // check if we have a number
    if ($version==null || $version=="") {
        $version="?";
    }

    return array(
            'userAgent' => $u_agent,
            'name'      => $bname,
            'version'   => $version,
            'platform'  => $platform,
            'pattern'    => $pattern
    );
}
?>
  <script>
  var imagecount = 0;
var bhuvanusername="empty";
var val ="<?php echo $browser['name'] ?>"+"<?php echo $browser['version'] ?>";
if(val=='Mozilla Firefox30.0')
alert("Currently we are facing frequent crash with Mozilla Firefox version 30.0. Please change your FireFox version or use Google Chrome to access Bhuvan 3D");
  </script>
  
</body>
</html>
