<?php

// require path to Zend Search library files
require_once("/Applications/ZendFramework-1.9.1/library/Zend/Search/Lucene.php");

echo "<?xml version='1.0' encoding='UTF-8'?>";

$mtoSearchPath = "./indexData";
$fields = array();

$fields = getIndexFields($mtoSearchPath, "all");
echo "Total fields (unindexed/indexed): ".count($fields)."<br>";
foreach ($fields as $field) {
	echo "Field: ".$field."<br>";
}
	
echo "<br><br>";
$fields = getIndexFields($mtoSearchPath, "indexed");
echo "Total fields (indexed ONLY): ".count($fields)."<br>";
foreach ($fields as $field) {
	echo "Field: ".$field."<br>";
}


/* **************************************************************
 * Function:		getIndexFields
 * @@Inputs:		1) path to Lucene index (already built)
 * 					2) type of fields - indexed, unindexed or all
 * 					
 * @@Output:		1) array of fields -- MINUS 
 * 
 * Dependencies:	
* *************************************************************** */
function getIndexFields($path, $type) {

	$index = Zend_Search_Lucene::open($path);
	$fields = array();
	
	switch ($type) {
		case "indexed":
			$fields = $index->getFieldNames(true /* indexed fields list */);
			return $fields;
		break;
		
		case "all":
			$fields = $index->getFieldNames(false);
			return $fields;
		break;
	
		default:
			return $fields; // should be empty
		break;
	}
}

?>
