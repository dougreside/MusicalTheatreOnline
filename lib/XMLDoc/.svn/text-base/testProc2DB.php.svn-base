<?php
ini_set("memory_limit","512M");
ini_set("max_execution_time","240");

include("./getWords.php");
include("./generateID.php");
require("./dbStuff.php");
require("./getOffsets4Node.php");
require("./getMilestones.php");

echo "<?xml version='1.0' encoding='UTF-8'?>";
// getting some timing info
$start= date("F j, Y, g:i:s a");
echo "START: ".$start."<br>";

//$fn = "http://localhost:8888/EBP/XML/hamShort.xml";
//$fn = "http://localhost:8888/EBP/lib/XMLDoc/hamw.xml";
//$fn = "http://localhost:8888/EBP/lib/XMLDoc/hamnow.xml";
//$fn = "http://localhost:8888/EBP/XML/p3ham-1603-22275x-hun-c01.xml";
//$fn = "http://localhost:8888/EBP/XML/ppham-1604-22276x-fol-c01.xml";
//$fn = "http://localhost:8888/EBP/XML/ppham-1604-22276x-hun-c01.xml";

//$fn = "http://localhost:8888/EBP/XML/final-ham-1603-22275x-hun-c01.xml";
//$fn = "http://localhost:8888/EBP/XML/fe-ham-1625-22278x-hun-c01.xml";
$fn = "http://localhost:8888/EBP/XML/fe-ham-1625-22278x-hun-c01_v2.xml";

$baseFN = basename($fn);
$file = fopen($fn,'r') or die("###error");
$txt = "";
while (!feof ($file)) {
    $txt .= fgets($file, 1024);
}
fclose($file);
$txt = strtr($txt,"\r","\n");
$txt = strtr($txt,"\n"," ");
$txt = preg_replace("/\>\s*\</","><",$txt);

$xml = new DOMDocument();
$xml->loadXML($txt);

$docRoot = $xml->documentElement;

// get prefix and set xml:ids for those tags that don't have them
$prefix = getPrefix($baseFN);
setIDs($docRoot,0,$xml,$prefix);

//Write out the XML file, now that each tag has an xml:id assigned
$xml->formatOutput = true;
// save the xml w/ids for use in db processing
$processedXML = $xml->saveXML();

$origXML = basename($fn, ".xml");
$procFN= "../../XML/".$origXML."_processed.xml";
$baseProcFN=basename($procFN);
$processedFile = fopen($procFN, 'w+') or die("#ERROR#: Could NOT open file <i>$procFN</i>");
fwrite($processedFile, $processedXML);

// Set up to get all the words in the <text></text> block
// for inserting
$textTagList = $xml->getElementsByTagname("text");
$rootText = $textTagList->item(0);

$counter = 0;
$path = "";

echo "FILES: orig[".$baseFN."] and proc[".$baseProcFN."]<br>";
$f_id = dbProcess($baseFN,$baseProcFN,$rootText,$path);

echo "F_ID INSERTED:".$f_id."<br>";

$msArray = buildmsArray($rootText);

// Get the last <pb/> tag so that we can
// wrap any of the last milestone tags (e.g., <lb/>)
// up to the end of the *.xml doc

if (isset($msArray['pb'])) {
	$lastPBTag = end($msArray['pb']);
}

foreach ($msArray as $arrayName => $milestone) {
	foreach($milestone as $index => $tag) {
		echo $index.": ".$tag->nodeName." ".$tag->getAttribute("xml:id")."<br>";
	}
}
//msLoad($msArray, $lastPBTag, $f_id);



// end process timing info
$end= date("F j, Y, g:i:s a"); 
echo "END: ".$end."<br>";


/* ******* */

function dbProcess($baseFN, $baseProcFN, $rootText, $path) {

echo "IN DBPROC, FILES:".$baseFN.":".$baseProcFN."<br>";
	// set up the db connection
//	$cnxn = new mysqli("localhost","root","root","SQA_login");
//$cnxn = new mysqli("khelone.umd.edu","root","wheresmy2$?","SQA_login");
$cnxn = new mysqli("minerva.umd.edu","sqa_user","sqa_user","SQA_login");
	if (mysqli_connect_errno()) {
		die ("Can't connect to MySQL Server. Errorcode: ". mysqli_connect_error(). "<br>");
	} 

	// insert file info into files table
	$f_id = fidExists($cnxn, $baseFN);
	if ($f_id == 0) {
		$f_id = insertFile($cnxn, $baseFN, $baseProcFN);
	} else {
		echo "FID:".$f_id."<br>";
		echo "HAVE TO REMOVE STUFF for this file...<br>";
		echo " THEN have to insert the file info as though it were new<br>";
	}
	
/*	
	// initialize most/all processing statements
	// words table stmt refs
	$wordSelStmtRef =& wSelPrep($cnxn);

	// word_fid_rel table stmt refs
	$wfrCntStmtRef =& wfrSelPrep($cnxn); // returns ref to the prepp'd stmt
	$wfrUpdateStmtRef =& wfrUpdatePrep($cnxn); 
	
	// tags table stmt refs
	$tagSelStmtRef =& tagSelPrep($cnxn);
	
	// tag_attribs stmt refs
	$attsSelStmtRef =& attsSelPrep($cnxn);
	$attsInsertStmtRef =& attsInsertPrep($cnxn);
	
	// word_tag_f_rel table refs
	$twfInsertStmtRef =& tagWordFilePrep($cnxn);
	$twfSelStmtRef =& twfSelPrep($cnxn);
	
	$dbStmtRefs = array($wordSelStmtRef,
						$wfrCntStmtRef,
						$wfrUpdateStmtRef,
						$tagSelStmtRef,
						$attsSelStmtRef,
						$attsInsertStmtRef, 
						$twfInsertStmtRef,
						$twfSelStmtRef);
	
	// Load the tags/words into the db
	loadTags($rootText, $path, $cnxn, $f_id, $dbStmtRefs);
	
	// close statement handles
	$wordSelStmtRef->close();	
	$wfrCntStmtRef->close();
	$wfrUpdateStmtRef->close();
	$tagSelStmtRef->close();
	$attsSelStmtRef->close();
	$attsInsertStmtRef->close();
	$twfInsertStmtRef->close();
	$twfSelStmtRef->close();
	
	// close the db cnxn
	$cnxn->close();

*/
	return $f_id;

}

