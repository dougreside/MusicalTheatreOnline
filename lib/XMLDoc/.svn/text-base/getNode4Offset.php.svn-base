<?php
    $off = $_GET['off'];
	$username="root";
	$password="root";
	$database="EBP";
	mysql_connect("localhost:8888",$username,$password);
	@mysql_select_db($database) or die( "Unable to select database");
	$thequery = " SELECT parentId
FROM TextNodes
WHERE offset <$off
AND end >$off
LIMIT 1 ";

	$result = mysql_query("$thequery");
	echo mysql_result($result, 0);
?>
