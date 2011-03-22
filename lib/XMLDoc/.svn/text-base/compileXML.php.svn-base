<?php

// Functions to build milestone array, 
// get offsets of all text nodes,
// write various outputs to a compiled xml file...
// * See testCompile.php for sample run... *

/* ****************************
 * Function:	mainCompile
 * Inputs:		1) DOM node 
 * 				2) counter that is current offset
 * 				3) the compiled xml file to be written to
 * 				
 * Output:		Will write the offset/length of text that are
 * 				children to the node to compiled file, plus any
 * 				tags that are kids to it -- Recursively gets
 * 				kids' tags and computes/writes the same for them.
 * ****************************/ 
function mainCompile($ele, $counter, $compFile) {
	
	$thisCounter = $counter;
	$tagName = $ele->nodeName;
	$kids = $ele->childNodes;	
	$offset = $counter;
	$length = 0;	
	$idWasSet = 0;
	$txtSeg = "";
	
	if ($tagName=="#text"){
		
		$parNode = $ele->parentNode->nodeName;
		
		//$txtSeg = htmlentities($ele->nodeValue);
		$txtSeg = html_entity_decode( $ele->nodeValue, ENT_QUOTES, "utf-8" );
		echo "TxtSeg: ".$txtSeg."<br>";
		//$length = strlen($txtSeg);
		$length = mb_strlen($txtSeg, 'utf-8');
		//echo "$offset,$length <br>";
		fwrite($compFile, "$offset,$length");
		$thisCounter += $length;
				
		//echo "TEXT: ".$ele->nodeValue."=>".$offset.", ".$length." & Parent: ".$parNode."<br>";
		
	} else {
		//echo "<$tagName";
		fwrite($compFile, "<$tagName");
		
		// set tag id, if necessary
		$idWasSet = checkTagId(&$ele);
		
    	if($ele->hasAttributes()) {
        	$attrs = $ele->attributes;
        	for($i=0; $i < $attrs->length; $i++) {
            	$attr = $attrs->item($i);
            	//echo " ".$attr->nodeName."='".$attr->nodeValue."'";
				fwrite($compFile, " ".$attr->nodeName."='".$attr->nodeValue."'");
        	}
		}

		fwrite($compFile, ">");
		// need to remove the "xml:id" from original file if it was set; 
		// else offsets will be...off...
		if ($idWasSet == 1) {
			$ele->removeAttribute("xml:id");
		}
		if ($kids) {
			foreach ($kids as $kid){
				$thisCounter =+ mainCompile($kid,$thisCounter,$compFile);
			}
		}
	fwrite($compFile, "</$tagName>");	
	}	
	return $thisCounter;	
}

/* ****************************
 * Function:	buildmsArray
 * Inputs:		1) DOM node 
 * 				
 * Output:		builds a "Milestones" array
 * 				of nodes that are not text nodes
 * 				and don't have kids -- i.e., "<pb/>"
 * 				and "<lb/>" etc... (This array can then
 * 				be written to the compiled source file.)
 * ****************************/ 
function buildmsArray(&$ele) {

	$mileStones = array();
	$subArr = array();
	$tagName = $ele->nodeName;
	$kids = $ele->childNodes;		
	$txtOffset = 0;
	$idWasSet = 0;
	
	// build "milestones" array, keyed by txtOffset (unit="pb"/"lb"/etc.)
	if (($tagName!="#text") && ($kids->length == 0)) {

		$txtOffset = getTextOffset(&$ele);	
		$idWasSet = checkTagId(&$ele);
		$mileStones[$tagName][] = $txtOffset.",".$ele->getAttribute("xml:id"); 
		
		// need to remove the "xml:id" from original file if it was set; 
		// else offsets will be...off...
		if ($idWasSet == 1) {
			$ele->removeAttribute("xml:id");
		}
	}
	if ($kids) { // walk through rest of source, getting milestones recursively
			for ($i=0;$i<$kids->length;$i++){
				$kid = $kids->item($i);
				
				$subArr = buildmsArray(&$kid);
				if (count($subArr) > 0) {
					$mileStones = array_merge_recursive($mileStones,$subArr);
				}
			}	
	}
	//echo "</$tagName>";

	return $mileStones;	
}

/* ****************************
 * Function:	msCompile
 * Inputs:		1) milestone array (output from buildmsArray()) 
 * 				2) the compiled xml file to be written to
 * 				
 * Output:		Will write the offset/length of any milestone
 * 				tags (e.g., <pb/>, <lb/>, etc) to a compiled file
 * ****************************/ 
