<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Music Theatre Online</title>

		<link rel="shortcut icon" href="images/favicon.ico" />
    <link rel="stylesheet" href="./projekktor/style/projekktor_theme_tll/style.css" type="text/css" media="screen" />

        <link rel="stylesheet" href="styles/mto-interface.css" type="text/css" media="screen" />
       	
	    <link rel="stylesheet" href="styles/tabs.css" type="text/css" media="screen" />

	    <link rel="stylesheet" type="text/css" href="./lib/yui270/build/datatable/assets/skins/sam/datatable.css" />

     <link rel="stylesheet" type="text/css" href="./lib/yui270/build/menu/assets/skins/sam/menu-skin.css"/>
        <link rel="stylesheet" type="text/css" href="./lib/yui270/build/resize/assets/skins/sam/resize.css" />
        <link rel="stylesheet" type="text/css" href="./lib/Popout/styles/popout.css" />
        
 		 <link rel="stylesheet" type="text/css" href="./lib/AudioPlayer/audioPlayer.css" />
<link rel="stylesheet" type="text/css" href="./lib/ImageViewer/imageViewer.css" />
<link rel="stylesheet" type="text/css" href="./lib/ImportBox/styles/importBox.css" />
	 <link rel="stylesheet" type="text/css" href="./lib/VideoPlayer/VideoPlayer.css" />
	 <link rel="stylesheet" type="text/css" href="./lib/OrderedImageViewer/OrderedImageViewer.css" />
		<!--[if IE 6]>
		    <style type="text/css">
               .tabheader {
               		position:relative;
               }
               .tabheader ul li a {
               		height:22px;
                    padding-top:3px;
               }
               .tabheader ul li#moreRight a, .tabheader ul li#moreLeft a {
               		line-height:20px;
               }
               .popout .ft .ftContents span.corner, .popout .hd .hdContents {
               		margin-right:-17px;
               }
               .popout .bd .bdContents  {
               		margin:0;
               }
               .popout {
               		padding:0;
               }
               .popout .hd .hdContents .hdBox {
               		margin-left:11px;
               }.popout .hd .hdContents .controls {
               		padding-right:0;
               }
		    </style>
		<![endif]-->

		<link rel="stylesheet" type="text/css" href="./lib/TextEditor/annotateSkin.css" />
		
				<script language="JavaScript" type="text/javascript">
        <?php
		
		$ad = $_POST['annoData'];
	
		$ad = stripslashes($ad);
		if (strlen($ad)>0){
		echo "importAnnos = ";
		echo $ad;
		}
		else{
			echo "importAnnos =[];";
		}
		?>
		</script>

		<script src="scripts/cufon.js" type="text/javascript">
        </script>
        <script src="scripts/Museo_300700font.js" type="text/javascript">
        </script>
        <script src="scripts/Museo_300_300.font.js" type="text/javascript">
        </script>
		
        <script type="text/javascript">
            Cufon.replace('h1', {
              color: '-linear-gradient(#fff, #bbeafb)'}, 
			{ fontFamily: 'Museo 300' })('h2', { fontFamily: 'Museo 700' })('h3', { fontFamily: 'Museo 700' })
			('#nav a', { fontFamily: 'Museo 300' })
			('.search-area p', {  hover: 'true' }, { fontFamily: 'Museo 300' });
        </script>
        <!-- YUI Library -->
        <script type="text/javascript" src="./lib/yui270/build/yahoo-dom-event/yahoo-dom-event.js">
        </script>
	
