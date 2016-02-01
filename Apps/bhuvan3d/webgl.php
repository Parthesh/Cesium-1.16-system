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
 echo '<body style="height: 100%; overflow: auto;"  >';
?>
 
     

 <div id="bhu-for" align="center">
    <div id="bhu-for1" align="center">
<div id="wrap" align="left">
    <table>
<tr>
<td width="350px" height="70px" style="background-image:url(img/logo_en_blue.jpg); background-repeat:no-repeat" valign="top">
</td>
<td width="300px">
<span style="color:#536482; font-family:Arial, Helvetica, sans-serif; font-size:22px"> </span>
</td>
<td width="170px" height="40px" style="background-image:url(img/isrologo_blue.jpg); background-repeat:no-repeat" valign="top" align="right">
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

        <div class="faq shadow-rounded-box" style='color:#000000'>
            <a name="general-faq"></a>
            <div class="heading-badge">
                <h4>Enabling WebGL in your Browser</h4>
            </div>
            <div class="add-x5-margin-bottom">
                <h5 class="heading">Safari Users</h5>
			    <!--<img src="img/shim.gif" class="browser-safari add-xxx-margin-right" align="left" />-->
                <ol>
                    <li>Click on the Settings icon and select Preferences.</li>
                    <li>Click the Advanced tab in the Preferences window.</li>
                    <li>At the bottom of the window, check the <span class="blue"><em>Show Develop</em></span> menu in menu bar checkbox.</li>
                    <li>Open the Develop menu in the menu bar and select <span class="blue"><em>"Enable WebGL."</em></span></li>
                </ol>
            </div>
            <div class="add-x8-margin-bottom">
                <h5 class="heading">Chrome Users</h5>
			    <!--<img src="img/shim.gif" class="browser-chrome add-xxx-margin-right" align="left" />-->
			    <ol>
			        <li>Type <span class="blue"><em>chrome://flags</em></span> where you would normally type a web address. Hit Enter.</li>
			        <li> Under the Experiments list, find <span class="blue"><em>"Override software rendering list"</em></span> and press Enable.</li>
			    </ol>
				Note: After enable WebGL if it is still not working then disable "Disable hardware-accelerated video decode" option in <em>chrome://flags</em>
            </div>
            <div class="add-x5-margin-bottom">
                <h5 class="heading block">FireFox Users</h5>
			  <!--  <img src="img/shim.gif" class="browser-firefox add-xxx-margin-right" align="left" />-->
                <ol>
                    <li>Type <span class="blue"><em>about:config</em></span> into the browser and press Enter where you would normally type a web address.</li>
				    <li>Type <span class="blue"><em>webgl.force-enabled</em></span> into the Filter: search box.</li>
				    <li>Press your mouse on the Value that is displayed to highlight the row.</li>
				    <li>Right click your mouse on the highlighted line and choose <span class="blue"><em>"Toggle"</em></span>.</li>
                </ol>
            </div>
        </div>
</div>
</div>
</div>
