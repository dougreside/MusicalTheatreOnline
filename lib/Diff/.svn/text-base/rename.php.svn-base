<?php
set_time_limit(525600);
$dir = getcwd()."/DiffHTML";

function doit($dir){
	
// Open a known directory, and proceed to read its contents
if (is_dir($dir)) {
    if ($dh = opendir($dir)) {
    


        while (($file = readdir($dh)) !== false) {
        
     	
        	if ((strlen($file)>3)&&($file!==".DS_Store")){
        		   	
        //	$num = str_pad((int) $i,3,"0",STR_PAD_LEFT);
     		$oldname = "$dir/$file";
			$newname = str_replace(".html",".xml", $oldname);
			
			
			rename($oldname,$newname);
			echo $newname."<br/>";
        	}
			$i++;
			
        }
        closedir($dh);
    }
}
}
echo "starting";
doit($dir);
echo "done";
?>
