<?php

// setting mem limit outrageous
ini_set("memory_limit","240M");

// require path to Zend Search library files
require_once("/Applications/ZendFramework-1.9.1/library/Zend/Search/Lucene.php");

echo "<?xml version='1.0' encoding='UTF-8'?>";

// init default search vars
$mtoIndexPath	= "/projects/mto/lib/Search/indexData";
$searchParams	= array();
$queryStr		= '';
$hitLimit		= 0;
$sortField		= 0;
$sortCount		= 0;

/* *****  Set up the query (as boolean) ***** */
$query = new Zend_Search_Lucene_Search_Query_Boolean();

/* ***** Get and parse through the $_GET array of params ***** */
$searchParams = $_GET;
if (count($searchParams) == 0) {
	echo "No Search Parameters entered!!<br>";
	exit;
}
foreach ($searchParams as $param => $value) {
	echo $param."=>".$value."<br>";
	
	switch ($param) {
		
		// Get the query itself
		case "queryStr":
			$queryStr = $value;
			//parseQuery($queryStr);
			$queryStr = validateQueryStr($queryStr);
			
		break;
		
		// is query specific to a show title?
		case "title":
			$titleStr = $value;
			$titleStr = validateQueryStr($titleStr);

			$titleSubQuery = Zend_Search_Lucene_Search_QueryParser::parse('title:\"'.$titleStr.'\"');
			$query->addSubquery($titleSubQuery, true /* required */);
		
		break;
		
		case "people":
			$peopleStr = $value;
			$peopleStr = validateQueryStr($peopleStr);
			
			$peopleSubQuery = Zend_Search_Lucene_Search_QueryParser::parse('book:\"'.$peopleStr.' music:\"'.$peopleStr.'\"'.' lyrics\"'.$peopleStr.'\"');
		    $query->addSubquery($peopleSubQuery, true /* OR, optional */);
			
		break;
			
		// is query specific to a media?
		case "media":
			$mediaType = $value;
			$mediaType = validateQueryStr($mediaType);

			$mediaSubQuery = Zend_Search_Lucene_Search_QueryParser::parse('media:\"'.$mediaType.'\"');
			$query->addSubquery($mediaSubQuery, true /* required */);
		
		break;
		
		// set Limits of number of hits returned [optional] 
		case "limitResults":
			$hitLimit = $value;
			if ($hitLimit > 0) {
				setHitLimit($hitLimit);	
			}	else {
				$hitLimit = 0;
			}
		break;
		
		// get any index fields to sort results on [optional]
		case "sortFields":
			$sortField = $value;

			if (($sortField != 0) || (strcmp($sortField, '') > 0)) {
				//echo "I Got a sortField:".$sortField."<br>";
				
				// parse a multi-sortField requirement
				list($sortFields, $sortCount) = parseSortField($sortField);
				switch($sortCount) {
					case 1:
						echo "Only 1 field: ".$sortField."<br>";
						$sortField = $sortFields;
						// $sortField = validateSortField($sortField);
					break;
					
					case 2:			
						$sortField1 = $sortFields[0];
						$sortField2 = $sortFields[1];
					break;
					
					case 3:
						$sortField1 = $sortFields[0];
						$sortField2 = $sortFields[1];
						$sortField3 = $sortFields[2];
						
					default:
						echo "Sorry, you can't have >3 indexed fields to sort on!<br>"
							."Using the first 3 fields to sort.<br>";
						$sortField1 = $sortFields[0];
						$sortField2 = $sortFields[1];
						$sortField3 = $sortFields[2];
					break;
				}
				
			}
		break;
		
		case "sortTypes":
			// set up to handle whether the sorting is SORT_REGULAR,
			// SORT_NUMERIC, or SORT_STRING (will need to check for each sortField)
		break;
		
		default:
			echo "#### Here's a \$_GET[] param: \$_GET['".$param."'] for which we have no case..? ####<br>";
			exit;
		break;
			
		
	}
}


/* ***** Open the index for searching ***** */
$metaIndex = Zend_Search_Lucene::open($mtoIndexPath);

// Add user query string to the query
$userQuery = Zend_Search_Lucene_Search_QueryParser::parse($queryStr);
// $query->addSubquery($userQuery, null /* If "null" is used, it's a logical "OR", or optional subquery */);
$query->addSubquery($userQuery, true /* required */);

// Could use parseQuery() and then just build a string as the 'query' to find....
// Would probably need to use a function like parseQuery() to set it up and validate
// its component parts
//$query = $queryStr;

