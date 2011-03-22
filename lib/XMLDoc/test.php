<?PHP
include "getOffsets4Node.php";
include "disp.php";
ini_set("memory_limit","64M");
header("Content-type: text/xml");
$fn = "http://localhost:8888/quartos/hamnow.xml";

$file = fopen($fn,'r') or die("###error");
$txt = "";
$offset=0;
$xml = "";
$nodeList = "";

while (!feof ($file)) {

    $txt .= fgets($file, 1024);
}
fclose($file);
$xsl = "";
$file = fopen('http://localhost:8888/EBP/lib/XMLDoc/TEI2HTML.xsl','r') or die("###error");
while (!feof ($file)) {

    $xsl .= fgets($file, 1024);
}
fclose($file);

$txt = strtr($txt,"\n","");
$txt = preg_replace("/\>\s*\</","><",$txt);
$xml = new DOMDocument;
$xml->loadXML($txt);

$newXMLstring = "";

// Checking various nodes
$nodeList = $xml->getElementsByTagname("pb");
/*
foreach ($nodeList as $myNode) {
	$offset = getTextOffset(&$myNode, $xml); 
	echo "TEXT offset= ".$offset." for node: ".$myNode->nodeName."<br>";
	$node1 = $myNode;
}

$nodeList = $xml->getElementsByTagname("stage");

foreach ($nodeList as $myNode) {
	$offset = getTextOffset(&$myNode, $xml); 
	echo "TEXT offset= ".$offset." for node: ".$myNode->nodeName."<br>";
	$node2 = $myNode;
}*/
$node1 = $nodeList->item(30);
$node2 = $nodeList->item(31);

//$node = $nodeList->item(0);
//echo wrapNode($node);
$xstr = trimTree(&$node1, &$node2, $xml);
//echo "ok";

echo $xstr;
//echo innerXML($node,$xml);








?>
