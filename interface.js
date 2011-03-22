
String.prototype.trim = function() { return this.replace(/^\s+|\s+$/g, ''); };


var annoToggle = false;
var PlayButton = document.createElement("a");

PlayButton.id = "playButton";
PlayButton.className = "play";
PlayP = document.createElement("p");
PlayP.appendChild(document.createTextNode("Play"));
PlayButton.appendChild(PlayP);
YAHOO.util.Event.addListener(PlayButton.id, "click", function(){
    Play();
    
});
PlayButton.setAttribute("onclick", "Play()");
var PauseButton = document.createElement("a");

PauseButton.id = "pauseButton";
PauseP = document.createElement("p");
PauseP.appendChild(document.createTextNode("Pause"));
PauseButton.appendChild(PauseP);
PauseButton.className = "pause";

YAHOO.util.Event.addListener(PauseButton.id, "click", function(){
    Pause();
});


annoInstruct = "<h3>Notes</h3><p>Highlight the text you want to annotate and add your comments in the popup box.</p>";
titleIcon = "<img src='images/GloryDaysLogo.jpg' alt='Glory Days Logo' />";
function hide(){
	annoMgr.hideAnnos(annoMgr);	
	var hs = document.getElementById("hideShow");
	YAHOO.util.Event.removeListener(hs,"click",hide);
	YAHOO.util.Event.addListener(hs,"click",showNotes);
	//hideShow.setAttribute("onClick","showNotes()");
	hs.removeChild(hs.firstChild);
	hs.appendChild(document.createTextNode("Show"));
}
function showNotes(){
	annoMgr.showAnnos(annoMgr);	
	var hs = document.getElementById("hideShow");
	YAHOO.util.Event.removeListener(hs,"click",showNotes);
	YAHOO.util.Event.addListener(hs,"click",hide);
	hs.removeChild(hs.firstChild);
	hs.appendChild(document.createTextNode("Hide"));
}
function compare(){
    left = document.getElementById("cmpLeft").value;
    right = document.getElementById("cmpRight").value;
	if (left == right) {
		var error = document.createElement("div");
		error.className = "errorMsg";
		error.appendChild(document.createTextNode("These are the same text.  No differences detected."));
		document.getElementById("cmpLeft").parentNode.parentNode.parentNode.appendChild(error);
	}
	else {
		left = left.substring(left.lastIndexOf("/") + 1, left.lastIndexOf("."));
		right = right.substring(right.lastIndexOf("/") + 1, right.lastIndexOf("."));
		
		
		diffstr = "./lib/Diff/DiffHTML/" + left + right + ".html";
		
		var callback = {
			success: function(o){
			
			
				de = document.createElement("div");
				de.innerHTML = o.responseText;
				dw = document.getElementById("textBlock");
				dw.innerHTML = de.innerHTML;
				workspace.activeTab.content = document.getElementById("textBlock").getElementsByTagName("div").item(0);
				
			},
			failure: function(o){
				alert(o.responseText);
				
			}
		};
		YAHOO.util.Connect.asyncRequest('GET', diffstr, callback);
	}
}

