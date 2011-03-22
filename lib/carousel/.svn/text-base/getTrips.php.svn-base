<?php
header('Content-type: text/json; charset: UTF-8');
header('Cache-Control: must-revalidate');

error_reporting(E_ALL);

import_request_variables("gp", "rvar_");
$request = "http://travel.yahooapis.com/TripService/V1.1/tripSearch?appid=openrico" . 
				"&query=" . urlencode($rvar_query) . 
				"&start=" . $rvar_start .
				"&results=" . $rvar_results .
				"&output=json";

$ch = curl_init();
$timeout = 5; // set to zero for no timeout
curl_setopt ($ch, CURLOPT_URL, $request);
curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
$file_contents = curl_exec($ch);
curl_close($ch);

// return results
echo $file_contents;

?>









