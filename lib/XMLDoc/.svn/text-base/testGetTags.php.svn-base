<?php
ini_set("memory_limit","512M");
ini_set("max_execution_time","120");

include("./getWords.php");
include("./generateID.php");
//include("./getOffsets4Node.php");
require("./dbStuff.php");

echo "<?xml version='1.0' encoding='UTF-8'?>";
function getTextNodes(&$node,$path){
	
		 $result = array();
		 $result[0]=array();
		 $result[1]=array();
		 $sub = "";
		 $kids = $node->childNodes;
	
		for ($i=0;$i<$kids->length;$i++){
			$kid = $kids->item($i);
			if (get_class($kid) == "DOMText"){	
				$wc_utf8 = strWordCountUTF8(stripPunct($node->textContent));
				$words = array();
				$words = strWordCountUTF8(stripPunct($node->textContent),1);
				switch ($wc_utf8) { // check for content (0 ==> assume solo punctuation)
				case 0:
				break;
				case 1: // single word in the tag

		
				//echo $words[0]." Offset: ".$offset." Len: ".$len."<br><br>";
				$result[0][] = array("word=">$words[0],"pos"=>"0","anc"=>$path);
				
				
				break;
				
			default: // greater than one word in this tag
				echo "<br/>_______<br/>$path";
				
				for ($i=0;$i<count($words);$i++){
				
				$word = $words[$i];
		
				$result[0][] = array("word=">$words[$i],"pos"=>$i,"anc"=>$path);
					
				}
				break;
		}
			
			}
			else{
				$id = $kid->getAttribute("xml:id");
				
				$newpath = $path."|".$id;
				$result[1][]=array("word"=>$kid->nodeName,"id"=>$id,"parId"=>$node->getAttribute("xml:id"));
				
				$sub = getTextNodes(&$kid,$newpath);
				if (count($sub[0])>0){
				$result[0] = array_merge($result[0],$sub[0]);
				}
				if (count($sub[1])>0)
				$result[1] = array_merge($result[1],$sub[1]);
				}	
		}
		return $result;	
}
// Set up file --> xml
//$fn = "http://localhost:8888/EBP/XML/hamwTest.xml";
$fn = "http://localhost:8888/EBP/lib/XMLDoc/hamw.xml";

$baseFN = basename($fn);
$file = fopen($fn,'r') or die("###error");
$txt = "";
while (!feof ($file)) {
    $txt .= fgets($file, 1024);
}
fclose($file);
$txt = strtr($txt,"\n"," ");
$txt = preg_replace("/\>\s*\</","><",$txt);

$xml = new DOMDocument();
$xml->loadXML($txt);

$textTagList = $xml->getElementsByTagname("text");
// Ensure every tag in the <text></text> block
// is assigned an xml:id attribute
$mainText = $textTagList->item(0);
$prefix = getPrefix($baseFN);
echo "INIT PREFIX is: ".$prefix."<br><br>";
setIDs($mainText,0,$xml,$prefix);
// save it out 
$xml->saveXML();

// Set up to get all the words in the <text></text> block
// for inserting
$textTagList = $xml->getElementsByTagname("text");
$counter = 0;
$rootText = $textTagList->item(0);
$path = "";
$tnList = getTextNodes($rootText,$path);
echo "TOTAL NODES: ".count($tnList[0])."<br><br>";
print_r($tnList[0]);
// Push the wordList stuff to the words/tags/etc tables
//proc4db($baseFN, $wordList);

?>
