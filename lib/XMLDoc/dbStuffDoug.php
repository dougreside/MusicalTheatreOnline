<?php

/* ****************************
 * Function:	insertFile
 * Inputs:		1) database connection/db object 
 * 				2) filename of file being processed
 * 
 * Output:		Returns the f_id for the file entry that is inserted		
 * *****************************/
function insertFile(&$dbObj, $fn) {
	$qInsert = "INSERT INTO files SET filename='".$fn."';";
	$qSelect = "SELECT f_id FROM files where filename='".$fn."';";
	$f_id = -1;
	
	// Insert the info into the files table first
	if ($insert = $dbObj->query($qInsert)) {
		if ($insert->num_rows > 0) {
			echo "Insert successful!";
			$insert->close();
		}
	} else {
		echo "ERROR ON files INSERT for FILE: ".$fn."<br>";
	}
	
	// Now get the f_id for that file for processing through other tables
	if ($result = $dbObj->query($qSelect)) {
		$row = $result->fetch_assoc();
		$f_id = $row['f_id'];
		$result->close();
	} else {
		echo "ERROR ON files RETRIEVING f_id for FILE: ".$fn."<br>";
	}
	
	return $f_id;
}

/* ****************************
 * Function:	fidExists
 * Inputs:		1) database connection/db object 
 * 				2) filename of file being processed
 * 
 * Output:		0 if file hasn't been put in db;
 * 				1 if it has.
*/
function fidExists(&$dbObj, $fn) {
	$exists = 0;
	$query = "SELECT f_id, filename FROM files WHERE filename='".$fn."';";
	
	if ($qResult = $dbObj->query($query)) {
		if ($qResult->num_rows > 0) { 
		// we need to clean up and re-insert
			echo "NEED TO CLEAN UP ALL THE TABLEs ENTRIES for this FILE!!";
			// set $exists
			$exists = 1;
			// need to get the f_id for this filename
			$row = $qResult->fetch_assoc();
			$f_id = $row['f_id'];
			$file = $row['filename'];
			echo "FILE id: ".$f_id." for FILE: ".$file."<br>";
			// TODO:
			// 1) REMOVE the row from files table
			// 2) run a query to get a list of w_ids from word_file_rel, and remove all rows
			// with this file's file_id
			// 3) run a query to confirm w_ids for which this f_id was the only relation..??
			// HOW?? -- after this, remove all w_ids/words from words table where this is true
			// 4) Will have the same problem with tag_ids in the tag table...
			// *** Maybe can take care of with the w_id, tag_id, f_id composite key...?
			
		}
	}
	// safely close result
	$qResult->close();
	
	return $exists;
}

/* ****************************
 * Function:	&wSelPrep
 * Inputs:		1) ref to db connection
 * 
 * Output:		Returns the REF to the prepared words Selection stmt
 * Notes:		Wrapper that prepares the db statement		
 * *****************************/
function &wSelPrep(&$dbObj) {
	
	$wChkQuery = "SELECT w_id from words where w_word=?";
	if ($wordStmt = $dbObj->prepare($wChkQuery)) {
		return $wordStmt;
	} else {
		echo "ERROR on preparing Tags Update: ".$wChkQuery."<br>";
	}
}
	

function updateWords(&$dbObj, &$wordSelStmt, $word) {

	$w_id = 0;
	$w_id = checkWordTable($wordSelStmt, $word);
	
	if ($w_id == 0) {
		// prep insert of $word to w_word
		$wordsInsert = "INSERT into words SET w_word=?;";
		
		if ($insertStmt = $dbObj->prepare($wordsInsert)) {
			// bind $word for insert stmt	
			$insertStmt->bind_param('s', $word);
    		$insertStmt->execute() 
				or die ("Could not execute: ".$wordsInsert." for WORD: ".$word."<br>");
			// close stmt
    		$insertStmt->close();
	
		} else { 
			echo "<br>ERROR on preparing Words Insert: ".$wordsInsert." for WORD: ".$word."!<br>";
		}		
		
		//now that it's inserted, get the new tag 
		$w_id = checkWordTable($wordSelStmt, $word);
	}
	
	// close stmt from calling function!
	
	return $w_id;
    	
}

