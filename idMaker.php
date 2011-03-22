<?PHP
	ini_set("memory_limit", "1024M"); // incresed memory for some applications
set_time_limit(525600);
foreach (new DirectoryIterator('./data/GloryDays/XML') as $file) {
   // if the file is not this file, and does not start with a '.' or '..',
   // then store it for later display
   if ( (!$file->isDot())   && (substr($file->getFileName(),0,1)!=".")){

      // if the element is a directory add to the file name "(Dir)"
 	  $aFile = $file->getFileName();	
 	  if (strpos($aFile,".xml")>0){
	  $file = fopen('./data/GloryDays/XML/'.$aFile,'r') or die("###error");
		$txt = "";

while (!feof ($file)) {

    $txt .= fgets($file, 1024);
}
fclose($file);

$xml = new DOMDocument;
$xml->loadXML($txt);
$ele = $xml->getElementsByTagName("front")->item(0);
$prefix = substr($aFile,0,strpos($aFile,"."));
echo $aFile.": ".$ele->nodeName." prefix: ".$prefix."<br/>"; 
$newxml = setIDs($ele,0,$xml,$prefix);
$newxmltxt = $xml->saveXML();

$file = fopen('./data/GloryDays/XMLwID/'.$aFile,'w') or die("###error");
  fwrite($file,$newxmltxt);
  fclose($file);	
   }
   }
}
// Functions to get an xml:id prefix to make unique xml:id tags
// and to set xml:ids for any tags in a doc that don't have the xml:ids already

// Basically, this is the "generateID" that Doug created for EBP
// only passing @params from the calling script or function,
// versus getting GET[]/POST[] vars from HTTP.
// Used by testProc2DB.php for Quartos (as of 4/2009)

/* ****************************
 * Function:	getPrefix
 * Inputs:		1) filename of source file
 * 
 * Output:		an "xml:id" prefix based on file format
 * ****************************/ 
function getPrefix($fn) {
	
	$prefix = $fn;
	if (strlen($prefix)<1) {
		$prefix = "tag";
	}	
	return $prefix;
}

/* ****************************
 * Function:	setIDs
 * Inputs:		1) the current DOMele
 * 				2) the current counter (usu. Start at 0)
 * 				3) the xml being updated
 * 				4) the xml:id prefix (usually, the base filename)
 * 
 * Output:		sets ids for the xml
 */
function setIDs($ele,$counter,$xml,$prefix) {
	
	$kids = $ele->childNodes;
	$tagName = $ele->nodeName;
	
	if (($tagName=="#text") || (get_class($ele) == "DOMComment")) {	
		// nada needed
	} else {
		
    	if (!($ele->hasAttribute("xml:id"))) {

			// trying to ensure uniqueness if prefix
			// is only set as tag for some reason
			if ($prefix == "tag") {
				$prefix = "tag-".$ele->nodeName;
			}
			   	 
    		//echo "Setting xml:id: ".$prefix."-".$counter."<br>";
			$ele->setAttribute("xml:id",$prefix."-".$counter);
			$counter++;
    	}
		
		// recurse down tree
		if ($kids){
			foreach ($kids as $kid){
				$counter = setIDs($kid,$counter,$xml,$prefix);
			}
		}
	}	
	
	return $counter;	
}
?>