function GetXmlHttpObject(){

    var xmlHttp = null;
    try {
        // Firefox, Opera 8.0+, Safari
        xmlHttp = new XMLHttpRequest();
    } 
    catch (e) {
        // Internet Explorer
        try {
            xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
        } 
        catch (e) {
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
    }
    return xmlHttp;
}

function openCompare(){
    workspace.showDiffs();
}

function loadContent(fname){
	    var xmlDoc;
		var resp;
        // code for IE
        if (window.ActiveXObject) {
			
			  req = GetXmlHttpObject()
    req.open("GET", fname, false);
    req.send(null);

		resp =req.responseText;
		}
		// code for Mozilla, Firefox, Opera, etc.
		else {
		
			
			var xmlhttp = new window.XMLHttpRequest();
xmlhttp.open("GET",fname,false);
xmlhttp.send(null);
 resp = xmlhttp.responseText;
		}
			
      
		

		return resp;
	
	
}

function playAudio(id){
    if (!annoToggle) {
    
        workspace.playAudioTrack(id);
        setButton(false);
    }
    
}

function highlight(id){
    document.getElementById(id).className = 'red';
}
function showNote(noteId,noteText){
	var dsb = document.getElementById('dynamicSidebox');
	dsb.className="sbNote sideboxContents";
	dsb.innerHTML = "<h3>Notes</h3><div class='notes'>"+noteText+"</div><div class='noteControl'><a onclick='editNote(\""+noteId+"\")'><img src='./images/btn_edit.gif'/></a><a onclick='deleteNote(\""+noteId+"\")'><img src='./images/btn_delete.gif'/></a></div>";
	
}
function editNote(noteId){
	var num = parseInt(noteId.substring(noteId.indexOf("_")+1));
	var notetxt = annoMgr.pageAnnos[workspace.curTab][num][3];
	this.annoMgr.te.mode=num;
	this.annoMgr.te.myEditor.setEditorHTML(notetxt);
	this.annoMgr.te.show();
		
	
}
function deleteNote(noteId){
	var delNote = document.getElementById(noteId);
	var par = delNote.parentNode;
	var kids = par.childNodes;
	var num = parseInt(noteId.substring(noteId.indexOf("_")+1));
	
	var delNoteObj = annoMgr.pageAnnos[workspace.curTab][num];
	//var delPos = parseInt(delNoteObj[1])+1;
	var delPos=-1;
	//alert(annoMgr.pageAnnos[workspace.curTab]);
	for (var i=0;i<kids.length;i++){
		if (kids[i].id == noteId) {
			delPos = i;
		}
		else {
			if (kids.item(i).className == "fnstar")  {
				//Would be more efficient to begin at the child number of delNode
				var noteid = kids.item(i).id;
				
				var thisnum = parseInt(noteid.substring(noteid.indexOf("_")+1));
				//alert(kids.item(i).className+" "+noteid+"/"+thisnum);
				var otherNote = annoMgr.pageAnnos[workspace.curTab][thisnum];
				if (( (delPos)>=0) && (thisnum>num)) {
					otherNote[1] = parseInt(otherNote[1]) - 2;
					otherNote[2] = parseInt(delNoteObj[2]) + parseInt(otherNote[2]);
					delPos=-1;
				}
			//
				
				
			}
		}
	}
	delNote.parentNode.removeChild(delNote);	
	annoMgr.pageAnnos[workspace.curTab].splice(num,1);
	var dsb = document.getElementById('dynamicSidebox');
	if (annoToggle) {
		dsb.innerHTML = annoInstruct;
		
	}
	else{
		dsb.innerHTML = workspace.titleIcon;
	}
}
function show(did){
    newTop = document.getElementById(did).offsetTop;
    document.getElementById('witDiv').scrollTop = newTop;
}

function dehighlight(did){
    document.getElementById(did).className = 'normal';
}

function openItems(button){
	var rcl = document.getElementById("rcl");
	var table = rcl.getElementsByTagName("tbody").item(1);
	rows = table.getElementsByTagName("tr");
	var files = [];
	
	for (var i = 0; i < rows.length; i++) {
	
		cols = rows.item(i).getElementsByTagName("td");
		cb = cols.item(0).getElementsByTagName("input").item(0);
		if (cb.checked) {
		
			// field = cols.item(1).getElementsByTagName("div").item(0).firstChild.nodeValue;
			files.push(rows.item(i));
		}
		
	}
	switch (workspace.curMediaType) {
		case ("text"):
			
			for (var i = 0; i < files.length; i++) {
				field = files[i].getElementsByTagName("td").item(1).getElementsByTagName("div").item(0).firstChild.nodeValue;
				workspace.openText(field);
			}
			break;
		case ("audio"):
		
			var playlist = [];
			for (var i = 0; i < files.length; i++) {
				//	cols = files[i].getElementsByTagName("td");
				label = files[i].getElementsByTagName("td").item(1).firstChild.firstChild.nodeValue;
	//			label = label.replace(/\s+/g," ");
				label = label.trim();
				
				wll = workspace.lookupTable[label];
			
				var pList = wll["performers"].getElementsByTagName("performer");
		
				var performers = "";
				for (var k = 0; k < pList.length; k++) {
					performers = performers + "," + pList.item(k).firstChild.nodeValue
				}
				performers = performers.substring(1);
				var PLitem = {
					trackName: label,
					composer: wll["composer"].firstChild.nodeValue,
					time: wll["time"].firstChild.nodeValue,
					lyricist: wll["lyricist"].firstChild.nodeValue,
					performers: performers
				}
				playlist.push(PLitem);
				
			}
			
			audioPlayer = new AudioPlayer(playlist);
			
			workspace.newTab("AudioPlayer", "AudioPlayer", workspace.mainTitle, audioPlayer.DOM, false);
			YAHOO.util.Event.onAvailable(audioPlayer.DOM.id, function(obj){
				
				obj[1].init();
				obj[0].activeTab.content = document.getElementById("textBlock").getElementsByTagName("div").item(0);
			}, [workspace,audioPlayer]);
			
			
			break;
		case ("images"):
			var selImages = [];
			for (var i = 0; i < files.length; i++) {
				//	cols = files[i].getElementsByTagName("td");
				label = files[i].getElementsByTagName("td").item(1).firstChild.firstChild.nodeValue;
				label = label.trim();
				fn = workspace.lookupTable[label]["filename"].trim();
				
				desc = workspace.lookupTable[label]["description"];
	
				var cwd = document.location.toString();
				cwd = cwd.substring(0, cwd.lastIndexOf("/"));
				var img = cwd + fn;
				img = img.replace(/\s+/g,"");
				iObj = {fn: img, label: label,desc:desc};
				selImages.push(iObj);
			}
			if (selImages.length > 0) {
				imageViewer = new MTO.ImageViewer(selImages);
				YAHOO.util.Event.onAvailable(imageViewer.DOM.id, function(obj){
					obj[1].init();
	
					obj[0].activeTab.content = document.getElementById("textBlock").getElementsByTagName("div").item(0);
					
				}, [workspace,imageViewer]);
			
				workspace.newTab("ImageViewer", "ImageViewer", workspace.mainTitle, imageViewer.DOM, false);
			
			}
			else{
				alert("Please select at least one image.")
			}
			break;
		case ("video"):
	
			for (var i = 0; i < files.length; i++) {
				label = files[i];
				label=label.getElementsByTagName("td");
				label=label.item(1);
				label=label.firstChild;
				label=label.firstChild;
				label=label.nodeValue;
				label=label.trim();

				tb = workspace.lookupTable[label];
		
				fn=tb["filename"].trim();
			
				var cwd = document.location.toString();
				cwd = cwd.substring(0, cwd.lastIndexOf("/"));
				var vid = cwd + fn;
				
				var vp = new VideoPlayer(vid);
		
				YAHOO.util.Event.onAvailable(vp.DOM.id, function(obj){
					obj[1].init();
					obj[0].activeTab.content = obj[1].DOM;
					
				}, [workspace, vp]);
				workspace.newTab("VideoPlayer", label, workspace.mainTitle, vp.DOM, false);
			
		
			}
		break;	
		default:
			
		break;
			
			
	}
}

function changeMedia(type){
	
	workspace.loadMedia(workspace.curShow,type,"rcl");
	
}
function setButton(toPlay){
    if (toPlay) {
        pb = document.getElementById("pauseButton");
        if (pb) {
            pb.parentNode.replaceChild(PlayButton.cloneNode(true), pb);
            YAHOO.util.Event.addListener(PlayButton.id, "click", function(){
                Play();
            });
        }
    }
    else {
        var pb = document.getElementById("playButton");
        if (pb) {
        
            pb.parentNode.replaceChild(PauseButton.cloneNode(true), pb);
            YAHOO.util.Event.addListener(PauseButton.id, "click", function(){
                Pause();
            });
        }
    }
    
}

function Play(){

    workspace.play();
    setButton(false);
    
}


function Pause(){

    workspace.pause();
    setButton(true);
}

function changeFont(size, obj){

    var tb = document.getElementById("textBlock");
    var ts = document.getElementById("textSwitcher");
    aTagsList = ts.getElementsByTagName("a");
    for (i = 0; i < aTagsList.length; i++) {
        YAHOO.util.Dom.setStyle(aTagsList[i], "text-decoration", "none");
    }
    YAHOO.util.Dom.setStyle(tb, "font-size", size + "em");
    YAHOO.util.Dom.setStyle(obj, "text-decoration", "underline");
}

function annotate(){
	
    annoMgr.popUpEditor();
}

function annoSwitch(){
    var dsb = document.getElementById('dynamicSidebox');
    
    if (!annoToggle) {
    
        var onMsg = String("ON");
        document.getElementById("onOff").innerHTML = onMsg;
        annoToggle = true;
        dsb.innerHTML = annoInstruct;
        YAHOO.util.Event.addListener(document.getElementById("mainContent"), "mouseup", function(e){
        
            annotate();
        });
    }
    else {
    
        var offMsg = String("OFF");
        document.getElementById("onOff").innerHTML = offMsg;
        annoToggle = false;
        dsb.innerHTML = titleIcon;
		dsb.className="sideboxContents";
        YAHOO.util.Event.removeListener(document.getElementById("mainContent"), "mouseup");
    }
}
function saveAnnotations(){
	annoMgr.downloadAnno();
}
function loadAnnotation(){
	if (!document.getElementById("importBox")) {
		var ab = new loadAnnoBox();
		document.getElementsByTagName("body").item(0).appendChild(ab.DOM);
	}
}
	function submitImportForm(){
			
			document["importForm"].submit();
		}
YAHOO.util.Event.onDOMReady(function(){
	  
	var hs = document.getElementById("hideShow");
	YAHOO.util.Event.addListener(hs,"click",hide);
    workspace = new Workspace();

    workspace.loadShow("./manifest.xml", "Glory Days");
   	
    workspace.loadMedia("Glory Days", "text", "rcl");
	var musicBox = flowplayer("audioFlowPlayer","./flowplayer/flowplayer-3.2.5.swf", {
	plugins: {
		audio: {
			url: './flowplayer/flowplayer.audio-3.2.1.swf'
		}
	}
});
	
 	te = new TextEditor();

    bd = document.getElementsByTagName("body").item(0);
	bd.appendChild(te.DOM);
	
	
	YAHOO.util.Event.onAvailable(te.DOM.id,function(obj){
		
		obj.init();
	},te);
	
    annoMgr = new annotationManager(document.getElementById("mainContent"),te,importAnnos);

    te.saveNote.subscribe(
				function(e,pass,am){
					
					am.saveAnno(pass[0]);
					}
			,annoMgr);
	te.saveEdit.subscribe(
			   function(e,pass,am){

			   	 am.saveAnnoEdit(pass[0]);
			   }
	,annoMgr);
	
	workspace.mediaLoaded.subscribe(function(e,pass,obj){
	
		
		obj.openText("Broadway");
		obj.mediaLoaded.unsubscribe();
	},workspace);	
	workspace.changedActiveTab.subscribe(function(e,pass,obj){
			
		
			var id = obj[0].curTab;
			
			obj[1].applyAnnos(id);
		
	},[workspace,annoMgr]);	
	
    changeFont(1.3, document.getElementById("medFont"));
  
});
function oiv_next(obj){
	
	var oivId = obj.parentNode.parentNode.id;
	
	var oiv = workspace.oivs[oivId];
	oiv.next();
}
function oiv_back(obj){
	var oivId = obj.parentNode.parentNode.id;
	var oiv = workspace.oivs[oivId];
	oiv.prev();
}