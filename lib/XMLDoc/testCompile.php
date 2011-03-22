<?php
ini_set("memory_limit","64M");

include("./getOffsets4Node.php");
include("./compileXML.php");

// ** This is a Global array (in compileXML.php, function mainCompile())
$mileStones = array();

echo "<?xml version='1.0' encoding='UTF-8'?>";
$fn = $_GET['fn'];

// getting some timing info
$start= date("F j, Y, g:i:s a");
echo "START: ".$start."<br>";

$file = fopen($fn,'r') or die("###error");
$txt = "";
while (!feof ($file)) {

    $txt .= fgets($file, 1024);
}
fclose($file);

$txt = strtr($txt,"\n"," ");
$txt = preg_replace("/\>\s*\</","><",$txt);
$xml = new DOMDocument;
$xml->loadXML($txt);
$docEle = $xml->documentElement;

$ptLen = 0;


$origXML = basename($fn, ".xml");
$compFN = "../../XML/".$origXML."_compiled.xml";
$compFile = fopen($compFN, 'w+') or die("#ERROR#: Could NOT open file <i>$compFN</i>");

fwrite($compFile, "<compRoot>");
// output original file with txt offsets
mainCompile($docEle,0,$compFile);
// get plaintext+length

list($ptLen, $plainText) = ptCompile($fn);
fwrite($compFile, $plainText);
// build mileStones array, output
$mileStones = buildmsArray($docEle);
// write it out to compiled file
msCompile($mileStones, $compFile, $ptLen);

fwrite($compFile, "</compRoot>");
fclose($compFile);


// end process timing info
$end= date("F j, Y, g:i:s a"); 
echo "END: ".$end."<br>";

/*echo "NEW START: ".date("F j, Y, g:i:s a")."<br>"; 
$compFile = fopen($compFN, 'r') or die("#ERROR#: Could NOT open file <i>$compFN</i>");
$compTxt = "";
while (!feof ($compFile)) {
    $compTxt .= fgets($compFile, 1024);
}
fclose($compFile);

$compTxt = strtr($compTxt,"\n"," ");
$compTxt = preg_replace("/\>\s*\</","><",$compTxt);
$compXML = new DOMDocument;
$compXML->loadXML($compTxt);

$mainXML = $compXML->getElementsByTagName("TEI");
$tei = $mainXML->item(0);

$osArray = array();
$osArray = buildOffsetArray($tei, $ptLen);

foreach ($osArray as $key=>$value) {
	echo "KEY offset: ".$key."=>nodeName: ".$value->parentNode->nodeName."<br>";
}

echo "NEW END: ".date("F j, Y, g:i:s a")."<br>"; 
*/
?>