/* ***** Find the query via "$index->find($query)" method, ***** */
/* ***** checking whether there is any sorting required   ***** */
switch ($sortCount) {
		case 0: // no sorting specified
			$results = $metaIndex->find($query);  
		break;
			
		case 1:
			$results = $metaIndex->find($query, $sortField /*$sortType*/);
		break;
		
		case 2:
			$results = $metaIndex->find($query, $sortField1, $sortField2);
		break;
		
		case 3:
			$results = $metaIndex->find($query, $sortField1, $sortField2, $sortField3);
		break;
		
		default:
			$results = $metaIndex->find($query, $sortField1, $sortField2, $sortField3);
		break;
			
}

 if(count($results)>0) {  
	$count = 0; 
	echo "Number of hits for search term(s) [".$query."] = ".count($results)."<br>"; 
	foreach ($results as $result){
		// return Zend_Search_Lucene_Document object for this hit
		$count++;
		echo "Result ".$count."<br>";
    	$document = $result->getDocument();
		echo "TITLE=[".$document->title."]<BR>";
		echo "LABEL=[".$document->label."]<BR>";
		echo "xml:id=[".$document->xmlId."]<BR>";
		echo "MEDIA type=[".$document->media."]<BR>";
		echo "FILENAME/path=[".$document->filename."]<BR>";
		echo "BOOK=[".$document->book."]<br>";

	}
	echo "<br>End of results";
}  else {
	echo "No results found in search for query terms: [".$query."]<br>";
}

/* **************************************************************
 * Function:		setHitLimit
 * @@Inputs:		1) # results a user has opted to set as 
 * 						ceiling for results returned (e.g., 10)
 * 
 * @@Output:		sets the limit of possible results returned
 * 
 * Dependencies:	requires Zend_Search_Lucene pkg
* *************************************************************** */
function setHitLimit($hitLimit) {
	
	Zend_Search_Lucene::setResultSetLimit($hitLimit);
}

/* **************************************************************
 * Function:		parseQuery
 *  **** Optional, and not complete a/o Jul31, 2009****
 * @@Inputs:		1) the $_GET['queryStr'] parameter's value
 * 
 * @@Output:		builds a string-based query, if valid
 * 					This could become the straight "query string,"
 * 					such as (word1 title:titleWord "wordInPhrase word2InPhrase")
 * Dependencies:	requires Zend_Search_Lucene pkg
* *************************************************************** */
function parseQuery($queryStr) {
	$queryItems = array();
	$plus = '/^\+/';
	
	$queryItems = split(',', $queryStr);
	foreach ($queryItems as $term) {
		echo $term."<br>";
		if (preg_match($plus,$term)>0) {
			// need to take care of () or "", too....
			echo "Got plus: ".$term."<br>";
			$searchStr = substr($term, 1);
			$searchStr = validateQueryStr($searchStr);
		}
	}
	
}
/* **************************************************************
 * Function:		validateQueryStr
 * @@Inputs:		1) the $_GET['queryStr'] parameter's value
 * 					 (or, a query string/term that needs to be checked
 * 					  against wildcard prefixes/constraints)
 * 
 * @@Output:		returns the queryStr, if valid
 * 
 * Dependencies:	requires Zend_Search_Lucene pkg
* *************************************************************** */
function validateQueryStr($queryStr) {
	$wildCard = "*";
	
	if (strcmp($queryStr, '') == 0) {
		echo "No Search Parameters entered!!<br>";
		exit;
	} else {
		echo "Searching for: ".$queryStr." ...Please wait...<br>";
		if ((strcmp($queryStr, $wildCard)) == 0) {
			echo "<br>Sorry, can't search for ANYthing (i.e., wildcard=*)<br>";
			exit;
		} else {
			$newPrefix = strpos($queryStr, $wildCard);
			echo "NEW PREF is: ".$newPrefix."<br>";
			$currMinPrefix = Zend_Search_Lucene_Search_Query_Wildcard::getMinPrefixLength(); 
			if ($newPrefix < $currMinPrefix) {
				Zend_Search_Lucene_Search_Query_Wildcard::setMinPrefixLength($newPrefix);
			}
		}
	}
	return $queryStr;
}

/* **************************************************************
 * Function:		parseSortField
 * @@Inputs:		1) the $_GET['sortField'] parameter's value
 * 
 * @@Output:		
 * 
 * Dependencies:	requires Zend_Search_Lucene pkg
* *************************************************************** */
function parseSortField($field) {
	$fields = array();
	
	$fields = split(',', $field);
	if (count($fields) > 1) {
		return array($fields, count($fields));

	} else {
		//echo $field."<br>";
		return array($field, 1);
	}
}
?>
