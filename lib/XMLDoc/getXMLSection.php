<?php
ini_set("memory_limit","64M");
echo "<?xml version='1.0' encoding='UTF-8'?>";
$fn = $_GET['fn'];



$result="";
$file = fopen($fn,'r') or die("###error");
$txt = "";
while (!feof ($file)) {

    $txt .= fgets($file, 1024);
}
fclose($file);
$counter = 0;
$offset=0;

$recording =true;

$result='';

$i=0;
$realOff = 0;
$close = 0;
$txt = strtr($txt,"\n"," ");
$txt = preg_replace("/\>\s*\</","><",$txt);
$xml = new DOMDocument;
$xml->loadXML($txt);
$docEle = $xml->documentElement;
processXML($docEle,0);

function processXML($ele,$counter) {

	//var $thisCounter;
	$thisCounter = $counter;
	$kids = $ele->childNodes;
	$tagName = $ele->nodeName;		
	$tagOffset = $counter;
	$tagLength = 0;	
	if ($tagName=="#text"){
		$tagLength = strlen($ele->nodeValue);
		
		echo "$tagOffset,$tagLength";
		$thisCounter += $tagLength;
		$parText = $ele->parentNode->nodeName;
		
	}
	else{
		echo "<$tagName";
    if($ele->hasAttributes()) {
        $attrs = $ele->attributes;
        for($i=0; $i < $attrs->length; $i++) {
            $attr = $attrs->item($i);
            echo " ".$attr->nodeName."='".$attr->nodeValue."'";
        }
    }
	echo ">";
	
	//echo $thisCounter;
	if ($kids){
	foreach ($kids as $kid){
     
			$thisCounter =+ processXML($kid,$thisCounter);
	}
	}
	echo "</$tagName>";	
	}	
	
	
	return $thisCounter;	
	
}
?>