function checkWordTable(&$wordSelStmt, $word) {
	
	$w_id = 0;

	// bind w_id for select stmt	
	$wordSelStmt->bind_param('s', $word);
    $wordSelStmt->execute()
		or die ("Could not execute WORDS Select Stmt!<br>");

    // bind any results to $tag_id var
	$wordSelStmt->bind_result($w_id); 
	$wordSelStmt->store_result();
	
	// if we get a row with this tag_id, fetch the tag_id
    if ($wordSelStmt->num_rows == 1) {
		$wordSelStmt->fetch();
	}
	// Close the stmt from calling function,
	// after the handle is done being used...
	
	return $w_id;
}

/* ****************************
 * Function:	insertWord (**OLD**)
 * 				USING &wSelPrep(); checkWordTable();
 * 				and updateWords() a/o Jan2009
 * Inputs:		1) database connection/db object 
 * 				2) word to be inserted
 * 
 * Output:		Returns the w_id for the word entry that is inserted		
 * *****************************/
function insertWord(&$dbObj, $w) {
	
	$qInsert = "INSERT into words SET w_word='".$w."';";
	$qSelect = "SELECT w_id, w_word from words where w_word='".$w."'";
	
	// Check for the w_id for the input word for processing through other tables
	if ($result = $dbObj->query($qSelect)) {
		if ($result->num_rows > 0) {
			$row = $result->fetch_assoc();
			$w_id = $row['w_id'];
			$result->close();
		} else { // need to insert the word & get the new w_id for it
			if ($insert = $dbObj->query($qInsert)) {
				if ($insert->num_rows > 0) {
					echo "Word Insert: ".$w." successful!";
					$insert->close();
				} 
			} else {
					echo "ERROR ON words INSERT for WORD: ".$w."<br>";
					exit;
			}
			// Now get the w_id for the newly inserted word
			if ($result = $dbObj->query($qSelect)) {
				$row = $result->fetch_assoc();
				$w_id = $row['w_id'];
				$result->close();
			} else {
				echo "ERROR ON words RETRIEVING w_id for WORD: ".$w."<br>";
				exit;
			}
		}
	} else {
		echo "ERROR ON words RETRIEVING w_id for WORD: ".$w."<br>";
	}
	
	return $w_id;
}

