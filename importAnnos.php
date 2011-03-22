<?php

if (is_uploaded_file($_FILES['myFile']['tmp_name']))
  $fileData = file_get_contents($_FILES['myFile']['tmp_name']);
  
 echo $fileData; 
?>
  