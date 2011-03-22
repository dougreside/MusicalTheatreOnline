<?PHP
ini_set("memory_limit","64M");
echo "<?xml version='1.0' encoding='UTF-8'?>";
$fn = $_GET['fn'];
$outfile = $_GET['out'];
$result = "";



$file = fopen($fn,'r') or die("###error");
$txt = "";
while (!feof ($file)) {

    $txt .= fgets($file, 1024);
}
fclose($file);
$txt = strtr($txt,"\n","");
$txt = strtr($txt,"\r","");
$txt = preg_replace("/\?\>[^\<]*\</","?><",$txt);
$counter = 0;
$intag = false;
$lastcounter =0;
for ($i=0;$i<strlen($txt);$i++){
	$cur = substr($txt,$i,1);
	
	if ($cur=="<"){
		$intag = true;
		$len = $counter - $lastcounter;
		
		
		if ($len>0){
			//echo "$counter,$len<br/>";
			$result .= "$lastcounter,$len";
			}
		$lastcounter = $counter;
	}

	if ($intag){
		
		$result .= "$cur";
		
	}
	else{
		$counter++;			
	}
	
	if ($cur==">"){
		$intag = false;
	}
	
}

$strippedText = preg_replace("/\<[^\>]*\>/","",$txt);
$cfile = $outfile."_c";
$tfile = $outfile."_t";
$file = fopen($cfile,'w') or die("###error");

fwrite($file,$result);
fclose($file);
$file = fopen($tfile,'w') or die("###error");

fwrite($file,$strippedText);
fclose($file);
echo "done";?>