<?php
ini_set('memory_limit', '64M');
set_time_limit(525600);
$username="root";
$password="root";
$database="EBP";
mysql_connect("localhost:8888",$username,$password);
@mysql_select_db($database) or die( "Unable to select database");
//$base = $_GET['base'];
//$wit = $_GET['wit'];

$dir = opendir("./plainText");
$files = array();
//List files in images directory
while (($file = readdir($dir)) !== false)
  {
  	if (strlen($file)>2){
  $files[]=$file;
	}
  }
  closedir($dir);


for ($i=0;$i<count($files);$i++){
	$base = $files[$i];
	for ($j=0;$j<count($files);$j++){
	if ($i==$j){
		$j++;
		$doit= true;
		if ($j>count($files)){
			$doit = false;
		}		
	}
	$wit = $files[$j];
		
$file = fopen("http://localhost:8888/EBP/lib/Diff/plainText/$base",'r') or die("###error");
$txt = "";

while (!feof ($file)) {

    $txt .= fgets($file, 1024);
}
fclose($file);
$txt = str_replace("\r", "", $txt);

//------
$file = fopen("http://localhost:8888/EBP/lib/Diff/plainText/$wit",'r') or die("###error");
$txt2 = "";
while (!feof ($file)) {
    $txt2 .= fgets($file, 1024);
}
fclose($file);
$txt2 = str_replace("\r", "", $txt2);
//------
echo $base ." and ".$wit."<br/>";


$thequery = "SELECT * FROM Diffs 
	WHERE DocIdA='$base' AND DocIdB='$wit' ORDER BY bOffset DESC;";
	echo $thequery;
$diffs = array();
$result = mysql_query($thequery);	

while($row = mysql_fetch_array($result))
  {
  
  $diffs[] = array("DiffId"=>$row['DiffId'],"type"=>$row['bType'],"bOff"=>$row['bOffset'],"bLen"=>$row['bLength'],"wOff"=>$row['wOffset'],"wLen"=>$row['wLength']);
  }

echo count($diffs);
foreach ($diffs as $diff){
	$off = intval($diff['bOff']);
	$len = intval($diff['bLen']);
	$off2 = $off+$len;
	
	$begin = substr($txt,0,$off);
	$middle = substr($txt,$off,$len);
	$end = substr($txt,$off2);
	
	$txt = "$begin<span class='normal' onmouseover='highlight(\"w".$diff['DiffId']."\")' onmouseout='dehighlight(\"w".$diff['DiffId']."\")' onclick='show(\"w".$diff['DiffId']."\")' id='b".$diff['DiffId']."'>$middle</span>$end";
	
	
	$woff = intval($diff['wOff']);
	$wlen = intval($diff['wLen']);
	$woff2 = $woff+$wlen;
	$wbegin = substr($txt2,0,$woff);
	$wmiddle = substr($txt2,$woff,$wlen);
	$wend = substr($txt2,$woff2);
	$txt2 = "$wbegin<span class='normal' onmouseover='highlight(\"b".$diff['DiffId']."\")' onmouseout='dehighlight(\"b".$diff['DiffId']."\")' onclick='show(\"b".$diff['DiffId']."\")' id='w".$diff['DiffId']."'>$wmiddle</span>$wend";
	
}
$txt = nl2br($txt);
$txt2 = nl2br($txt2);

$out= "<DIV class='diffTable'><table><tr><td><div class='diffDiv' id='baseDiv'>$txt</div></td><td><div class='diffDiv' id='witDiv'>$txt2</div></td></tr></table></DIV>";
$basestem = substr($base,0,strlen($base)-4);
$witstem = substr($wit,0,strlen($wit)-4);
$outname = $basestem.$witstem;
$outfile = fopen("./$outname.html","w");
fwrite($outfile,$out);
fclose($outfile);
}
}
mysql_close();
?>