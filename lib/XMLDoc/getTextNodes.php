<?PHP
ini_set('memory_limit', '64M');
$username="root";
$password="root";
$database="EBP";

//If you are on a windows machine, leave off :8888 on the next line
mysql_connect("localhost:8888",$username,$password);
@mysql_select_db($database) or die( "Unable to select database");


function getTextNodes(&$node){
	
		 $result = array();
		 $sub = "";
		 $kids = $node->childNodes;
	
		for ($i=0;$i<$kids->length;$i++){
			$kid = $kids->item($i);
			//echo get_class($kid);
			if (get_class($kid) == "DOMText"){
			
				array_push($result,$kid);
			}
			else{
				$sub = getTextNodes(&$kid);
				
				if (count($sub) > 0) {
					$result = array_merge($result,$sub);
				}
			}	
		}
		return $result;
	
}
$file = fopen("http://localhost:8888/EBP/lib/XMLDoc/gd1231_c",'r') or die("###error");
$txt = "";

while (!feof ($file)) {

    $txt .= fgets($file, 1024);
}
fclose($file);

$xml = new DOMDocument;
$xml->loadXML($txt);
$docEle = $xml->documentElement;

$tn = getTextNodes($docEle);
/*
 * //Generate XML File
 
$file = fopen("./offsetIndex.xml",'w') or die("###error");
fwrite($file,"<root>");
foreach ($tn as $txt){
	$id = $txt->parentNode->getAttribute("xml:id");
	if ($id){
	$pieces = split(",",$txt->nodeValue);
	$end = intval($pieces[0])+intval($pieces[1]);
	fwrite($file,"<txtNode><offset>".$pieces[0]."</offset><end>".$end."</end><parentId>$id</parentId></txtNode>");
	}
}
fwrite($file,"</root>");
fclose($file);*/
foreach ($tn as $txt){
	$id = $txt->parentNode->getAttribute("xml:id");
	if ($id){
	$pieces = split(",",$txt->nodeValue);
	$end = intval($pieces[0])+intval($pieces[1]);
	$thequery = "INSERT INTO TextNodes (
	docId,offset,end,parentId
	)
	VALUES (
	'0','$pieces[0]','$end','$id' );";
	echo $thequery."\n";
$result = mysql_query("$thequery");	}
}


mysql_close();
?>