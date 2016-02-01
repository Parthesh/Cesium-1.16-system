<body onload='parent.reloadlogin_afterlogout()'>
<?php 
include_once('CAS.php');
		phpCAS::setDebug();
		phpCAS::client(CAS_VERSION_2_0,'bhuvan-cas.nrsc.gov.in',80,'cas');
		phpCAS::setNoCasServerValidation();
		session_destroy();	
		phpCAS::logout();
		?>
		</body>
		