<script type="text/javascript" src="./lib/yui270/build/element/element-min.js"></script>

        <script type="text/javascript" src="./lib/yui270/build/container/container_core-min.js">
        </script>
		
        <script type="text/javascript" src="./lib/yui270/build/menu/menu-min.js">
        </script>
        <script language="JavaScript" type="text/JavaScript" src="./lib/yui270/build/yahoo/yahoo-min.js">
        </script>
        <script type="text/javascript" src="./lib/yui270/build/utilities/utilities.js">
        </script>
        <script type="text/javascript" src="./lib/yui270/build/container/container.js">
        </script>
        <script type="text/javascript" src="./lib/yui270/build/resize/resize.js">
        </script>
        <script type="text/javascript" src="./lib/yui270/build/connection/connection.js">
        </script>
		
		<script type="text/javascript" src="./lib/yui270/build/editor/editor-min.js"></script>
       	<script language="JavaScript" type="text/javascript">
    		MTO = YAHOO.namespace("mto");
		</script>	
	    <script type="text/javascript" src="./lib/TextEditor/TextEditor.js">
        </script>
        <script type="text/javascript" src="./lib/Tab/Tab.js">
        </script>
        <script type="text/javascript" src="./lib/XMLObj/XMLObj.js">
        </script>
		   <script type="text/javascript" src="./lib/Diff/DiffPanel.js">
        </script>
        <script type="text/javascript" src="./lib/Popout/popout.js">
        </script>
        <script type="text/javascript" src="./lib/Blinds/tools-min.js">
        </script>
        <script type="text/javascript" src="./lib/Blinds/effects-min.js">
        </script>
        <script type="text/javascript" src="./lib/Workspace/Workspace.js">
        </script>
		        <script type="text/javascript" src="./lib/annotationManager/annotationManager.js">
        </script>
		<script type="text/javascript" src="./lib/AudioPlayer/AudioPlayer.js">
        </script>
           
   
		     
			   <script type="text/javascript" src="./lib/ImageViewer/scripts/ImageViewer.js">
        </script>
        <script type="text/javascript" src="./lib/yui270/build/datasource/datasource-min.js">
        </script>
        <script type="text/javascript" src="./lib/yui270/build/datatable/datatable-min.js">
        </script>
		     <script type="text/javascript" src="./lib/ImageViewer/scripts/jquery.js">
        </script>
	     <script type="text/javascript" src="./lib/VideoPlayer/VideoPlayer.js">
        </script>
	     <script type="text/javascript" src="./lib/ImportBox/importAnnos.js">
        </script>
             <script type="text/javascript" src="./lib/OrderedImageViewer/OrderedImageViewer.js">
        </script>
       <script type="text/javascript" src="./lib/jquery.min.js"></script>
        <script type="text/javascript" src="./scripts/jquery-ui-1.7.2.custom.min.js">
		</script>
		<script type="text/javascript" src="./flowplayer/flowplayer-3.2.4.min.js">
        </script>
        <script type="text/javascript">
		<!--
		function confirmation() {
			var answer = confirm ("Are you sure you want to exit this page? All unsaved annotations will be lost.")
			if (answer){
				window.location = "index.html";
			}
			else{
			}
		}
		//-->
</script>

