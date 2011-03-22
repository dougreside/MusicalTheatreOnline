<?php
ini_set("memory_limit","240M");

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
$manifest = $mtoRootDir."manifest_IndexTest.xml";
$indexPath = $mtoRootDir."lib/Search/indexData";

//Zend_Search_Lucene_Analysis_Analyzer::setDefault(new CustomTokenizer());
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
$xml->load($manifest);

$showTags = $xml->getElementsByTagname("show");

foreach ($showTags as $show) {
	$showEls = $show->childNodes;

	foreach($showEls as $showMetaData) {
	
		switch($showMetaData->nodeName) {
			case "title":
				$title = $showMetaData->textContent;
				echo "title: ".$title."<br>";
			break;
		
			case "book":
				$book = $showMetaData->textContent;
				echo "book: ".$book."<br>";
			break;
		
			case "lyrics":
				$lyrics = $showMetaData->textContent;
				echo "lyrics: ".$lyrics."<br>";
			break;
		
			case "music":
				$music  = $showMetaData->textContent;
				echo "Music: ".$music."<br>";
			break;
		
			case "artifacts":
				$itemNodes = $showMetaData->childNodes;
			break;
		
			default:
				"no case for this tag!: ".$showMetaData->nodeName."<br>";	
			break;	
		}
	}

	foreach ($itemNodes as $item){
		if (strcmp($item->nodeName,"item")==0) {
			
			if ($item->hasAttribute("xml:id")) {
				$id = $item->getAttribute("xml:id");
				echo "ID: ".$id."<br>";
			}
	
			$doc = new Zend_Search_Lucene_Document();
	
			$doc->addField(Zend_Search_Lucene_Field::Keyword('xmlId',
            				                                  $id));
			$doc->addField(Zend_Search_Lucene_Field::Text('title',
            	    	                              $title,
                	    	                          'iso-8859-1'));
			$doc->addField(Zend_Search_Lucene_Field::Text('book',
            		                                  $book,
                    		                          'iso-8859-1'));
			$doc->addField(Zend_Search_Lucene_Field::Text('lyrics',
            	    	                              $lyrics,
                	    	                          'iso-8859-1'));
			$doc->addField(Zend_Search_Lucene_Field::Text('music',
            	                                  $music,
                	                              'iso-8859-1'));
											  	  
			$itemAtts = $item->childNodes;
			foreach ($itemAtts as $att) {
			
				switch($att->nodeName) {
					case "media":
					//echo "media: ".$att->textContent."<br>";
						$doc->addField(Zend_Search_Lucene_Field::Text('media',
                                              					$att->textContent,
                                              					'iso-8859-1'));
					break;
				
					case "label":
						//echo "label: ".$att->textContent."<br>";
						$label = $att->textContent;
						$doc->addField(Zend_Search_Lucene_Field::Text('label',
                                              					$label,
                                              					'iso-8859-1'));
					break;
				
					case "filename":
						//echo "filename: ".$att->textContent."<br>";
						$doc->addField(Zend_Search_Lucene_Field::UnIndexed('filename',
                                              					$att->textContent,
                                              					'iso-8859-1'));
					break;
				
					default:
						"No accounting for this attribute: ".$att->nodeName."<br>";
					break;
				}
			}
			// add the item info to the index
			echo "Adding ...".$label." to Index....<br>";
			$metaIndex->addDocument($doc);
		}										  
	}
}
$metaIndex->commit();
$metaIndex->optimize();	

echo "Badabing!<br>";	

echo "SIZE: ".$metaIndex->count()."<br>";
echo "Including non-deleted docs: ".$metaIndex->numDocs();

?>
