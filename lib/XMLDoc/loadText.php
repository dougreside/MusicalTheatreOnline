<?php
ini_set('auto_detect_line_endings', '1');
ini_set("memory_limit","16M");
		$fn = $_GET['fn'];
$offset = $_GET['offset'];
$length = $_GET['length'];


$file = fopen($fn,'r') or die("###error");
$txt = "";
while (!feof ($file)) {
$txt = $txt.fgets($file, 4096);
}
fclose($file);
$txt = strtr($txt,"\n"," ");
$txt = preg_replace("/\>\s*\</","><",$txt);
$txt = preg_replace("/\<[^\>]*\>/","",$txt);


//echo $txt;
//$txt = file_get_contents($fn);
//echo $txt;
if (($offset!=null)&&($length!=null)){
//	echo "The answer is:<br/>";
echo substr($txt,$offset,$length);
}
else{

		echo $txt;
}

	

?>