function proc4db($baseFN, $wordList) {

	// set up the db connection
	$cnxn = new mysqli("localhost","root","root","SQA_login");
	if (mysqli_connect_errno()) {
		die ("Can't connect to MySQL Server. Errorcode: ". mysqli_connect_error(). "<br>");
	} 

	// insert file info into files table
	if (fidExists($cnxn, $baseFN) == 0) {
		$f_id = insertFile($cnxn, $baseFN);

	} else {
		echo "HAVE TO REMOVE STUFF for this file...<br>";
		echo " THEN have to insert the file info as though it were new<br>";
	}
		
	// initialize most/all processing statements
	// words table stmt refs
	$wordSelStmtHandle =& wSelPrep($cnxn);
	
	// word_fid_rel table stmt refs
	$wfrCntStmtHandle =& wfrSelPrep($cnxn); // returns ref to the prepp'd stmt
	$wfrUpdateStmtHandle =& wfrUpdatePrep($cnxn); 
		
	// tags table stmt refs
	$tagSelStmtHandle =& tagSelPrep($cnxn);
	
	// word_tag_f_rel table refs
	$twfInsertStmtHandle =& tagWordFilePrep($cnxn);
	
	// Loop through each word for this file, 
	//updating words, word_fid_rel, tags, word_tag_f_rel
	// PUT FOREACH HERE.....
	foreach ($wordList as $wAttribs) {
		
		list($xml_id, $tagOff, $tagLen, $w, $w_offset) = explode(":",$wAttribs);
		// make words & xml_ids ready for database entry
		$w = addslashes($w);
		$xml_id = addslashes($xml_id);
		echo "ID: ".$xml_id." : TAGOFFSET: ".$tagOff." : TAGLEN:".$tagLen." : WORD: ".$w." OFFSET: ".$w_offset."<br>";
	 
		// get the word id for this word
		// AFTER inserting, if required
		$w_id = updateWords($cnxn, $wordSelStmtHandle, $w);
		echo " W_ID: ".$w_id;
		// update the word_fid_rel table with this word/file's information
		updateWordFidRel($cnxn, $wfrCntStmtHandle, $wfrUpdateStmtHandle, $w_id, $f_id);
	
		// update the tags table for this word/tag
		$tag_id = updateTagsTable($cnxn, $tagSelStmtHandle, $xml_id, $f_id, $tagOff, $tagLen);
		echo " TAG_ID: ".$tag_id."<br><br>";
		// update word_tag_f_rel table
		updateWordTagFile($twfInsertStmtHandle, $w_id, $tag_id, $f_id, $w_offset);
	}
	// end FOREACH
	// close statement handles
	$wordSelStmtHandle->close();
	$wfrCntStmtHandle->close();
	$wfrUpdateStmtHandle->close();
	$tagSelStmtHandle->close();
	$twfInsertStmtHandle->close();
	
// WORDCOUNT TESTING Functions
$w_id = 23;
$f_id = 1;

$count = wordCount($cnxn, $w_id);
echo "COUNT OUT: ".$count."<br><BR>";

// close the db connection
$cnxn->close();

}

/* ****************************
 * Function:	&wfrUpdatePrep
 * Inputs:		1) ref to db connection
 * 
 * Output:		Returns the REF to the prepared wfrUpdate stmt
 * Notes:		Wrapper that prepares the db statement		
 * *****************************/
function &wfrUpdatePrep(&$dbObj) {
	
	$wfrUpdate = "UPDATE word_fid_rel SET w_count=? WHERE w_id=? and f_id=?";
	if ($wfrUpdateStmt = $dbObj->prepare($wfrUpdate)) {
		return $wfrUpdateStmt;
	} else {
		echo "ERROR on preparing wfrUpdate: ".$wfrUpdate."<br>";
	}
}

/* ****************************
 * Function:	&wfrSelPrep
 * Inputs:		1) ref to db connection
 * 
 * Output:		Returns the REF to the prepared wfrSelection stmt
 * Notes:		Wrapper that prepares the db statement		
 * *****************************/
function &wfrSelPrep(&$dbObj) {
	$wordCntQuery = "SELECT w_count from word_fid_rel where w_id=? and f_id=?;"; 
	if ($wfrCntStmt = $dbObj->prepare($wordCntQuery)) {
		return $wfrCntStmt;
	} else {
		echo "ERROR on preparing wfrUpdate: ".$wordCntQuery."<br>";
	}
}

/* ****************************
 * Function:	wordCount
 * Inputs:		1) ref to db connection
 * 				2) word to search
 * 
 * Output:		Returns the total count for that word 
 * 				over all processed xml files
 * Notes:		Wrapper that prepares the db statement
 * 				for the call to "getTotalCount()"		
 * *****************************/
function wordCount(&$dbObj, $w_id){
	$count = 0;
	$wordCntQuery = "SELECT w_count from word_fid_rel where w_id=?;";
	
	if ($wordCountStmt = $dbObj->prepare($wordCntQuery)) {
		$count = getTotalCount($wordCountStmt, $w_id);
	} else {
		echo "ERROR on preparing Word Count Query: ".$wordCntQuery."<br>";
	}
	
	return $count;
}

/* ****************************
 * Function:	getTotalCount
 * Inputs:		1) ref to an ALREADY prepared db stmt
 * 				** ASSUMES query format as follows:
 * 				** "SELECT w_count from word_fid_rel where w_id=?;" 
 * 				2) word to search
 * 
 * Output:		Returns the total count for that word 
 * 				over all processed xml files		
 * *****************************/
