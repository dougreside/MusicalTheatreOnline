<?PHP
ini_set("memory_limit","64M");
include "./getOffsets4Node.php";
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
$txt = strtr($txt,"\n","");
$txt = preg_replace("/\>\s*\</","><",$txt);

$dom = new DOMDocument();
$dom->loadXML($txt);
echo "what?";
$root = $dom->documentElement;
echo "root: ".$root->nodeName;
$node = getNodeForOffset($root,0,100);
echo $node->nodeName;

?>

