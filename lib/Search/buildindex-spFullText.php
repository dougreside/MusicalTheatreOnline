<?php
ini_set("memory_limit","240M");

//for Windows
//require_once("C:\PHP\includes\ZendFramework\library\Zend\Search\Lucene.php");
//require_once("C:\Apache\htdocs\mto\Search\customTokenizer.php");

// require path to Zend Search library files
require_once("/Applications/ZendFramework-1.9.0b1/library/Zend/Search/Lucene.php");
require_once("./customTokenizer.php");

echo "<?xml version='1.0' encoding='UTF-8'?>";

if ($_GET['indexConf']) {
	$indexConf = $_GET['indexConf'];
} else {
	
	$usage = "#### ERROR ####"
			."<br>If CREATING TOTALLY new index from manifest, set indexConf='new'<br>"
			."If RE-CREATING a search index by overwriting the existing, set indexConf='renew'<br>"
			."If ADDING/UPDATING to the current index), indexConf='update'<br>";
	echo $usage;
	exit;
}

$mtoRootDir = "/Applications/MAMP/htdocs/mto/";
$xmldoc =  
$xmldocPtah = $mtoRootDir.$xmldoc;
$indexPath = $mtoRootDir."lib/Search/indexDataFull";

// Zend_Search_Lucene_Analysis_Analyzer::setDefault(new CustomTokenizer());
// Common_TextNum_CaseInsensitive() tokenizer includes numbers as tokens --
// but it is also case-insensitive
// might have to combine the CustomTokenizer from the TextNum_CaseInsensitive in future...?
Zend_Search_Lucene_Analysis_Analyzer::setDefault(
		new Zend_Search_Lucene_Analysis_Analyzer_Common_TextNum_CaseInsensitive());
	
switch ($indexConf) {
	case "new":
		echo "CREATING NEW!<br>";
		$metaIndex = Zend_Search_Lucene::create($indexPath);
	break;
	
	case "renew":
		echo "UPDATING OLD!<BR>";
		// should be able to get an index path to remove
		// and retrieve indexed docs to delete by $index->delete($doc->id)
		// but doesn't seem to work (at least, not the ways I tried....7/27/2009)
		$cmd = "rm ".$indexPath."/*";
		echo "REMOVING current Index Files!<br>";
		system($cmd);
		$metaIndex = Zend_Search_Lucene::create($indexPath);
	break;
	
	case "update":
		$metaIndex = Zend_Search_Lucene::open($indexPath);
	break;
	
	default:
		$usage = "#### ERROR ####"
			."<br>If CREATING TOTALLY new index from manifest, set indexConf='new'<br>"
			."If RE-CREATING a search index by overwriting the existing, set indexConf='renew'<br>"
			."If ADDING/UPDATING to the current index), indexConf='update'<br>";
		echo $usage;
		exit;
	break;
	
}

$xml = new DOMDocument();
$xml->load($xmldoc);

//TBD: should harvest file metadata here: fileid, title, edition

$bodyTags = $xml->getElementsByTagname("body");

foreach ($bodyTags as $bod) {
	$bodElements = $bod->childNodes;
	
	foreach($bodElements as $bodContent) {
	    if ($bodContent->nodeName != 'lb') {
	    $doc = new Zend_Search_Lucene_Document();
	    
	    //TBD: should add source document id, title, edition here
		
		switch($bodContent->nodeName) {
			case "stage":
				$stageContent = $bodContent->textContent;
				//echo "stage: ".$stageContent."<br>";
				if ($bodContent->hasAttribute("xml:id")) {
		  		$stageid = $bodContent->getAttribute('xml:id');
		 		//echo "stage: ".$stageid."<br>"; 
		 		}
				if ($bodContent->hasAttribute("type")) {
				  $stagetype = $bodContent->getAttribute('type');
				  //echo "stagetype: ".$stagetype."<br>"; 
				  }
				else { $stagetype = "untyped"; }
				$doc->addField(Zend_Search_Lucene_Field::Keyword('stageID', $stageid));
				$doc->addField(Zend_Search_Lucene_Field::Keyword('stageType', $stagetype));
				$doc->addField(Zend_Search_Lucene_Field::Text('stageContent', $stageContent, 'iso-8859-1'));

			break;
			
			case "sp":
			//	if ($bodContent->hasAttribute("who")) {
				//echo "node ".$bodContent->nodeName." encountered with speaker ";
				$spid = $bodContent->getAttribute("xml:id");
				$whoid = $bodContent->getAttribute("who");
				//echo "who: ".$whoid."<br>";
			//	}
				$spNodes = $bodContent->childNodes;
						foreach ($spNodes as $spch) {
			//echo $spch->nodeName." node found with spid ".$spid."<br>";

			$doc->addField(Zend_Search_Lucene_Field::Keyword('spid', $spid));
			// $doc->addField(Zend_Search_Lucene_Field::Text('title', $title, 'iso-8859-1'));
			switch($spch->nodeName) {
				case "speaker":
				//echo "media: ".$att->textContent."<br>";
					$doc->addField(Zend_Search_Lucene_Field::Text('speaker', $spch->textContent, 'iso-8859-1'));
				break;
				
				case "lg":
					$lgNodes = $spch->childNodes;
					
					$doc->addField(Zend_Search_Lucene_Field::Keyword('who', $whoid, 'iso-8859-1'));
					$lines = '';
					foreach ($lgNodes as $line){
						//if (strcmp($spch->nodeName,'l')==0) {
						if ($bodContent->nodeName != 'lb') {
							echo "line node found:".$line->textContent."<br>";
							//$doc->addField(Zend_Search_Lucene_Field::Text('line', $line->textContent, 'iso-8859-1'));
							$lines = $lines . $line->textContent . ' ';
						} 
					}
					$doc->addField(Zend_Search_Lucene_Field::Text('line', $lines, 'iso-8859-1'));
				break; 
			
				case "p":
					if ($spch->hasAttribute("xml:id")) {
					$pid = $spch->getAttribute('xml:id');
					echo "ID: ".$pid."<br>";
					}
					//echo "filename: ".$att->textContent."<br>";
					$doc->addField(Zend_Search_Lucene_Field::Keyword('who', $whoid, 'iso-8859-1'));
					$doc->addField(Zend_Search_Lucene_Field::Keyword('pID', $pid));
					$doc->addField(Zend_Search_Lucene_Field::Text('p', $spch->textContent, 'iso-8859-1'));
				break;  
			
				default:
					"No accounting for this attribute: ".$spch->nodeName."<br>";
				break;
	
				// add the item info to the index
				echo "Adding ...".$spch->nodeName." to Index....<br>";			
			} 										  
		}
			break;
		
			default:
				"no case for this tag!: ".$bodContent->nodeName."<br>";	
			break;	
		}
		$metaIndex->addDocument($doc); 
		}
	}
}

//$metaIndex->addDocument($doc);
$metaIndex->commit();
$metaIndex->optimize();	

echo "Badabing!<br>";	

echo "SIZE: ".$metaIndex->count()."<br>";
echo "Including non-deleted docs: ".$metaIndex->numDocs();

?>
