<?PHP
ini_set('memory_limit', '64M');
$username="root";
$password="root";
$database="EBP";
$compiledFile = $_GET['fn'];
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
					$id = $kid->parentNode->getAttribute("xml:id");
	if ($id){
	$pieces = split(",",$kid->nodeValue);
	$end = intval($pieces[0])+intval($pieces[1]);
$thequery = "INSERT INTO TextNodes (
	docId,offset,end,parentId
	)
	VALUES (
	'0','$pieces[0]','$end','$id' );";

$result = mysql_query("$thequery");	}
		
			}
			else{
				$sub = getTextNodes(&$kid);
				
			
			}	
		}
		return $result;
	
}
$file = fopen("$compiledFile",'r') or die("###error");
$txt = "";

while (!feof ($file)) {

    $txt .= fgets($file, 1024);
}
fclose($file);

$xml = new DOMDocument;
$xml->loadXML($txt);
$docEle = $xml->documentElement;

$tn = getTextNodes($docEle);



mysql_close();
echo "done";
?>