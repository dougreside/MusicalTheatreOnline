<?php
ini_set("memory_limit","128M");
ini_set("max_execution_time","120");

require("./getWords.php");
require("./dbStuff.php");
/*
if ($_GET['fn']) {
	$fn = $_GET['fn'];
}
*/
echo "<?xml version='1.0' encoding='UTF-8'?>";

//$fn = "http://localhost:8888/EBP/XML/hamShort_processed.xml";
//$fn = "http://localhost:8888/EBP/lib/XMLDoc/hamnowShort_processed.xml";
//$fn = "http://localhost:8888/EBP/XML/p3ham-1603-22275x-hun-c01_processed.xml";
//$fn = "http://localhost:8888/EBP/XML/ppham-1604-22276x-fol-c01_processed.xml";

//$fn = "http://localhost:8888/EBP/XML/ppham-1604-22276x-fol-c01.xml";
//$fn = "http://localhost:8888/EBP/XML/p3ham-1603-22275x-hun-c01.xml";
//$fn = "http://localhost:8888/EBP/XML/ppham-1604-22276x-hun-c01.xml";

//$fn = "http://localhost:8888/EBP/XML/final-ham-1603-22275x-hun-c01.xml";
$fn = "http://localhost:8888/EBP/XML/procXML/ham-1603-22275x-hun-c01.xml";
$origfn = "http://localhost:8888/EBP/XML/origXML/final-ham-1603-22275x-hun-c01_orig.xml";
$baseFN = basename($origfn);

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

$charArray = $xml->getElementsByTagname("name");
$spkrArray = $xml->getElementsByTagname("sp");
$spkrKeys	= array();

foreach ($spkrArray as $sp) {
	$currKey = $sp->getAttribute("who");
	if ($sp->firstChild->nodeName == "speaker") {
		$currSpkr = stripPunct($sp->firstChild->nodeValue);
	} else {
		$currSpkr = "ER";
	}
	//echo "KEY: [".$currKey."] NAME: [".$currSpkr."]<br>";
	if (preg_match("/,/",$currKey)) { // a multi-speaker speech
		$multSpkrs = split(",", $currKey);
		foreach ($multSpkrs as $singleSp) {
			$singleSp = preg_replace('/^[#]/', '', $singleSp);
			$singleSp = trim($singleSp);
			// get longest name for key
			compareNames($singleSp, $currSpkr, $spkrKeys);
		}
	} else { // not a multi-speaker speech
		// clean up the key (remove "#", trim whitespace)
		$currKey = preg_replace('/^[#]/', '', $currKey);
		$currKey = trim($currKey);
		// get longest name for key
		compareNames($currKey, $currSpkr, $spkrKeys);
	}	
}

// need to merge the speakers and <name type='character'> tag arrays
// since character names typically contain full name, not abbreviated
foreach ($charArray as $char) {
	if ($char->getAttribute("type") == "character") {
		$charKey = $char->getAttribute("key");
		// clean up the character 'who' (remove "#", trim whitespace)
		$charKey = preg_replace('/^[#]/', '', $charKey);
		$charKey = trim($charKey);
		$currSpkr = stripPunct($char->firstChild->nodeValue);
		// echo "KEY: [".$charKey."] NAME: [".$currSpkr."]<br>";
		// get longest name for key
		compareNames($charKey, $currSpkr, $spkrKeys);
	}				
} 

// set up the db connection
//$cnxn = new mysqli("localhost","root","root","SQA_login");
//$cnxn = new mysqli("khelone.umd.edu","root","wheresmy2$?","SQA_login");
$cnxn = new mysqli("minerva.umd.edu","sqa_user","sqa_user","SQA_login");
if (mysqli_connect_errno()) {
	die ("Can't connect to MySQL Server. Errorcode: ". mysqli_connect_error(). "<br>");
} 
// speaker table stmt refs
$key2spkrInsertRef =& key2SpkrInsert($cnxn);
$key2spkrSelRef =& key2SpkrSelPrep($cnxn);

// get f_id for file, based on original filename
$f_id = fidExists($cnxn, $baseFN);
//echo "FID: ".$f_id."<br>";

foreach ($spkrKeys as $key=>$who) {
	echo $f_id.": ".$key.": ".$who."<br>";
	insertKey2SpkrTbl($key2spkrSelRef, $key2spkrInsertRef, $f_id, $key, $who);
}

$key2spkrInsertRef->close();
$key2spkrSelRef->close();
$cnxn->close();
 
 
/* ***************************************
 * Name:	compareNames
 * Input:	(1) a 'key' for a character name (e.g., "ham", "lea", "oph")
 * 			(2) a current string for a character name to be checked
 * 			(3) an array of existing speaker/char keys+names (by ref)
 * Output:	 string that represents longest character name (e.g., Queen vs. Quee.; Horatio vs. Hora)
 * 
 * ***************************************/
function compareNames($currKey, $currName, &$nameArray) {
	
	// if the key already exists, need to check
	// existing name against current
	if (array_key_exists($currKey,$nameArray)) {
	
		// get strlen of curr (newest) name 
		$currLen = strlen($currName);
		// get strlen of existing name for this key
		$existLen = strlen($nameArray[$currKey]);
		// if the current is longer, make it the name for this key
		if ($currLen>$existLen) {
			$nameArray[$currKey] = $currName;
		} // else, keep the existing key (do nuthin)
		
	// it's a new key/name pair, just add it 
	} else {
		$nameArray[$currKey] = $currName;
	}

}

?>
