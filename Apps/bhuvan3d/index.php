<head>
<style type="text/css" >

body {
	margin-left: 15px;
	margin-top: 15px;
	margin-right: 0px;
	margin-bottom: 0px;
}
                                                                    
 style1
      {
   width: 419px;
  }
                                                                          
 </style>  
<link rel="StyleSheet" href="css/basic.css" type="text/css" media="screen"> 
 </head>
<?php
 if ($_POST)
 echo "<body>";
 else
 echo '<body style="height: 100%; overflow: auto;" onload="init()"  >';
?>
 
     

 <div id="bhu-for" align="center">
    <div id="bhu-for1" align="center">
<div id="wrap" align="left" style='color:#000000'>
    <table>
<tr>
<td width="350px" height="70px" style="background-image:url(img/logo_en_blue.jpg); background-repeat:no-repeat" valign="top">
</td>
<td width="300px">
<span style="color:#536482; font-family:Arial, Helvetica, sans-serif; font-size:22px"> Bhuvan 3D</span>
</td>
<td width="170px" height="70px" style="background-image:url(img/isrologo_blue.jpg); background-repeat:no-repeat" valign="top" align="right">
</td>
</tr>
</table>   
<div class="navbar">
			
			<table style="height:33px">
<tr>
<td>
</td>
</tr> </table> 

  </div>
 
 <?php 
  ini_set("display_errors","Off");
  date_default_timezone_set('Asia/Calcutta');
 $d= date('m/d/Y G:i:s');
$ip=$_SERVER['REMOTE_ADDR'];

//echo "date is".$d;

 if ($_POST){
$result = pg_escape_string($_POST["result"]);
$ch = pg_escape_string($_POST["choice"]);
$res=explode(",",$result);

if($ch=='1')
{
$ch1='cesium';
if($_GET['b'] && $_GET['b'])
$url='3d.php?l='.$_GET['l'].'&b='.$_GET['b'];
else
$url='3d.php';
}
else if($ch=='2')
{
$ch1='skyline';
$url='http://bhuvan2.nrsc.gov.in/bhuvan';
}
else
{
$ch1='home';
$url='http://bhuvan.nrsc.gov.in';
}

  $connection2 = pg_connect("host=10.71.1.99 port=5432 dbname=bhuvan3d user=postgres password=admin");
  $vsql="INSERT INTO cesium_log(webglenabled, context, platform, browser, \"version\", others, ip, date, choice)  VALUES ('".$res[0]."', '".$res[1]."', '".$res[2]."', '".$res[3]."', '".$res[4]."', '".$res[5]."',  '".$ip."',  '".$d."' , '".$ch1."' );";
	$t=pg_query ($vsql);
 
 
  header('Location:'.$url);
 
 }
 else 
 {
 
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

$browser = getBrowser();

echo '';
 
if($_GET['b'] && $_GET['b'])
$u='index.php?l='.$_GET['l'].'&b='.$_GET['b'];
else
$u='index.php';
?>
 
<form id="globe" action="<?php echo $u?>" method="post">
 <input name="result" id="result" type="hidden"> <input name="choice" id="choice" type="hidden">
 <button type="submit" style="display:none" id="submit">Submit</button>
 
 <br/><br/> <b> We are in process of developing a new version of Bhuvan 3D. Please click below to explore it and give your feedback. Alternatively access the previous version. </b><br/>
 <br/><br/></form>
  <input id="cesium_true" type="button" value="Explore new version 3D" onclick="click_globe('1')"/>
  
  <div id="cesium_help" style="color:red" >
   </div>
<br/><br/> 
 
 <input id="skyline_true" type="button" value="Access 3D" onclick="click_globe(2)"/>
  
  <div id="skyline_help" style="color:red" >
   </div>
 
 


<?php 

}
 
 ?>
 

</div>
</div>
</div>
 <script type="text/javascript">

       function getParam(str){
        return ctx.getParameter(str);
      }

