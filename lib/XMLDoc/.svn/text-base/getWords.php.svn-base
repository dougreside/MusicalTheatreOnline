<?php
ini_set("memory_limit","64M");

// define CONSTANT for the mask that counts words in utf8-encoding
define("WORD_COUNT_MASK", "/\p{L}[\p{L}\p{Mn}\p{Pd}'\xhh\|]*/u");

// the original "define CONSTANT" for str_word_count (below)
// define("WORD_COUNT_MASK", "/\p{L}[\p{L}\p{Mn}\p{Pd}'\x{2019}]*/u");
/* the WORD_COUNT_MASK constant contains the meta characters:
 * p{L} => has the property of a letter
 * p{Mn} => has property of non-spacing mark
 * p{Pd} => has property of dash punctuation
 * \xhh => matches a two-byte UTF-8 character if the value is greater than 127
 * The original mask and str_word_count_utf8 was taken from php.net user 
 * contrib at:http://www.php.net/manual/en/function.str-word-count.php
 * and modified for \xhh versus x{2019} (hex unicode) -- seems to work
 * the same and added the "|" pipe for occasional TEI/SQA code found.
 * Notes added: Jan2009
*/

/* ****************************
 * Function:	strWordCountUTF8
 * Inputs:		1) string
 * 				[2) output format desired,
 * 				 where (1) returns array of words
 * 				 and (2) returns offsets -- 
 * 				 acts like built-in php function,
 * 				 str_word_count() &/or preg_match_all() ]			
 * Output:		Number of words, dependent on utf8-based WORD_COUNT_MASK constant
 * 				with format options, returns array of words/and/or offsets
 * 
 * ****************************/ 
function strWordCountUTF8($string, $format=0) {
	
	switch ($format) {
        case 1:
        	preg_match_all(WORD_COUNT_MASK, $string, $matches);
        	return $matches[0];
        case 2:
            preg_match_all(WORD_COUNT_MASK, $string, $matches, PREG_OFFSET_CAPTURE);
            $result = array();
            foreach ($matches[0] as $match) {
                $result[$match[1]] = $match[0];
        	}
    		return $result;
    }
	return preg_match_all(WORD_COUNT_MASK, $string, $matches);
}
/* ****************************
 * Function:	soloPunct
 * 				*** OLD -- Don't need it
 * 				*** now that strWordCountUTF8 
 * 				*** takes care of tags that contain
 * 				*** punct. only
 * Inputs:		1) DOM node (by ref)
 * 				
 * Output:		1 if the node contains ONLY punctuation;
 * 				else, 0
 * Goal:		Punctuation will not be databased as a "word"
 * ****************************/ 
function soloPunct(&$txtNode) {

	if (preg_match("/^[,.?]\s$/",$txtNode->textContent)) {
		return 1;
	}
	else { 
		return 0; 
	}
}

/* ****************************
 * Function:	getWords
 * 				*** OLD -- Don't seem to need it
 * 				*** now that strWordCountUTF8 
 * 				*** takes care of this....
 * Inputs:		1) DOM text node (by ref)
 * 				
 * Output:		If the parentNode of the text node
 * 				is a <w /> tag (i.e., a word), return it
 * 				else, assume it is a text string and
 * 				break it up into words 
 * ****************************/ 
function getWords(&$txtNode) {
	$words = $txtNode->nodeValue;
	
	$words = explode(' ', $words);
	foreach ($words as $word) {
		$word = stripPunct($word);
		$wordList[$word] = $txtNode->parentNode;
	}
	
	return $wordList;
}

/* ****************************
 * Function:	stripPunct
 * Inputs:		1) text content 
 * 				(string, presumed content of a text node)
 * 				
 * Output:		string/word without punctuation,
 * 				unless it represents a char. entity
 * 				e.g., &amp; &#x017F; &apos; 
 * ****************************/ 
function stripPunct(&$txtContent) {
	$trimmed = "";
	$trimmed = trim($txtContent);
	$trimmed = preg_replace('/[,.;:?!"\'()]$/','', $trimmed);
	$trimmed = preg_replace('/^[,.;:?!"\'()]/','', $trimmed);
	
	// below will get rid of ALL the char entities and any punct
	// within the word...don't want this (yet?)...till we figure
	// out char entity conv.
	//$txtContent = preg_replace('/[^a-zA-Z0-9-\s]/', '', $txtContent);

	return $trimmed;
}

?>