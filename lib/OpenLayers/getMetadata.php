<?php
/**
 * Edited and created by Grant Dickie of 
 * Maryland Institute of Technology in the Humanities, 2009
 * 
 * Borrowed from UNC Chapel Hill ContentDM system
 */

$TOMCAT_PREFIX="http://zelda.umd.edu:8080/";
$LANL_PREFIX="http://zelda.umd.edu:8080/adore-djatoka/resolver?url_ver=Z39.88-2004&rft_id=";
/**
 * Requires:
 * 
 * URL (String)
 *
 * Connect to Djatoka server
 */
getmetadata($LANL_PREFIX);
function getmetadata($prefix){
	$url=$_GET['url'];
	//now piece together the rest of the Djatoka getMetadata call
	$url=$prefix.$url."&svc_id=info:lanl-repo/svc/getMetadata";
	
	//run HTTP request and get response
	
$handle=curl_init();
	curl_setopt($handle, CURLOPT_URL, $url);
	curl_setopt($handle, CURLOPT_HEADER,0);
	//make it so that a response text is given
	curl_setopt($handle,CURLOPT_RETURNTRANSFER, true);
	$response= curl_exec($handle);
	curl_close($handle);
	echo $response;

}


?>