function getTotalCount(&$stmt, $w_id){	
	$count = 0; // count will be 0 unless it is incremented below

	// bind w_id for select stmt	
	$stmt->bind_param("i", $w_id);
    $stmt->execute();

    // bind w_count to result
	$stmt->bind_result($currCount);
	$stmt->store_result();
    if ($stmt->num_rows > 0) {
		while ($stmt->fetch()) {
	   		$count += $currCount;	
		}
	}
	
    // close stmt from calling Function!!
    //$stmt->close();
	
	return $count;
}

/* ****************************
 * Function:	wordCountByFile
 * Inputs:		1) ref to db connection
 * 				2) word to search
 * 
 * Output:		Returns the total count for that word 
 * 				over a specific file
 * Notes:		Wrapper that prepares the db statement
 * 				for the call to "getCountByFile()"		
 * *****************************/
function wordCountByFile(&$dbObj, $w_id, $f_id){
	$count = 0;
	$wordCntQuery = "SELECT w_count from word_fid_rel where w_id=? and f_id=?;";
	
	if ($wordCountStmt = $dbObj->prepare($wordCntQuery)) {
		$count = getCountByFile($wordCountStmt, $w_id, $f_id);
	} else {
		echo "ERROR on preparing Word Count Query: ".$wordCntQuery."<br>";
	}
	
	return $count;
}
/* ****************************
 * Function:	getCountByFile
 * Inputs:		1) ref to an ALREADY prepared db stmt
 * 				** ASSUMES query format as follows:
 * 				** "SELECT w_count from word_fid_rel where w_id=? and f_id=?;" 
 * 				2) word to search
 * 				3) file to search
 * 
 * Output:		Returns the total count for that word 
 * 				for that file -- or O, if it doesn't exist		
 * *****************************/
function getCountByFile(&$stmt, $w_id, $f_id){
	
	$count = 0; // count will be 0 unless it is already set for this file below

	// bind w_id for select stmt	
	$stmt->bind_param("ii", $w_id, $f_id);
    $stmt->execute();

    // bind w_count to result
	$stmt->bind_result($count);
	$stmt->store_result();
    if (($stmt->num_rows > 0) && ($stmt->num_rows == 1)) {
		$stmt->fetch();
	}
    // close stmt from calling Function!
    // $stmt->close();
	
	return $count;
}
/* ****************************
 * Function:	updateWordFidRel
 * Inputs:		1) ref to db cnxn object
 * 				2) ref to prepp'd insert stmt 
 * 				3) w_id from "words" table to be inserted
 * 				4) f_id from "files" table for the file being processed
 * 
 * Output:		update the word_fid_rel table for his w_id:f_id pair		
 * */
function updateWordFidRel(&$dbObj, &$cntStmt, &$wfrUpdateStmt, $w_id, $f_id) {

	// check if the w_id:f_id relation already exists and get the count
	$w_count = getCountByFile($cntStmt, $w_id, $f_id);
	
	if ($w_count == 0) { // need to insert the word & get the new w_id for it
	
		$w_count = 1;
		$wfrInsert = "INSERT into word_fid_rel VALUES (?,?,?);";
		
		if ($insertStmt = $dbObj->prepare($wfrInsert)) {
			// bind w_id for insert stmt	
			$insertStmt->bind_param('iii', $w_id, $f_id, $w_count);
    		$insertStmt->execute() 
				or die ("Could not execute: ".$wfrInsert."<br>");
			// close stmt
    		$insertStmt->close();
	
		} else { 
			echo "ERROR on preparing wfrInsert: ".$wfrInsert."!<br>";
		} 
		
	} else { // only need to update the count for this w_id:f_id
		$w_count = $w_count+1; // inc $w_count from current
		//echo "W_COUNT NOW: ".$w_count."<br>";
		
		$wfrUpdateStmt->bind_param('iii', $w_count, $w_id, $f_id);
		$wfrUpdateStmt->execute()
			or die ("Could not execute wfr Update!<br>");
		
		// close from Calling Function!
	}
	echo " in UpdateWordFidRel() -- W_COUNT: ".$w_count;
}			