<script type="text/javascript" src="./lib/ImageViewer/scripts/galleria.js">
        </script>
        <script type="text/javascript" src="./interface.js">
        </script>
    </head>
    <body>
        <div id="container" class="container">
            <div class="header">
                <a href="index.html" id="logo"></a>
                <div id="title">
                </div>
                <ul id="nav">
                    <li>
                        <a href="index.html">Home</a>
                    </li>
                    <li>
                        <a href="about.html">About</a>
                    </li>
                    <li>
                        <a href="contact.html">Contact</a>
                    </li>
                </ul>
            </div>
            <div class="search-area">
        		
					<div class="toolsMenu">
						<h2>Tools: </h2>
						<p class="toolsMenuList">
							<img class="menuImg" src="images/icon_compare.jpg" /><a onclick="openCompare()">Compare</a>
							
							<img src="images/icon_annotate.jpg" /><a onclick="annoSwitch()">Annotate <span id="onOff">OFF</span></a> 
							 | <a onclick="saveAnnotations()">Save</a> | <a onclick="loadAnnotation()">Import</a> | <a id="hideShow">Hide</a>
							<img class="menuImg" src="images/icon_search.jpg" /><a onclick="confirmation()">Browse</a>

						</p>
						
						
						<!--
						<ul class="toolsMenuList">
	                        <li class="col1"><h2>Tools: </h2></li>
							<li class="col2 top"><img class="menuImg" src="images/icon_search.jpg" /><a href="#">Browse</a></li>
							<li class="col3 top"><img src="images/icon_annotate.jpg" /><a onclick="annoSwitch()">Annotate <span id="onOff">OFF</span></a></li>
	                        <li class="col4 top"><img class="menuImg" src="images/icon_compare.jpg" /><a onclick="openCompare()">Compare</a></li>
                        </ul> -->
						
					</div>                
				
				<!--<form class="search">
                    <select name="searchcriteria">
                        <option value="all" class="list-item" selected="selected">All</option>
                        <option value="show" class="list-item">Show</option>
                        <option value="people" class="list-item">People/Org.</option>
                        <option value="theatre" class="list-item">Theatre</option>
                        <option value="season" class="list-item">Season</option>
                    </select>
                    <img src="images/dropdownbutton-2.jpg" /><input type="text" class="searchbox" value="Enter search terms..." onblur="if(this.value==''){this.value='Enter search terms...'}" onfocus="if(this.value=='Enter search terms...'){this.value=''}" name="s" /><input class="submitbutton" type="image" src="images/searchbutton-2.jpg"/>
                </form>
                <p>
                    <a href="#">Advanced Search</a>
                </p>-->
            </div>
            <div class="workspace">
                <div class="tabs">
                    <div class="tabheader">
                        <ul id="tabList">
                          <li classname="overflow" id="moreLeft"><a>&lt;</a></li>
						   <li classname="overflow" id="moreRight"><a>&gt;</a></li>
                        </ul>
                    </div>
                    <div class="media">
                    
						<a  
			 		href="http://localhost:8888/mto/data/stub.mp3"  
			 style="display:inline;width:0px;height:0px"  
			 id="audioFlowPlayer"> 
		</a> 
				
                        </div>
                    <div class="tabcontents">
                        
                        <div class="titleBlock">
                            <div class="titleText" >
                                <h2 id="titleText">Glory Days</h2>
                            </div>
                            <div class="controls" id="controlBlock">
                                <div class="textSwitcher" id="textSwitcher">
                                    <p>
                                        Choose text size:
                                    </p>
                                    <a href="#" onclick="changeFont(1.1, this)">
                                        <p class="small">
                                            A
                                        </p>
                                    </a>
                                    <a href="#" id="medFont" onclick="changeFont(1.3, this)">
                                        <p class="medium">
                                            A
                                        </p>
                                    </a>
                                    <a href="#" onclick="changeFont(1.5, this)">
                                        <p class="large">
                                            A
                                        </p>
                                    </a>
                                </div>
                                <div class="audioControls">
                                    <a href="#" onclick="Play()" id="playButton" class="play">
                                        <p>
                                            Play
                                        </p>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <!-- End titleBlock -->
                        <div id="mainContent">
                        </div>
                    </div>
                </div>
                <!-- End tabs -->
            </div>
            <!-- End workspace -->
            <div class="sidebar">
                <div class="sidebox-extras">
                    
                    <div id="spExtras" class="sidepanel">
                        <div id="dynamicSidebox" class="sideboxContents">
							<img class="showLogo" src="images/GloryDaysLogo.jpg" alt="Glory Days Logo" />
						</div>
                    </div>
                </div>
                <div class="sidebox-related">
                    
                    <div class="sidepanel related-content">
                        	<div  class="sideboxContents">
	                            <h2>Glory Days</h2>
		                            <ul class="tools-list">
		                            <li class="col1" onclick="changeMedia('text')"><img src="images/icon_text.jpg" /><a href="#">Text</a></li>
									<li class="col1" onclick="changeMedia('video')"><img src="images/icon_video.jpg" /><a href="#">Video</a></li>
		                            <li class="col1" onclick="changeMedia('other')"><img src="images/icon_other.jpg" /><a href="#">Misc.</a></li>
		                        
								    <li class="col2 top" onclick="changeMedia('audio')"><img src="images/icon_audio.jpg" /><a href="#">Audio</a></li>
		                            <li class="col2" onclick="changeMedia('images')"><img src="images/icon_image.jpg" /><a href="#">Image</a></li>
									<li class="col2" onclick="#"><img src="images/icon_search.jpg" /><a onclick="confirmation()">Browse</a></li>
									
									</ul> 
									
								<div id="rcl" class="relatedContentList">
	                            </div>
								
	                            <p class="btnOpenRelated">
	                                <a id="openItemsButton" onclick="openItems(this)"><img src="images/btn_openrelated.jpg" alt="get selected results" /></a>
	                            </p>
                        	</div>
						</div>
                    </div>
                
            </div>
            <div class="footer">
                <p class="copyright">
                    Site &copy; 2009 Maryland Institute for Technology in the Humanities
                </p>
                <p class="contact">
                    <a href="contact.html">Contact Us</a>
                </p>
            </div>
        </div>
       	<form action="./sendData.php" method="POST" name="annos"><input type="hidden" name="annoData" id="annoData"/></form>
        <script type="text/javascript">
            Cufon.now();
        </script>
<script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script type="text/javascript">
try {
var pageTracker = _gat._getTracker("UA-15119221-1");
pageTracker._trackPageview();
} catch(err) {}</script>
    </body>
</html>
