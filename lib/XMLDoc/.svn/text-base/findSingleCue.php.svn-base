<?php
ini_set("memory_limit","128M");

if ($_GET['fn']) {
	$fn = $_GET['fn'];
} else {
	echo "No FILE!!";
	exit;
}

if ($_GET['xmlId']) {
	$xmlId = $_GET['xmlId'];	
} else {
	echo "Need a speaker to find cue lines for!<br>";
	exit;
}

// set up the db connection
$cnxn = new mysqli("localhost","root","root","SQA_login");
if (mysqli_connect_errno()) {
	die ("Can't connect to MySQL Server. Errorcode: ". mysqli_connect_error(). "<br>");
}

// Queries for previous speaker id, then for that previous speaker's lines
$pidQuery = "SELECT prevsp_id FROM speakers WHERE sp_xml_id=? and f_id=?;";	
$linQuery   = "SELECT who, sp_xml_id, sp_lines FROM speakers WHERE sp_xml_id=? and f_id=?;";

// prep & bind the query for previous speaker (cue)
if ($pidStmt = $cnxn->prepare($pidQuery)) {	
	if (!$pidStmt->bind_param('si',$xmlId, $fn)) {
		try {   
    		throw new Exception("MYSQL BindParam error for ".$pidQuery."!");   
    	} catch(Exception $e ) {
        	echo "Error No: ".$e->getCode(). " - ". $e->getMessage() . "<br >";
        	echo nl2br($e->getTraceAsString());
    	}
	}
} else { 
	echo "ERROR on prepp'ing MYSQL Query: ".$pidQuery."<br>";
}

// execute query for previous speaker 
if (!$pidStmt->execute()) { 
	try {   
      	throw new Exception("MYSQL could NOT execute Query: ".$pidQuery."!");   
    } catch(Exception $e ) {
        echo "Error No: ".$e->getCode(). " - ". $e->getMessage() . "<br >";
        echo nl2br($e->getTraceAsString());
    }
}
// bind result for use in final query for cue lines
// SHOULD be single result!
$pidStmt->bind_result($prevSpId); 
$pidStmt->fetch();
$pidStmt->close();

// prep/bind the query for getting speaker's cue lines
if ($lineStmt = $cnxn->prepare($linQuery)) {
	if (!$lineStmt->bind_param('si',$prevSpId, $fn)) {
		try {   
   			throw new Exception("MYSQL BindParam error for ".$linQuery."!");   
    	} catch(Exception $e ) {
        	echo "Error No: ".$e->getCode(). " - ". $e->getMessage() . "<br >";
        	echo nl2br($e->getTraceAsString());
    	}
	}
} else {
	echo "ERROR on prepp'ing MYSQL Query: ".$linQuery."<br>";
}
// execute
if (!$lineStmt->execute()) { 
	try {   
     	throw new Exception("MYSQL could NOT execute Query: ".$linQuery."!");   
    } catch(Exception $e ) {
        echo "Error No: ".$e->getCode(). " - ". $e->getMessage() . "<br >";
        echo nl2br($e->getTraceAsString());
    }
}
$lineStmt->bind_result($who, $cueXmlId, $lines);
$lineStmt->fetch();

// output formatting stuff
header("Content-Type: text/xml");
echo "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
$xmlDoc = new DOMDocument();
$xmlDoc->formatOutput = true;
$rowNode = $xmlDoc->createElement("result");

$spkrText = $xmlDoc->createTextNode($who);
$spkrNode = $xmlDoc->createElement("speaker");
$spkrNode->appendChild($spkrText);
$rowNode->appendChild($spkrNode);

$xmlText = $xmlDoc->createTextNode($cueXmlId);
$xmlIdNode = $xmlDoc->createElement("xml:id");
$xmlIdNode->appendChild($xmlText);
$rowNode->appendChild($xmlIdNode);

$linesText = $xmlDoc->createTextNode($lines);
$linesNode = $xmlDoc->createElement("lines");
$linesNode->appendChild($linesText);
$rowNode->appendChild($linesNode);

$spkrResult = $xmlDoc->saveXML($rowNode);
preg_replace('/<br\/>/', '//', $xmlString);	
echo $spkrResult;

// clean-up remaining queries/cnxns
$lineStmt->close();
$cnxn->close();
 
?>
