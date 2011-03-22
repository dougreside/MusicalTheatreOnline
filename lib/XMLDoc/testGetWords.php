<?php
ini_set("memory_limit","64M");

include("./getTextNodes.php");
include("./getWords.php");
include("./generateID.php");
include("./getOffsets4Node.php");
require("./dbStuff.php");

echo "<?xml version='1.0' encoding='UTF-8'?>";

// Set up file --> xml
//$fn = "http://localhost:8888/EBP/XML/hamwTest.xml";
$fn = "http://localhost:8888/EBP/XML/hamShort.xml";

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

$tnList = getTextNodes($textTagList->item(0));
echo "TOTAL NODES: ".count($tnList)."<br><br>";


// make this a function to return the array of xml:ids with [word:offset:nodename]
// once that array is made, make the function to insert the array vals into the database
$wordList = array();
mb_internal_encoding("UTF-8");

foreach ($tnList as $node) {
	
	// ** NOTE: Don't seem to need soloPunct() now that strWordCountUTF8()
	// ** handles tags that only contain punctuation, like "." or "," or "?"
	//if (soloPunct($node) == 1) {
		//echo "do NOT Database. NODE: ".$node->textContent." is only punct, not a word<br>";
	//}
	//else {
		// get length of tag -- its contents (INCLUDES punct.)
		$tagLen = mb_strlen($node->textContent);
		$parentNode = $node->parentNode;
		// get the xml:id to database (tags table)
		$xml_id = $parentNode->getAttribute("xml:id");
		// get the utf_8 word count for the text within this tag
		// note: have to call 
		$wc_utf8 = strWordCountUTF8(stripPunct($node->textContent));

		$words = array();
		$words = strWordCountUTF8(stripPunct($node->textContent),2);

		switch ($wc_utf8) { // check for content (0 ==> assume solo punctuation)
			case 0:
				break;
				
			case 1: // single word in the tag
				$tagOffset = getTextOffset($parentNode);
				$offset = $tagOffset;
				//$len = mb_strlen($words[0]);
				//echo $words[0]." Offset: ".$offset." Len: ".$len."<br><br>";
				$wordList[] = $xml_id.":".$tagOffset.":".$tagLen.":".$words[0].":".$offset;
				break;
				
			default: // greater than one word in this tag
			
				$tagOffset = getTextOffset($parentNode);
				$offset = $tagOffset;
				foreach ($words as $word) {
					$len = mb_strlen($word);
					$wordList[] = $xml_id.":".$tagOffset.":".$tagLen.":".$word.":".$offset;
					// get next offset
					$offset += ($len+1);
				}
				break;
		}
	//}
}

/*foreach ($wordList as $wAttribs) {
		list($xml_id, $tagOff, $tagLen, $w, $offset) = explode(":",$wAttribs);
		// make words & xml_ids ready for database entry
		$w = addslashes($w);
		$xml_id = addslashes($xml_id);
		echo "ID: ".$xml_id." : TAGOFFSET: ".$tagOff." : TAGLEN:".$tagLen." : WORD: ".$w." OFFSET: ".$offset."<br>";
}
*/

// Push the wordList stuff to the words/tags/etc tables
proc4db($baseFN, $wordList);

?>
