<?php



if (is_uploaded_file($_FILES['uploadedfile']['tmp_name']))
 { 
 
 $fileData = file_get_contents($_FILES['uploadedfile']['tmp_name']);
 	echo $fileData;
 }
 
?> 