function loadTags(&$node,$path, &$cnxn, $f_id, $dbStmtRefs) {

		// break down the references to prepared DB statements array
		$wordSelStmtRef		= $dbStmtRefs[0];
		$wfrCntStmtRef		= $dbStmtRefs[1];
		$wfrUpdateStmtRef	= $dbStmtRefs[2];
		$tagSelStmtRef		= $dbStmtRefs[3];
		$attsSelStmtRef		= $dbStmtRefs[4];
		$attsInsertStmtRef	= $dbStmtRefs[5];
		$twfInsertStmtRef	= $dbStmtRefs[6];
		$twfSelStmtRef		= $dbStmtRefs[7];
		
		// first load the node info into tags and tag_attribs tables, 
		// if it is a DOMElement
		if (get_class($node) == "DOMElement") {
			$name = $node->nodeName;
			$id = $node->getAttribute("xml:id");
			if (isset($node->parentNode)) {
				$parentNode =  $node->parentNode;
				if ($parentNode->hasAttribute("xml:id")) {
					$parent_id = $parentNode->getAttribute("xml:id");
				} else { // take care of rootText parent_id, if needed
					$parent_id = "NULL"; 
				} 
			} else {
				$parent_id = "NULL";
			}
			// update the tags table for this tag
			$tag_id = updateTagsTable($cnxn, $tagSelStmtRef, $name, $id, $f_id, $parent_id);
				
			// update the tag_attribs for this tag
			$atts = $node->attributes;
			if ($atts!=null) {
				foreach ($atts as $att){
					//if (is_string($att->value)) { $attrib_val = $att->value; } 
					//else { $attrib_val = strval($att->value); }
					// check if the attribs for this tag exists; if not, insert
					updateAttsTable($attsSelStmtRef, $attsInsertStmtRef, $tag_id, $att->name, $att->value);
				}
			}
		}
	
		// Now work on the kids of this node		
		$kids = $node->childNodes;
		for ($i=0;$i<$kids->length;$i++){
			$kid = $kids->item($i);
			
			if (get_class($kid) == "DOMText"){	
				$txt = stripPunct($kid->nodeValue);
				
				$child_node_num = $i;
				$word = array();
				$words = preg_split('/\s+/', $txt,-1,PREG_SPLIT_NO_EMPTY);
				
				$ancArray = explode("|", $path);
				//** The number of ancestors for this word
				//** is actually one LESS than the items in the $ancArray 
				//** (i.e., the $path), due to extra array element
				//** resulting from the explode("|", $path)
				$w_num_gens = (count($ancArray))-1;
				// grab the xml_id for the tag immediately enclosing this word/group of words
				// and find its tag_id
				$closest_tag_xmlid = end($ancArray);
				$closest_tag_id = checkTagTable($tagSelStmtRef, $closest_tag_xmlid, $f_id);
				//echo $path." TAGID/xmlid: ".$closest_tag_id."/".$closest_tag_xmlid."<br>";
				
				$w_pos=0;
				foreach ($words as $word){
					$word = stripPunct($word);
					
					$w_id = updateWords($cnxn, $wordSelStmtRef, $word);
					// update the word_fid_rel table with this word/file's information
					updateWordFidRel($cnxn, $wfrCntStmtRef, $wfrUpdateStmtRef, $w_id, $f_id);
					// Want to link this w_id to every tag in its Ancester path
					// Start at end($ancArray) and dec down
					if ($w_num_gens>0 ) {	
						for($ancIndex=$w_num_gens; $ancIndex>0; $ancIndex--) {
							$id = $ancArray[$ancIndex];
							$tag_id = checkTagTable($tagSelStmtRef, $id, $f_id);
							if ($tag_id !=0) {
								// $i is the child number of this text node for this word/words
								echo $w_id." ".$tag_id." ".$f_id." ".$w_pos." ".$w_num_gens." ".$closest_tag_id." ".$child_node_num."<br>";
								updateWordTagFile($twfInsertStmtRef, $twfSelStmtRef, $w_id, $tag_id, $f_id, $w_pos, $w_num_gens, $closest_tag_id, $child_node_num);
							} 
						}
					}
					// echo $w_pos."=".$word."<br>";
					$w_pos++;
				}
			
			} else{
				
				$kidKids = $kid->childNodes;
				if ($kidKids->length==0) { 
					// do nothing...it's a lb/pb/etc with no kids...
				} else {

					$id = $kid->getAttribute("xml:id");
				
					$newpath = $path."|".$id;
				 
					loadTags(&$kid,$newpath, $cnxn, $f_id, $dbStmtRefs);
				}
			}	
		}
}


?>
