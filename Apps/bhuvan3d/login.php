<body onload="parent.reloadlogin()">
<?php 
		include_once('CAS.php');
		phpCAS::setDebug();
		phpCAS::client(CAS_VERSION_2_0,'bhuvan-cas.nrsc.gov.in',80,'cas');
		phpCAS::setNoCasServerValidation();
		phpCAS::forceAuthentication();
		$_SESSION['bhuvanusername']=phpCAS::getUser();
		echo "welcome ".	$_SESSION['bhuvanusername']." you are successfully logged in";
		echo "<script type='text/javascript'>parent.bhuvanusername=\"".$_SESSION["bhuvanusername"]."\";</script>";
		?>
				</body>
		