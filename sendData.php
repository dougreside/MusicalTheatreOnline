<?PHP

$annoData = stripslashes($_POST['annoData']);
$domain = $_SERVER['HTTP_HOST'];
$path = $_SERVER['PHP_SELF'];
$path = substr($path,0,strrpos($path,"/"));

$cwd = "http://".$domain.$path."/interface.php";


header('Content-Type: text/plain');
header('Content-Disposition: attachment; filename=mto_annotations.html');
header('Content-Transfer-Encoding: binary');
echo'<HTML><HEAD><SCRIPT language="JavaScript">function send(){document.aData.submit();}</SCRIPT></HEAD><BODY onload="send()"><form name="aData" method="POST" action="'.$cwd.'"><input type="hidden" name="annoData" value="'.$annoData.'"/></form></BODY></HTML>';

?>

