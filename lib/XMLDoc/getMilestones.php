<?php

/* ************ FUNCTIONS ************ */

function msLoad(&$msArray, &$lastPBTag, $f_id) {
	
	// set up the db connection
	//$cnxn = new mysqli("localhost","root","root","SQA_login");
	$cnxn = new mysqli("128.8.10.52:3306","root","wheresmy2$?","SQA_login");
	if (mysqli_connect_errno()) {
		die ("Can't connect to MySQL Server. Errorcode: ". mysqli_connect_error(). "<br>");
	} 
	// tags table stmt refs
	$tagSelStmtRef =& tagSelPrep($cnxn);
	
	// tag_attribs stmt refs
	$attsSelStmtRef =& attsSelPrep($cnxn);
	$attsInsertStmtRef =& attsInsertPrep($cnxn);
	
	// milestone relation stmt ref (ms_word_f_rel)
	$msSelStmRef =& msRelSelPrep($cnxn);
	$msRelInsertStmtRef =& msRelInsertPrep($cnxn);
	
	// words table stmt refs
	$wordSelStmtRef =& wSelPrep($cnxn);
	
	foreach ($msArray as $arrayName => $milestone) {

		echo "milestone unit='".$arrayName."'<br>";
		$count = count($milestone);
		
		//foreach($milestone as $index => $tag)	{
		for ($index=0; $index<$count; $index++) {
			
			if (isset($milestone[$index]->parentNode)) {
				$parentNode =  $milestone[$index]->parentNode;
				if (get_class($parentNode) == "DOMElement"){
					if ($parentNode->hasAttribute("xml:id")) {
						$parent_id = $parentNode->getAttribute("xml:id");
					}
				} else { // take care of rootText parent_id (should never happen, but...)
					$parent_id = "NULL"; 
				} 
			} else { // if parent node doesn't exist or is not set, default to NULL
					$parent_id = "NULL";
			}
			
			$name = $milestone[$index]->nodeName;
			$id = $milestone[$index]->getAttribute("xml:id");
			echo $index."==>".$name.":".$id." PARENT:".$parentNode->nodeName." ----- ";
			
			// update the tags table for this tag
			$tag_id = updateTagsTable($cnxn, $tagSelStmtRef, $name, $id, $f_id, $parent_id);
			
			// update the tag_attribs for this tag
			$atts = $milestone[$index]->attributes;
			if ($atts!=null) {
				foreach ($atts as $att){
					// check if the attribs for this tag exists; if not, insert
					updateAttsTable($attsSelStmtRef, $attsInsertStmtRef, $tag_id, $att->name, $att->value);
				}
			}
			
			// **TODO**: now only databasing word/ms relations for <pb /> and <lb /> tags..
			// Are there others, and do we want to get <gap /> tag info ....
			// how do we handle xml errors (e.g., <fw/> error, <ab/> error, etc)
			if (($arrayName == 'pb') || ($arrayName == 'lb')) {
				
			// now update the ms_word_f_rel table
			if (isset($milestone[$index+1])) {

				// set up, load, & get the next milestone tag_id
				$nextMStag_name = $milestone[$index+1]->nodeName;
				$nextMSxml_id = $milestone[$index+1]->getAttribute("xml:id");
				$nextMSparent_id = $milestone[$index+1]->parentNode->getAttribute("xml:id");
				$nextMS_id = updateTagsTable($cnxn, $tagSelStmtRef, $nextMStag_name, $nextMSxml_id, $f_id, $nextMSparent_id);
				
				// get the text in this block
				$xmlStr = trimTree($milestone[$index], $milestone[$index+1]);
				//echo $xmlStr."<br>";
			
				$xmlSeg = new DOMDocument();
				$xmlSeg->loadXML($xmlStr);
	
				$rootEle = $xmlSeg->documentElement;
				$txt = $rootEle->textContent;
				$segWords = array();
				$segWords = preg_split('/\s+/', $txt,-1,PREG_SPLIT_NO_EMPTY);
				$numWords = count($segWords);
				//echo "At ".$index.": There could be ".$numWords." words in this seg (punct. included).<br>";
				$num = 0;
				foreach ($segWords as $word) {
					$word = stripPunct($word);
					$len = strlen($word);
					if ($len>0) {
						//echo $num.":".$word."<br>";
						$w_id = updateWords($cnxn, $wordSelStmtRef, $word);
						// $num == word position in this milestone tag (e.g., in this page or <lb>)
						updateMSRelTable($msRelInsertStmtRef, $msSelStmRef, $w_id, $tag_id, $f_id, $num, $nextMS_id);
						$num++; 
					} else { 
					// do not database it... do nada
					}
				}
			} else { // we are at the last milestone tag in this milestone type (e.g., pb/lb/etc)
			
				if (isset($lastPBTag)) { //if we have a final tag to go to, do it
					if (($milestone[$index]->isSameNode($lastPBTag))) {
						// do nothing at this point -- do not database
						//echo "SAME NODES<br>";
					} else {
						
						// set up, load, & get the next milestone tag_id
						$nextMStag_name = $lastPBTag->nodeName; // should be "pb"!
						$nextMSxml_id = $lastPBTag->getAttribute("xml:id");
						$nextMSparent_id = $lastPBTag->parentNode->getAttribute("xml:id");
						$nextMS_id = updateTagsTable($cnxn, $tagSelStmtRef, $nextMStag_name, $nextMSxml_id, $f_id, $nextMSparent_id);
						
						$xmlStr = trimTree($milestone[$index],$lastPBTag);
						echo "LAST LAST LAST SEGMENT of TEXT:".$xmlStr."<br>";
						
						$xmlSeg = new DOMDocument();
						$xmlSeg->loadXML($xmlStr);
	
						$rootEle = $xmlSeg->documentElement;
						$txt = $rootEle->textContent;
						$segWords = array();
						$segWords = preg_split('/\s+/', $txt,-1,PREG_SPLIT_NO_EMPTY);
						$numWords = count($segWords);
						echo "At ".$index.": There could be ".$numWords." words in this seg (punct. included).<br>";
						$num = 0;
						foreach ($segWords as $word) {
							$word = stripPunct($word);
							$len = strlen($word);
							if ($len>0) {
								// echo $num.":".$word."<br>";
								$w_id = updateWords($cnxn, $wordSelStmtRef, $word);
								// $num == word position in this milestone tag (e.g., in this page or <lb>)
								updateMSRelTable($msRelInsertStmtRef, $msSelStmRef, $w_id, $tag_id, $f_id, $num, $nextMS_id);
								$num++; 
							} //else { 
							// do not database it...
							//}
						}
					}
				}
			}	
		} else {
			echo "NOT PB OR LB, MILESTONE name is: ".$arrayName." and COUNT".count($milestone)."<br>";
		}
	 }
  }
  // close statement handles
  $tagSelStmtRef->close();
  $attsSelStmtRef->close();
  $attsInsertStmtRef->close();
  $wordSelStmtRef->close();	
  $msSelStmRef->close(); 
  $msRelInsertStmtRef->close();
	
  // close the db cnxn
  $cnxn->close();

}

