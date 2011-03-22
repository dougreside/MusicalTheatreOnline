<?php

echo "<?xml version='1.0' encoding='UTF-8'?>";
// source *.xml file details
// ** Enter the path to your *.xml files -- e.g., "/mto/XML/"
// ** Don't forget the trailing "/"

$path = "/Applications/MAMP/htdocs/mto/XML/";
$files = array();
$ext = "xml";

$files = getFilesFmDir($path, $ext);

foreach ($files as $file) {
	echo $file."<br>";
}


/* **************************************************************
 * Function:		getFilesFmDir
 * @@Inputs:		1) full dir path where source files are
 * 					[ 2) OPTIONAL: extension for files desired, e.g., *.txt, *.sql ]
 * 
 * @@Output:		1) array of files in that dir -- depending on extension, if given
 * 						(** NOT ".", "..", or other hidden ".<name>" files **)
 * 
 * Dependencies:	
* *************************************************************** */
function getFilesFmDir() {
	
	$numArgs = func_num_args();
	$argList = func_get_args();
	$dirListing = array();
	
	switch ($numArgs) {
		case 0:
			echo "USAGE: getFileList(directoryPath, <optional: file extension>)<br>";
			echo "........where directoryPath is complete path of directory of interest<br>";
			echo "........and file extension is extension of files desired, eg. *.txt, *.sql<br>";
			break;
		
		case 1:
			echo "Retrieving all files from directory: ".$argList[0]."<br>";
			$dirListing = dirListing($argList[0]);
			break;
		
		case 2:
			echo " Retrieving files w/ ext: ".$argList[1]." from Dir: ".$argList[0]."<br>";
			$dirListing = dirListingWithExt($argList[0], $argList[1]);
			break;
		
		default:
			echo "USAGE: getFileList(directoryPath, <optional: file extension>)<br>";
			echo "........where directoryPath is complete path of directory of interest<br>";
			echo "........and file extension is extension of files desired, eg. *.txt, *.sql<br>";
			break;
	}
	
	return $dirListing;

}

/* **************************************************************
 * Function:		dirListing
 * @@Inputs:		1) full dir path where source files are
 * 
 * @@Output:		1) array of files in that dir 
 * 							(** NOT ".", "..", or other hidden ".<name>" files **)
 * 
 * Dependencies:	
* *************************************************************** */
function dirListing($path) {
	
	if ($dirHandle = opendir($path)) {
		//echo "My dir handle for path ".$path." is: ".$dirHandle."<br>";
		//echo "Files in ".$dirHandle." directory: <br>";
		while (false !== ($file = readdir($dirHandle))) {
			// make sure you don't get "." and ".." files in the dir
			// or any hidden files that start w/ ".", like .DS_store or .svn
			$dotFile = preg_match('/^\./', $file);
			if ($dotFile == 0) {
				$fileList[] = $file;
			}
		}
	}
	sort($fileList);
	return $fileList;
}

/* **************************************************************
 * Function:		dirListingWithExt
 * @@Inputs:		1) full dir path where source files are
 * 					2) extension: retrieve only the files with this extension of interest
 * @@Output:		1) array of files in that dir 
 * 							(** NOT ".", "..", or other hidden ".<name>" files **)
 * 
 * Dependencies:	
* *************************************************************** */
function dirListingWithExt($path, $ext) {

	if ($dirHandle = opendir($path)) {
		//echo "My dir handle for path ".$path." is: ".$dirHandle."<br>";
		//echo "Files in ".$dirHandle." directory: <br>";
		while (false !== ($file = readdir($dirHandle))) {
			// make sure you don't get "." and ".." files in the dir
			// or any hidden files that start w/ ".", like .DS_store or .svn
			$dotFile = preg_match('/^\./', $file);
			if ($dotFile == 0) {
				$checkExt = pathinfo($file, PATHINFO_EXTENSION);
				if (strcasecmp($checkExt, $ext) == 0) {
					$fileList[] = $file;
				}
			}
		}
	}
	sort($fileList);
	return $fileList;
}

?>
