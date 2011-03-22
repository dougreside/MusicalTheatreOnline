<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
</head>
<body style="font-family:arial">
<? 
if ($_INFO['set']) { 
  $_INFO['title'] = "Source Of " . $_GET['$url']; 
  $_INFO['loghit'] = 1; 
} else { 
//ShowSource.php 
//purpose: show the source for a web page 
//usage: showsource?url=<<href>> 
//returns: the code for a file, with pretty colours 
//notes: will complain if file is not a text file or web page 
$url = $_GET['url']; 
print "<div style='margin: 0px 10px 0px 10px;'>";
print "<strong>Source of: $url</strong>"; 
if(empty($url)) 
{ 
  print "<BR><B>ERROR: URL Name needed</B><BR>\r\nUse content.php?module=showsource&url=filename.php or click <A HREF=\"content.php?module=sourceof&good=yes\" TARGET=\"_top\">View Source of...</A> in the sidebar\r\n"; 
} 
else if (strstr($url, "/.") || $url{0} == "." || $url{0} == "/") // disallow access to hidden files and folders 
   print "Sorry, you may not access hidden files or folders"; 
else if (ereg("(\.php|\.inc|\.htm|\.html|\.txt|\.css)$",$url)) 
{ 
  $fp = fopen($url, "r"); 
  if ($fp) 
  { 
  	print "<div style='padding:10px;margin:10px 0px 10px 0px;border:1px solid gray;'>";
   //print "<TABLE BORDER=2 BGCOLOR=\"white\"><TR><TD>\r\n"; 
   $b = ""; 
   while ($a = fgets($fp, 1000)) 
     $b .= $a; 
   fclose($fp); 
   highlight_string($b); 
   print "</div>";
   //print "</TD></TR></TABLE>\r\n"; 
  } 
  else 
   print "<strong>ERROR: Cannot open $url</strong>"; 
} 
else 
  print "<strong>ERROR: Filename must end .php, .inc, .htm, .html, .txt or .css</strong>"; 

//print "Processed: ".date("Y/M/d H:i:s",time()); 
print "</div>";
?> 
<?}?>

</body>
</html>