function getWordSegs(&$node,$path){
	
		if (get_class($node) == "DOMElement") {
			$id = $node->getAttribute("xml:id");
			if (isset($node->parentNode)) {
					$parentNode =  $node->parentNode;
					if (get_class($parentNode) == "DOMElement"){
						if ($parentNode->hasAttribute("xml:id")) {
							$parent_id = $parentNode->getAttribute("xml:id");
						}
					} else { $parent_id = "NULL"; } // take care of rootText parent_id
			} else {
					$parent_id = "NULL";
			}
			//echo "At node:".$node->nodeName." id:".$id." ParentId:".$parent_id."<br>";
				
			// update the tag_attribs for this tag
			$atts = $node->attributes;
			if ($atts!=null) {
				foreach ($atts as $att){
					echo "---- has Attributes:[".$att->name.",".$att->value."]<br>";
				}
			}
		}
		
		$kids = $node->childNodes;

		for ($i=0;$i<$kids->length;$i++) {
			
			$kid = $kids->item($i);
			
			if (get_class($kid) == "DOMText") {	
				
				$txt = stripPunct($kid->nodeValue);
				
				$word = array();
				$words = preg_split('/\s+/', $txt,-1,PREG_SPLIT_NO_EMPTY);
				$w_pos=0;
				echo "<br>";
				foreach ($words as $word){
					$word = stripPunct($word);
					
					echo $w_pos."=".$word."--PATH--".$path."<br>";
					$w_pos++;
				}
				echo "<br>";
			
			} else {
				
				$kidKids = $kid->childNodes;
				if ($kidKids->length==0) { 
					// do nothing...it's a lb/pb/etc with no kids...
				} else {

				$id = $kid->getAttribute("xml:id");
				
				$newpath = $path."|".$id;
				 
				getWordSegs(&$kid,$newpath);
				}

			}	
		}
		
		return;
}

// **** NOTE: SAME NAME, BUT DIFFERENT THAN buildmsArray in compileXML.php!!!!
function buildmsArray(&$ele) {

	$mileStones = array();
	$subArr = array();
	$tagName = $ele->nodeName;
	$kids = $ele->childNodes;		

	// build "milestones" array, keyed by milestone tag="pb"/"lb"/etc.
	if ((get_class($ele) == "DOMElement") && ($kids->length == 0)) {

		$mileStones[$tagName][] = $ele;
		
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