var browser,enabled;
var ctx;	 
      function init() {
	  var detailCounter = 0;
      var val;
	  var context='none';
    
   
      var cvs = document.createElement('canvas');
      var contextNames = ['webgl','experimental-webgl','moz-webgl','webkit-3d'];
      

      if(navigator.userAgent.indexOf('MSIE') >= 0) {
        try{
          ctx = WebGLHelper.CreateGLContext(cvs, 'canvas');
		  
         }catch(e){}
      }
      else{
        for(var i = 0; i < contextNames.length; i++){
          try{
            ctx = cvs.getContext(contextNames[i]);
            if(ctx){
               context=contextNames[i];
              break;
            }
			else
			val='No';
          }catch(e){}
        }
	    }
	  
      if(ctx)
		  val='Yes';
		  else
			val='No';
			 var enabled=val;
	 browser="<?php echo $browser['name'] ?>";
      
	  val=val+","+context+","+"<?php echo $browser['platform'] ?>"+","+browser+","+"<?php echo $browser['version'] ?>";
    
   

      if(ctx){
        val=val+","+ getParam(ctx.VERSION);
       val=val+","+ getParam(ctx.RENDERER);
        val=val+","+ getParam(ctx.SHADING_LANGUAGE_VERSION);
        detailCounter = 0;
        /*('bits', 'RGBA Bits', getParam(ctx.RED_BITS) + ', ' + getParam(ctx.GREEN_BITS) + ', ' + getParam(ctx.BLUE_BITS) + ', ' + getParam(ctx.ALPHA_BITS
		));
        ('bits', 'Depth Bits', getParam(ctx.DEPTH_BITS));
        
        ('shader','Max Vertex Attribs', getParam(ctx.MAX_VERTEX_ATTRIBS));
        ('shader','Max Vertex Texture Image Units', getParam(ctx.MAX_VERTEX_TEXTURE_IMAGE_UNITS));
        ('shader','Max Varying Vectors', getParam(ctx.MAX_VARYING_VECTORS));        
        ('shader','Max Uniform Vectors', getParam(ctx.MAX_VERTEX_UNIFORM_VECTORS));
        
        ('tex', 'Max Combined Texture Image Units', getParam(ctx.MAX_COMBINED_TEXTURE_IMAGE_UNITS));
        ('tex', 'Max Texture Size', getParam(ctx.MAX_TEXTURE_SIZE));
        ('tex', 'Max Cube Map Texture Size', getParam(ctx.MAX_CUBE_MAP_TEXTURE_SIZE));
        ('tex', 'Num. Compressed Texture Formats', getParam(ctx.NUM_COMPRESSED_TEXTURE_FORMATS)); */

       val=val+","+getParam(ctx.MAX_RENDERBUFFER_SIZE);
        val=val+"_"+ getParam(ctx.MAX_VIEWPORT_DIMS);
        val=val+"_"+ getParam(ctx.ALIASED_LINE_WIDTH_RANGE);
        val=val+"_"+ getParam(ctx.ALIASED_POINT_SIZE_RANGE);
        //('misc', 'Supported Extensions', ctx.getSupportedExtensions().length === 0 ? 'none' : commasToBr(ctx.getSupportedExtensions()));
		 }
		 else
		 val=val+",none";
		
	 document.getElementById("result").value=val;	
	
		if(enabled=='No' && browser=='Internet Explorer' && "<?php echo (int)$browser['version'] ?>" <9) //for webgl disabled IE 8
		{
		document.getElementById("cesium_help").innerHTML='Your browser does not support WebGL. Please access exisitng 3D ';
		document.getElementById("cesium_true").disabled=true;
		document.getElementById("skyline_help").style.display="none";
		}
		
		else if(enabled=='No' && browser=='Internet Explorer' && "<?php echo (int)$browser['version'] ?>" > 8) //for webgl disabled IE 8
		{
		document.getElementById("cesium_help").innerHTML='Your browser does not support WebGL. Please access exisitng 3D ';
		document.getElementById("cesium_true").disabled=true;
		document.getElementById("skyline_true").disabled=true;
		document.getElementById("skyline_help").innerHTML="We are sorry. Bhuvan 3D currently doesnot support your browser. Please visit <a href='#' onclick='click_globe(3)'>Bhuvan Home</a>";
		}
		else if(enabled=='No')
		{
		
		document.getElementById("cesium_help").innerHTML="Please enable WebGL in your browser and then refresh this page. Click <a href='webgl.php' target='_blank'>here</a> to know more about how to enable webGL in your browser.  ";
		document.getElementById("cesium_true").disabled=true;
		document.getElementById("skyline_true").disabled=true;
		document.getElementById("skyline_help").innerHTML="We are sorry. Bhuvan 3D currently doesnot support your browser. (Only Internet Explorer version < 9 is supported.";
		}
		else if(enabled=='Yes')
		{
		click_globe('1');
		document.getElementById("cesium_help").innerHTML="";
		document.getElementById("skyline_true").style.display="none";
		document.getElementById("skyline_help").style.display="none";
		document.getElementById("globe").style.display="none";
		}
			  
	   }
	   
	  
function click_globe(val)
{
document.getElementById("choice").value = val;
document.getElementById("submit").click();
}
    </script>   
</body>	