/* ****************************
 * Function:	&tagSelPrep
 * Inputs:		1) ref to db connection
 * 
 * Output:		Returns the REF to the prepared tagSelection stmt
 * Notes:		Wrapper that prepares the db statement		
 * *****************************/
function &tagSelPrep(&$dbObj) {
	
	$tagChkQuery = "SELECT tag_id from tags where xml_id=? and f_id=?";
	if ($tagChkStmt = $dbObj->prepare($tagChkQuery)) {
		return $tagChkStmt;
	} else {
		echo "ERROR on preparing Tags Update: ".$tagChkQuery."<br>";
	}
	
}
	
function updateTagsTable(&$dbObj, &$TagsSelStmt, $xml_id, $f_id, $offset, $len) {

	$tag_id = 0;
	$tag_id = checkTagTable($TagsSelStmt, $xml_id, $f_id);
	
	if ($tag_id == 0) {
		// insert xml_id, f_id, offset, len
		//$tagsInsert = "INSERT INTO tags VALUES (?,?,?,?);";
		$tagsInsert = "INSERT INTO tags SET xml_id=?, f_id=?, offset=?, len=?;";
		
		if ($insertStmt = $dbObj->prepare($tagsInsert)) {
			// bind xml_id,f_id,$offset,$len for insert stmt	
			$insertStmt->bind_param('siii', $xml_id, $f_id, $offset, $len);
    		$insertStmt->execute() 
				or die ("Could not execute: ".$tagsInsert."<br>");
			// close stmt
    		$insertStmt->close();
	
		} else { 
			echo "<br>ERROR on preparing tagsInsert: ".$tagsInsert."!<br>";
		}		
		
		//now that it's inserted, get the new tag 
		$tag_id = checkTagTable($TagsSelStmt, $xml_id, $f_id);
	}
	// close stmt from calling function!
   	//$TagsSelStmt->close();
	return $tag_id;
    	
}

function checkTagTable(&$TagsSelStmt, $xml_id, $f_id) {
	
	$tag_id = 0;

	// bind w_id for select stmt	
	$TagsSelStmt->bind_param('si', $xml_id, $f_id);
    $TagsSelStmt->execute()
		or die ("Could not execute Tags Select Stmt!<br>");

    // bind any results to $tag_id var
	$TagsSelStmt->bind_result($tag_id); 
	$TagsSelStmt->store_result();
	
	// if we get a row with this tag_id, fetch the tag_id
    if ($TagsSelStmt->num_rows == 1) {
		$TagsSelStmt->fetch();
	}
	// Close the stmt from calling function,
	// after the handle is done being used...
	
	return $tag_id;
}

/* ****************************
 * Function:	&tagWordFilePrep
 * Inputs:		1) ref to db connection
 * 
 * Output:		Returns the REF to the prepared word_tag_f_rel INSERT stmt
 * Notes:		Wrapper that prepares the db statement		
 * *****************************/
function &tagWordFilePrep(&$dbObj) {
	
	$insert = "INSERT INTO word_tag_f_rel SET w_id=?, tag_id=?, f_id=?, w_offset=?;";
	if ($insertStmt = $dbObj->prepare($insert)) {
		return $insertStmt;
	} else {
		echo "ERROR on preparing tag word_tag_f_rel Insert: ".$insert."<br>";
	}
	
}
function updateWordTagFile(&$insertStmt, $w_id, $tag_id, $f_id, $w_offset) {
	
	// bind w_id, tag_id, file id, word offset for insert stmt	
	$insertStmt->bind_param('iiii', $w_id, $tag_id, $f_id, $w_offset);
   	$insertStmt->execute() 
		or die ("Could not execute word_tag_f_rel INSERT<br>");
		
}
?>
