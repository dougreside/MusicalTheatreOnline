<?php

echo "<?xml version='1.0' encoding='UTF-8'?>";

// GET the filename for which database entries should be deleted....
$fn = $_GET['fn']; // e.g., ppham-1604-22276x-hun-c01_orig.xml

// array vars for tags and words (tables without direct f_id relation)
$tagsArray			= array();
$keepFidsArray		= array();
$widsArray			= array();
$widsInOtherFiles 	= array();
$wids2delete 		= array();


// set up the db connection
// ** TEST connection (local)
$cnxn = new mysqli("localhost","root","root","SQA_login");
//** TODO: CHANGE to minerva connection when needed!! **
//$cnxn = new mysqli("minerva.umd.edu","sqa_user","sqa_user","SQA_login");


if (mysqli_connect_errno()) {
	die ("Can't connect to MySQL Server. Errorcode: ". mysqli_connect_error(). "<br>");
} 

// Get the f_id for the input filename
$f_id = fidExists($cnxn, $fn);

if ($f_id == 0) {

	echo "YO YO YO -- NO f_id in SQA_login matches this fid: ".$f_id."!!<br>NUTHIN' to delete.<br>";

} else {
	echo ".....DELETING entries for f_id:file:".$f_id.":".$fn."......<br><br>";
	
	// 1) delete from key2speakers where f_id=X
	$cnxn->query("DELETE FROM key2speakers WHERE f_id=".$f_id.";");
	echo "Buh-Bye from key2speakers: ".$cnxn->affected_rows." rows for f_id ".$f_id."<br>";
	
	// 2) delete from speakers where f_id=X
	$cnxn->query("DELETE FROM speakers WHERE f_id=".$f_id.";");
	echo "Buh-Bye from speakers: ".$cnxn->affected_rows." rows for f_id ".$f_id."<br>";
	
	// 3) delete from ms_word_f_rel where f_id=X
	$cnxn->query("DELETE FROM ms_word_f_rel WHERE f_id=".$f_id.";");
	echo "Buh-Bye from milestones->file rel: ".$cnxn->affected_rows." rows for f_id ".$f_id."<br>";
	
	// 4) delete from word_tag_f_rel where f_id=X
	$cnxn->query("DELETE FROM word_tag_f_rel WHERE f_id=".$f_id.";");
	echo "Buh-Bye from words->file rel: ".$cnxn->affected_rows." rows for f_id ".$f_id."<br>";
	
	// 5) GET the list for all tags that have f_id=X
	
	if ($tagSelStmt = $cnxn->prepare("SELECT tag_id FROM tags WHERE f_id=?")) {

    	$tagSelStmt->bind_param("i", $f_id);
	    $tagSelStmt->execute(); 
		$tagSelStmt->bind_result($tag);

	    // fetch tags
    	while ($tagSelStmt->fetch()) {
        	$tagsArray[] = $tag;
    	} 
	} else {
		"ERROR prepp'ing tags selection: ".$tagSelStmt."<br>";
		exit();
	}
	$tagSelStmt->close();
		
	// 6) FOREACH tag_id in list created in 5, delete from tag_attribs where tag_id=Y
	$count=0;
	foreach ($tagsArray as $tag2delete) {
		$cnxn->query("DELETE from tag_attribs WHERE tag_id=".$tag2delete.";");
		$count += $cnxn->affected_rows;
	}	
	echo "Buh-Bye attribs (".$count.") for tags in f_id=".$f_id."<br>";

	// 7) then can delete from tags where f_id=X
	$cnxn->query("DELETE FROM tags WHERE f_id=".$f_id.";");
	echo "Buh-Bye from tags: ".$cnxn->affected_rows." rows for f_id ".$f_id."<br>";

	/* 8)  Build a list of w_ids which are associated ONLY with f_id=X
 	* Get a list of w_ids from word_fid_rel that are associated with f_id=X
 	* Get a list of w_ids from all other f_ids.
 	* For each w_id that is in widList1, but that is NOT in all the other widLists,
 	* we have a w_id we can delete....
 	* */
	// First get the f_ids for all files except the one to delete
	if ($fidSelStmt = $cnxn->prepare("SELECT f_id FROM files WHERE f_id!=?")) {

    	$fidSelStmt->bind_param("i", $f_id);
	    $fidSelStmt->execute(); 
		
		$fidSelStmt->bind_result($keepFid);

	    // fetch tags
    	while ($fidSelStmt->fetch()) {
        	$keepFidsArray[] = $keepFid;
    	} 
	}
	$fidSelStmt->close();
	
	// Prepp a statement to get w_ids associated w/files in word_fid_rel
	$widSelStmt = $cnxn->prepare("SELECT w_id FROM word_fid_rel WHERE f_id=?");
	
	// Get the w_ids associated with the f_id that are candidates to delete
	$widSelStmt->bind_param("i", $f_id);
	$widSelStmt->execute(); 
		
	$widSelStmt->bind_result($candidateWid);

    // fetch wids that are in the file to delete, 
	// but that might also be in other files
   	while ($widSelStmt->fetch()) {
   		if (!in_array($candidateWid,$widsArray)) {
       		$widsArray[] = $candidateWid;
		}
   	} 
	sort($widsArray, SORT_NUMERIC);

	// Now get the w_ids associated with the f_ids to keep
	foreach ($keepFidsArray as $fid2keep) {

    	$widSelStmt->bind_param("i", $fid2keep);
	    $widSelStmt->execute(); 
		
		$widSelStmt->bind_result($keepWid);

	    // fetch wids that will need to be kept
    	while ($widSelStmt->fetch()) {
    		if (!in_array($keepWid,$widsInOtherFiles)) {
        		$widsInOtherFiles[] = $keepWid;
			}
    	} 
	}
	
	$widSelStmt->close();
	sort($widsInOtherFiles, SORT_NUMERIC);
	
	// Get the difference in the two arrays --
	// The result is what can be deleted.
	$wids2delete = array_diff($widsArray,$widsInOtherFiles);
	sort($wids2delete, SORT_NUMERIC);
	
	foreach ($wids2delete as $deleteWid) {
		$cnxn->query("DELETE FROM words WHERE w_id=".$deleteWid.";");
		echo "Buh-Bye w_id:".$deleteWid." (only seen in f_id: ".$f_id.").<br>";
	}
	
	// Now we can delete the w_ids associated with this f_id 
	// from word_fid_rel.....
	$cnxn->query("DELETE FROM word_fid_rel WHERE f_id=".$f_id.";");
	echo "Buh-Bye from word->fid rel: ".$cnxn->affected_rows." rows for f_id ".$f_id."<br>";
	
	// Finally, delete the f_id from files;
	$cnxn->query("DELETE FROM files WHERE f_id=".$f_id.";");
	echo "......And Buh-Bye f_id:".$f_id."(".$cnxn->affected_rows.")<br>";
	
}

$cnxn->close();


/* ****************************
 * Function:	fidExists [** also in dbStuff.php **]
 * Inputs:		1) database connection/db object 
 * 				2) filename of file being processed
 * 
 * Output:		0 if file hasn't been put in db;
 * 				Else, the f_id for the existing file				
 * *****************************/
function fidExists(&$dbObj, $fn) {

	$f_id = 0;
	$select = "SELECT f_id FROM files where orig_fn=?;";
	
	if ($selectStmt = $dbObj->prepare($select)) {
		
		// bind f_id for select stmt	
		$selectStmt->bind_param('s', $fn);
    	$selectStmt->execute()
			or die ("ERROR: could NOT EXEcute files Select Stmt".$select."<br>".mysql_error()."<br>");

    	// bind any results to $tag_id var
		$selectStmt->bind_result($f_id); 
		$selectStmt->store_result();
	
		// if we get a row with this tag_id, fetch the tag_id
    	if ($selectStmt->num_rows == 1) {
			$selectStmt->fetch();
		}
	} else {
			echo "ERROR on preparing files Select: ".$select."<br>";
	}
	
	return $f_id;
}
?>