function msCompile($msArray, $compFile, $ptLength) {
	
	$offset = 0;
	$len2Next = 0;
	$tagId = "";
	fwrite($compFile, "\n<milestones>");
	
	foreach ($msArray as $arrayName => $value) {
		
		fwrite($compFile, "<milestone unit='".$arrayName."'> ");
		foreach ($value as $index => $offset) {
			list($offset, $tagId) = explode(",",$offset);

			if (isset($value[$index+1])) {
				$nextOffset = $value[$index+1];
				$len2Next = $nextOffset-$offset;
			} else {  // we've got the last element; its length is to end of plaintext
				$len2Next = $ptLength - $offset; 
			}
			//echo $index."==>".$offset." Length: ".$len2Next."<br>";

			fwrite($compFile, "<".$arrayName." "."xml:id='".$tagId."'>".$offset.",".$len2Next."</".$arrayName.">");
		}
		fwrite($compFile,"</milestone>");
	}
	fwrite($compFile, "</milestones>");
}

/* ****************************
 * Function:	ptCompile
 * Inputs:		1) xml source file to be compiled
 * 				
 * Output:		1) Strips all tags from the text,
 * 				outputs the source text as string, 
 * 				wrapped in <plaintext></plaintext tag
 * 				2) Length of plaintext (w/OUT the <plaintext></plaintext>
 * 				 outer tag) [Note, could do w/out computing the length,
 * 				 but then would have to do this and add the <plaintext>
 * 				 outer tag outside...]
 * ****************************/ 
function ptCompile($fn) {
	
	$file = fopen($fn,'r') or die("###ERROR opening file: ".$fn);
	$txt = "";
	$ptLength = 0;
	while (!feof ($file)) {
		$txt = $txt.fgets($file, 4096);
	}
	fclose($file);
	
	$txt = strtr($txt,"\n"," ");
	$txt = preg_replace("/\>\s*\</","><",$txt);
	$txt = preg_replace("/\<[^\>]*\>/","",$txt);
	//$txt = strip_tags($txt);
	//$txt = htmlspecialchars_decode($txt);

	//$ptLength = strlen($txt);
	$ptLength = strlen($txt);
	$txt = "<plaintext>".$txt."</plaintext>";
	
	return array($ptLength,$txt);
}
/* ****************************
 * Function:	buildOffsetArray
 * Input: 		node
 * 
 * output:		associative array: key=offset
 * 				value: tag id
 * 
 * goal:		use for bin search to find node given offset
 * */
function buildOffsetArray(&$node /*,$ptLength*/) {
//	echo "PlainText Len: ".$ptLength."<br>";

	$kids = $node->childNodes;
	$offsetArray = array();
	$subArr = array();
	$offset = 0;
	$len = 0;
	
	for ($i=0; $i<$kids->length;$i++) {
		$kid = $kids->item($i);
		
		if ($kid->nodeName == "#text") {
			list($offset, $len) = explode(",", $kid->nodeValue);
			$parName = $kid->parentNode->nodeName;
			//echo "Parent: ".$parName."==> ".$offset.", ".$len."<br>";
			for ($j=$offset;$j<$offset+$len;$j++) {
				$offsetArray[$j] = $kid;
			}
			
		} else {
			//echo "NODE: ".$kid->nodeName."<br>";
			$subArr = buildOffsetArray(&$kid/*, $ptLength*/);

			if (count($subArr) > 0) {
				$offsetArray = array_merge_recursive($offsetArray,$subArr);
			}
		}
	}
	return $offsetArray;
}

/* Function: offsetBinSearch
 * Input:		1) offset
 * 			2) hash/assoc.Array with offset:node pairs
 * output:	   Node (xml:id, that is)
 *
 */
function offsetBinSearch($needle, $haystack)
{
    $high = count($haystack);
    $low = 0;
echo "HIGH: ".$high." and LOW: ".$low."<BR>";
   
    while ($high - $low > 1){
        $probe = ($high + $low) / 2;
                $probe = intval($probe);
echo "PROBE: ".$probe."<BR>";

        if ($haystack[$probe] < $needle){
            $low = $probe;
        }else{
            $high = $probe;
        }
    }
echo "HIGH now: ".$high." and LOW now:".$low."<BR><BR>";
    if ($high == count($haystack) || $haystack[$high] != $needle) {
        return false;
    }else {
        return $high;
    }
}

?>
