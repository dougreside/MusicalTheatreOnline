MTO.selectRow = function(row, header, pb){
    old = document.getElementById("MTO_currently_playing_row");
    if (old) {
        old.id = "";
    }
    row.id = "MTO_currently_playing_row";
    var curSong = row.getElementsByTagName("td").item(0).firstChild.firstChild.nodeValue;
    
	var curSongP = document.createElement("p");
    curSongP.appendChild(document.createTextNode(curSong));
    //fn = workspace.lookupTable[curSong]["filename"].trim();
    fn = row.getElementsByTagName("td").item(5).firstChild.firstChild.nodeValue.trim();
	
	var cwd = document.location.toString();
    cwd = cwd.substring(0, cwd.lastIndexOf("/"));
    var song = cwd + fn;
    document.audioObject.SetURL(song);
    document.audioObject.Play();
    var DomObj = row.parentNode.parentNode.parentNode.parentNode.parentNode;
    
    playButton = DomObj.getElementsByTagName("li").item(2);
    
    hd = DomObj.getElementsByTagName("p").item(0);
    
    
    hd.parentNode.replaceChild(curSongP, hd);
    var cn = playButton.className;
    cn = cn.replace(/audioPlayButton/, "audioPauseButton");
    playButton.className = cn;
    
    
}
MTO.rewindQT = function(){
    document.audioObject.Stop();
    document.audioObject.Step(-5);
    document.audioObject.Play();
}
MTO.ffQT = function(){
    document.audioObject.Stop();
    document.audioObject.Step(5);
    document.audioObject.Play();
}
MTO.stopQT = function(pb){

    document.audioObject.Stop();
    document.audioObject.Rewind();
    
    playButton = document.getElementById(pb);
    var cn = playButton.className;
    cn = cn.replace(/audioPauseButton/, "audioPlayButton");
    playButton.className = cn;
    
    
}
MTO.skipSong = function(forward){
    var curRow = document.getElementById("MTO_currently_playing_row");
    if (curRow) {
    
        var parTab = curRow.parentNode;
        var allRows = parTab.getElementsByTagName("tr");
        for (var i = 0; i < allRows.length; i++) {
            if (allRows.item(i).isSameNode(curRow)) {
                if (forward) {
                    nxt = i + 1;
                    curRow.id = "";
                    if (nxt < allRows.length) {
                        newRow = allRows.item(nxt);
                    }
                    else {
                        newRow = allRows.item(0);
                    }
                }
                else {
                    nxt = i - 1;
                    curRow.id = "";
                    if (nxt > -1) {
                        newRow = allRows.item(nxt);
                    }
                    else {
                        newRow = allRows.item(allRows.length - 1);
                    }
                }
                break;
                
                
            }
        }
        newRow.id = "MTO_currently_playing_row";
        MTO.selectRow(newRow);
    }
}
MTO.playPause = function(pp){


    var cn = pp.className;
    //curSong = document.audioObject.GetURL();
    if (cn.indexOf("audioPlayButton") > 0) {
    
        document.audioObject.Play();
        
        cn = cn.replace(/audioPlayButton/, "audioPauseButton");
        pp.className = cn;
        
    }
    else {
        document.audioObject.Stop();
        cn = cn.replace(/audioPauseButton/, "audioPlayButton");
        pp.className = cn;
        //document.audioObject.SetURL(curSong);
    }
}
MTO.removeLine = function(obj){
	var row = obj.parentNode.parentNode;
	var curSong = row.getElementsByTagName("td").item(0).firstChild.firstChild.nodeValue;

    var pl = workspace.audioPlayer.playlist;
	
	for (var n=0;n<pl.length;n++){
	
		if (pl[n].trackName==curSong){
			pl.splice(n,1);
			workspace.audioPlayer.init();
			break;
		}
		
	}
}
AudioPlayer = function(){
	
    YDOM = YAHOO.util.Dom;
    // create the <div> to hold the popout box details
    this.DOM = document.createElement("div");
    this.DOM.className = "popupEnclose";
    this.playlist = [];
    // grab the popout box *.xml file, with the popout template
    // and attach to the popupEnclose
    this.DOM.innerHTML = loadContent("./lib/AudioPlayer/AudioPlayer.xml");
    
    // The 2nd div for popout.xml is the div we want as the panel
    // (classname for this div is "popout", first <div> child of "popoutBox",
    //  which is first <div> of this.DOM.innerHTML, the popout.xml file) 
    var divs = this.DOM.getElementsByTagName("div");
    this.DOM = divs.item(0);
  
	YAHOO.util.Dom.generateId(this.DOM, "audioPlayer");
    this.header = divs.item(3);
    YAHOO.util.Dom.generateId(this.header, "apHeader");
    this.controls = divs.item(4);
    buttons = this.controls.getElementsByTagName("li");
    this.playListBox = divs.item(6);
    YDOM.generateId(this.playListBox, "pl");
    
    this.backButton = buttons.item(0);
    YDOM.generateId(this.backButton, "backButton");
    this.backButton.setAttribute("onclick", "MTO.skipSong(false)");
    this.rewindButton = buttons.item(1);
    YDOM.generateId(this.rewindButton, "rewind");
    this.rewindButton.setAttribute("onclick", "MTO.rewindQT()");
    this.playButton = buttons.item(2);
    YDOM.generateId(this.playButton, "playButton");
    this.playButton.setAttribute("onclick", "MTO.playPause(this)");
    this.stopButton = buttons.item(3);
    YDOM.generateId(this.stopButton, "stopButton");
    this.stopButton.setAttribute("onclick", "MTO.stopQT(\'" + this.playButton.id + "\')");
    this.fforwardButton = buttons.item(4);
    YDOM.generateId(this.fforwardButton, "fforwardButton");
    this.fforwardButton.setAttribute("onclick", "MTO.ffQT()");
    this.skipButton = buttons.item(5);
    YDOM.generateId(this.skipButton, "skipButton");
    this.skipButton.setAttribute("onclick", "MTO.skipSong(true)");
    this.volumeButton = buttons.item(6);
    YDOM.generateId(this.volumeButton, "volumeButton");
    
    
    
    this.playListTable = null;
    //this.QTObject.setAttribute("name",this.QTid);
    this.playing = false;
    //	alert("Before: "+workspace.lookupTable[playlist[0].trackName]["filename"]);
    this.curSong = null;
    
    this.removeButton = function(elCell,oRecord,oColumn,oData){
		elCell.innerHTML ="<a class='removeAudioLine'>Remove</a>";
		YAHOO.util.Event.addListener(elCell,"click",function(e,obj){
			
			YAHOO.util.Event.stopEvent(e);
			MTO.removeLine(obj);
		},elCell);
	}
    YAHOO.widget.DataTable.Formatter.removeButton = this.removeButton; 
    
    
    
    
}
AudioPlayer.prototype = {
    init: function(){
    
    
        this.setPlaylist(this.playlist);
        
        
    },
	removeSong:function(song){
		alert(song.innerHTML);
	},
	clearPlaylist:function(){
		this.playlist=[];
	},
    setPlaylist: function(playlist){
    
        var colsDefs, respSchema;
        
        
        colDefs = [{
            key: "trackName",
            label: "Name",
            sortable: true
        }, {
            key: "composer",
            label: "Composer"
        }, {
            key: "lyricist",
            label: "Lyrics"
        }, {
            key: "performers",
            label: "Performers"
        }, {
            key: "time",
            label: "Duration"
        },
		{
			key: "filename",
			label: "filename",
			hidden: true
		},
		{
			key: "remove",
			label: "Remove From List",
			formatter: "removeButton"
			
		}];
        respSchema = {
        
            fields: ["trackName", "lyricist", "composer", "performers", "time", "filename"]
        };
        
        
        
        myDataSource = new YAHOO.util.DataSource(playlist);
        myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
        myDataSource.responseSchema = respSchema;
        this.playListTable = new YAHOO.widget.DataTable(this.playListBox.id, colDefs, myDataSource);
     
		var plt = this.playListTable;
        plt.subscribe("rowMouseoverEvent", this.highlight);
        plt.subscribe("rowMouseoutEvent", this.unhighlight);
        //plt.subscribe("rowClickEvent", this.select,this);
        plt.subscribe("postRenderEvent", this.rendered, this);
        
    },
	addSong:function(songObj){
		this.playlist.push(songObj);
	},
    rendered: function(obj, pass){
    
        rows = document.getElementById("textBlock");
        rows = rows.getElementsByTagName("tbody").item(1);
        rows = rows.getElementsByTagName("tr");
        hd = pass.header.id;
        
        
        for (i = 0; i < rows.length; i++) {
            row = rows.item(i);
            
            //	QTid= pass.QTid;
            playButton = pass.playButton.id;
            
            row.setAttribute("onclick", "MTO.selectRow(this,\"" + hd + "\",\"" + playButton + "\")");
        }
    },
    
    highlight: function(obj){
        obj.target.className = obj.target.className + " curSong";
    },
    unhighlight: function(obj){
        obj.target.className = obj.target.className.replace(/ curSong/, "");
    }
    
}
