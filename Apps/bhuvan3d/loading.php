<body width="900px" height="700px">
<?php 
echo "<iframe width='100%' height='92%' src=\"".$_GET['q']."\"> </iframe>";
?>

<div align="center"><br/>
<img src="img/cancel.png" OnClick="$('#LoginFrame').dialog('close');$('#feedbackFrame').dialog('close');"  style="cursor:pointer" alt="cancel" title="Cancel" \>
		</div>
</body>