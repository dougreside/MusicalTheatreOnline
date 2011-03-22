<?php
ini_set("memory_limit","128M");

$results = array();

if ($_GET['fn']) {
	$fn = $_GET['fn'];
} else {
	echo "No FILE!!";
	exit;
}

if ($_GET['who']) {
	$who = $_GET['who'];	
} else {
	echo "Need a speaker to find cue lines for!<br>";
	exit;
}

// set up the db connection
$cnxn = new mysqli("localhost","root","root","SQA_login");
if (mysqli_connect_errno()) {
	die ("Can't connect to MySQL Server. Errorcode: ". mysqli_connect_error(). "<br>");
}

$whoQuery = "SELECT sp_xml_id, prevsp_id, f_id FROM speakers WHERE who=? and f_id=?;";	

if ($selPrevSpkrs = $cnxn->prepare($whoQuery)) {		
	// bind "who" for select stmt	
	$selPrevSpkrs->bind_param('si',$who, $fn);
} else { 
	echo "ERROR on prepp'ing WHO Query: ".$whoQuery."<br>";
}

$selPrevSpkrs->execute()
		or die ("ERROR: could NOT EXEcute speakers Select Stmt".$whoQuery."<br>");

// bind results for array and store them for count
$selPrevSpkrs->bind_result($spXmlId, $prevSpId, $fid); 
$selPrevSpkrs->store_result();

$numResults = $selPrevSpkrs->num_rows;
$count=0;

header("Content-Type: text/xml");
echo "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
echo "<xmlResults>";
$xmlDoc = new DOMDocument();
$xmlDoc->formatOutput = true; // enable some <html> formatting

if ($numResults > 0) {

	// output Total Results
	$numResultsNode = $xmlDoc->createElement("TotalResults");
	$numResultsText = $xmlDoc->createTextNode($numResults);
	$numResultsNode->appendChild($numResultsText);
	$xmlString = $xmlDoc->saveXML($numResultsNode);
	preg_replace('/<br\/>/', '//', $xmlString);	
	echo $xmlString;
	
	while ($selPrevSpkrs->fetch()) {
		$count++;
		$rowNode = $xmlDoc->createElement("result");
		$rowCountNode = $xmlDoc->createElement("count");
		$rowCountText = $xmlDoc->createTextNode($count ." of ".$numResults);
		$rowCountNode->appendChild($rowCountText);
		$rowNode->appendChild($rowCountNode);
	
		$spkrText = $xmlDoc->createTextNode($spXmlId);
		$spkrNode = $xmlDoc->createElement("speaker");
		$spkrNode->appendChild($spkrText);
		$rowNode->appendChild($spkrNode);
	
		$prevSpkrText = $xmlDoc->createTextNode($prevSpId);
		$prevSpkrNode = $xmlDoc->createElement("prevSpkr");
		$prevSpkrNode->appendChild($prevSpkrText);
		$rowNode->appendChild($prevSpkrNode);
	
		$fidText = $xmlDoc->createTextNode($fid);
		$fidNode = $xmlDoc->createElement("f_id");
		$fidNode->appendChild($fidText);
		$rowNode->appendChild($fidNode);
	
		$xmlString = $xmlDoc->saveXML($rowNode);
		preg_replace('/<br\/>/', '//', $xmlString);	
		echo $xmlString;
	}
} else {
	// output "0" results...
	$numResultsNode = $xmlDoc->createElement("TotalResults");
	$numResultsText = $xmlDoc->createTextNode($numResults);
	$numResultsNode->appendChild($numResultsText);
	$xmlString = $xmlDoc->saveXML($numResultsNode);
	preg_replace('/<br\/>/', '//', $xmlString);	
	echo $xmlString;
}
echo "</xmlResults>";

?>

