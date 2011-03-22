<?php
set_time_limit(525600);
$dir = getcwd()."/GloryDaysPics";


    if ($dh = opendir($dir)) {
    


        while (($file = readdir($dh)) !== false) {
        
  
        	if ((strlen($file)>3)&&(substr($file,0,1)!==".")){
				   	echo "<item><filename>./GloryDaysPics/$file</filename>
         <Description>  
          </Description>		  
	</item>";   		   	
			}
			
        }
        closedir($dh);
    }

?>

