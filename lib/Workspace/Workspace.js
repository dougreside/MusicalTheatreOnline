Workspace = function(){

    this.contents = new XMLObj();
    this.id = "workspace";
    this.dataIndex = [];
    this.xsl = "";
    this.tabs = [];
    this.openDoc = [];
    this.sidePanels = [];
    this.paused = false;
    this.lookupTable = [];
    this.diffPanel = null;
    this.colDefs = null;
    this.respSchema = null;
    this.mainTitle = "";
    this.audioPath = "";
    this.curShow = "Glory Days";
    this.curMediaType = "text";
	this.curMediaManifest = null;
	this.curTab = null;
	this.mediaLoaded = new YAHOO.util.CustomEvent("mediaLoaded");
	this.changedActiveTab = new YAHOO.util.CustomEvent("changedActiveTab");
	this.paused = true;
	this.activeTab = null;
	this.firstTab = 0;
	this.moreRight = document.getElementById("moreRight");
	this.moreLeft = document.getElementById("moreLeft");
	this.audioPlayer=new AudioPlayer();
	this.audioPlayerOpen=false;
	this.oivs = [];

	this.titleIcon = "<img src='images/GloryDaysLogo.jpg' alt='Glory Days Logo' />";
	YAHOO.util.Event.addListener(this.moreLeft,"click",this.shiftTabsLeft,this);
	YAHOO.util.Event.addListener(this.moreRight,"click",this.shiftTabsRight,this);
}
Workspace.prototype = {

    loadMedia: function(show, media, rcl){
		
        this.curMediaType = media;
        var manifest = this.dataIndex[show]["path"] + this.dataIndex[show][media];
        
        // this.contents.obj = this.contents.loadXMLFromFile(manifest);
        
        
        
        var connectionCallback = {
            success: function(o){
                xmlDoc = o.responseXML;
	
				workspace.curMediaManifest=xmlDoc;
                all = xmlDoc.getElementsByTagName("item");
                
                for (i = 0; i < all.length; i++) {
                    var label = all.item(i).getElementsByTagName("label").item(0).firstChild.nodeValue;
					label=label.trim();
                    var id = all.item(i).getAttribute("xml:id");
                 //   var fn = all.item(i).getElementsByTagName("filename").item(0).firstChild.nodeValue;
                    workspace.lookupTable[label]=[];
					workspace.lookupTable[label]["id"]=id;
                	
				    for (var j=0;j<all.item(i).childNodes.length;j++){
							var sub = all.item(i).childNodes.item(j);	
							
							workspace.lookupTable[label][sub.nodeName]=sub;
						}
					workspace.lookupTable[label]["filename"]=workspace.lookupTable[label]["filename"].firstChild.nodeValue;	
              		
                }
                
                var colsDefs, respSchema;
                switch (media) {
                    case "text":
                        workspace.audioPath = xmlDoc.getElementsByTagName("audioPath")[0].firstChild.nodeValue;
                        workspace.xsl = xmlDoc.getElementsByTagName("xsl")[0].firstChild.nodeValue;
                        
                        workspace.diffPanel = new DiffPanel("diffPanel", xmlDoc);
                        
                        colDefs = [{
                            key: "label",
                            label: "Name",
                            sortable: true
                        }];
                        respSchema = {
                            resultNode: "item",
                            fields: ["label"]
                        };
                        break;
                    case "audio":
                        colDefs = [ {
                            key: "label",
                            label: "Name",
                            sortable: true
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
							key: "composer",
							label: "composer",
							hidden: true
						},
						{
							key: "lyricist",
							label: "lyricist",
							hidden: true
						},
						{
							key: "performers",
							label: "performers",
							parser: "string",
							hidden: true
						}
						];
                        respSchema = {
                            resultNode: "item",
                            fields: ["label", "time", "filename", "composer", "lyricist", "performers"]
                        };
                     
                        break;
                    case "video":
                        colDefs = [{
                            key: "label",
                            label: "Name",
                            sortable: true
                        }];
                        respSchema = {
                            resultNode: "item",
                            fields: ["label"]
                        };
                        break;
                    case "images":
                        colDefs = [ {
                            key: "label",
                            label: "Description",
                            sortable: true
                        }];
                        respSchema = {
                            resultNode: "item",
                            fields: ["label"]
                        };
                        break;
					
                    default:
                        
                        colDefs = [ {
                            key: "label",
                            label: "Name",
                            sortable: true
                        },
						{
							key: "filename",
							label: "file",
							hidden: true
						}];
                        respSchema = {
                            resultNode: "item",
                            fields: ["label","filename"]
                        };
                        break;
                        
                }
              
                myDataSource = new YAHOO.util.DataSource(xmlDoc);
                myDataSource.responseType = YAHOO.util.DataSource.TYPE_XML;
                myDataSource.responseSchema = respSchema;
              
				myDataTable = new YAHOO.widget.DataTable(o.argument.rcl, colDefs, myDataSource);
          
				
					myDataTable.subscribe("rowMouseoverEvent", function(obj){
						obj.target.name = obj.target.className; 
						
						obj.target.className="rowSelected";
					
					});
					myDataTable.subscribe("rowMouseoutEvent", function(obj){
						obj.target.className=obj.target.name;
						obj.target.name=""; 
					
					
					});
					
					

	switch (media) {
		case ("text"):
			  myDataTable.subscribe("rowClickEvent", function(obj){
			  		 label = obj.target.getElementsByTagName("td").item(0).firstChild.firstChild.nodeValue;
					workspace.openText(label);
				
					
				});
						
				
				
			
			break;
		case ("audio"):
		
			myDataTable.subscribe("rowClickEvent", function(obj){
			var label = obj.target.getElementsByTagName("td").item(0).firstChild.firstChild.nodeValue.trim();
			var time = obj.target.getElementsByTagName("td").item(1).firstChild.firstChild.nodeValue.trim();
			var filename = obj.target.getElementsByTagName("td").item(2).firstChild.firstChild.nodeValue.trim();	
			var lyricist = obj.target.getElementsByTagName("td").item(3).firstChild.firstChild.nodeValue.trim();  
			var composer = obj.target.getElementsByTagName("td").item(4).firstChild.firstChild.nodeValue.trim();
			
				var performers = obj.target.getElementsByTagName("td").item(5).firstChild.firstChild.nodeValue.trim();
		
			var PLitem = {
					trackName: label,
					composer: composer,
					time: time,
					lyricist: lyricist,
					performers: performers,
					filename: filename
				};
				
				/*label = label.trim();
				
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
				}*/
			
		
			
			
			if (!(workspace.audioPlayerOpen)){
				workspace.audioPlayer.clearPlaylist();
			
					workspace.newTab("AudioPlayer", "AudioPlayer", workspace.mainTitle, workspace.audioPlayer.DOM, false, false);
				
				YAHOO.util.Event.onAvailable(workspace.audioPlayer.DOM.id, function(obj){
					workspace.audioPlayer.addSong(PLitem);
					obj[1].init();
					obj[0].activeTab.content = document.getElementById("textBlock").getElementsByTagName("div").item(0);
					obj[0].audioPlayerOpen=true;
				}, [workspace, workspace.audioPlayer]);
			}
			else{
				var aNum = 0;
				for(var i=0;i<workspace.tabs.length;i++){
					if (workspace.tabs[i].label=="AudioPlayer"){
						aNum = i;
						break;
					}
					
				}
				workspace.changeActiveTab(workspace.tabs[aNum]);
				workspace.audioPlayer.addSong(PLitem);
				workspace.audioPlayer.init();
				workspace.activeTab.content = document.getElementById("textBlock").getElementsByTagName("div").item(0);
			}
			});
			
			break;
		case ("images"):

				
			myDataTable.subscribe("rowMouseoverEvent", workspace.showImg);
        	myDataTable.subscribe("rowMouseoutEvent", workspace.removeImg);
			myDataTable.subscribe("rowClickEvent", function(obj){
			
			
	
			 	
			
				var label = obj.target.getElementsByTagName("td").item(0).firstChild.firstChild.nodeValue;
				label = label.trim();
				fn = workspace.lookupTable[label]["filename"].trim();
				
				desc = workspace.lookupTable[label]["description"];
	
				var cwd = document.location.toString();
				cwd = cwd.substring(0, cwd.lastIndexOf("/"));
				var img = cwd + fn;
				img = img.replace(/\s+/g,"");
				img = encodeURIComponent(img);
				//desc = encodeURIComponent(desc);
				//label = encodeURIComponent(label);
				iObj = {fn: img, label: label,desc:desc};
				fname = "./lib/ImageTab/ImageViewer.php";	
			var xmlDoc;
			 var resp;
        // code for IE
		var params = "imgSrc="+img+"&desc="+desc+"&label="+label;
        if (window.ActiveXObject) {
		
			req = GetXmlHttpObject()
			req.open("POST", fname, false);
			
			req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			req.send(params);
			resp = req.responseText;
		}
		// code for Mozilla, Firefox, Opera, etc.
		else {
		
			var xmlhttp = new window.XMLHttpRequest();
			xmlhttp.open("POST", fname, false);
			xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xmlhttp.send(params);
			resp = xmlhttp.responseText;
			
			
		}
		
			ImgObj = document.createElement("div");
			ImgObj.innerHTML = resp;
				workspace.newTab(label, label, workspace.mainTitle, ImgObj, false);
			
		
			});
			break;
		case ("video"):
	
			 myDataTable.subscribe("rowClickEvent", function(obj){
			  	var label = obj.target.getElementsByTagName("td").item(0).firstChild.firstChild.nodeValue;
				label = label.trim();
			
			
						

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
				});
		
			
		break;	
		default:
		
				 myDataTable.subscribe("rowClickEvent", function(obj){
				 	var filename = obj.target.getElementsByTagName("td")[1].firstChild.firstChild.nodeValue;
					if (filename.indexOf(".doc") > 0) {
					
						workspace.downloadItem(filename);
					}
					else{
						var label = obj.target.getElementsByTagName("td")[0].firstChild.firstChild.nodeValue;					
						
						var oiv = new OrderedImageViewer();
						YAHOO.util.Dom.generateId(oiv.DOM,"oiv");
						oiv.loadImages(filename);
						
						workspace.oivs[""+oiv.DOM.id]=oiv;
						workspace.newTab(oiv.DOM.id, label, workspace.mainTitle, oiv.DOM, false);
						YAHOO.util.Event.onAvailable(oiv.DOM.id, function(obj){
						obj[1].showImage();
						obj[0].activeTab.content=document.getElementById("textBlock").getElementsByTagName("div").item(0);;
						},[workspace,oiv]);
						
					}
					
					});
					
		break;
			
			
	}	
					
					
					
				
			    workspace.mediaLoaded.fire();
            },
            failure: function(o){
                alert("Could not load contents of archive.");
            },
            argument: {
                workspace: this,
                rcl: rcl
            }
        };
        
        var getXML = YAHOO.util.Connect.asyncRequest("GET", manifest, connectionCallback);
        
        
        
        
        
        
        
        return;
    },
	downloadItem: function(file){
		//var file = obj.target.getElementsByTagName("td").item(0).firstChild.firstChild.nodeValue;
		window.open("./data/GloryDays/other/"+file);
	},
	showImg:function(obj){
	
		label = obj.target.getElementsByTagName("td").item(0).firstChild.firstChild.nodeValue;
		label=label.trim();
		
		fn = workspace.lookupTable[label]["filename"];
		
		var cwd = document.location.toString();
        
		cwd = cwd.substring(0, cwd.lastIndexOf("/"));
		cwd = cwd.trim();
		var img = cwd+fn;
		img = img.replace(/\s+/g,"");
		
		
	
		document.getElementById("dynamicSidebox").innerHTML="<img src='"+img+"' alt='"+label+"' />";
	
	},
		showDesc:function(desc){
		document.getElementById("dynamicSidebox").innerHTML=desc;
	
	},
	removeImg:function(obj){
		document.getElementById("dynamicSidebox").innerHTML="<img src='images/GloryDaysLogo.jpg' alt='Glory Days Logo' />";
	},

    loadShow: function(manifest, show){
        this.mainTitle = show;
        mainManifest = this.contents.loadXMLFromFile("./manifest.xml");
        
        titles = mainManifest.getElementsByTagName("show");
        
        for (var i = 0; i < titles.length; i++) {
        
            if (titles.item(i).getAttribute("title") == show) {
                showFile = titles.item(i).getAttribute("file");
                
                break;
            }
        }
        showManifest = this.contents.loadXMLFromFile(showFile);
        texts = showManifest.getElementsByTagName("texts").item(0).firstChild.nodeValue;
        audio = showManifest.getElementsByTagName("audio").item(0).firstChild.nodeValue;
        images = showManifest.getElementsByTagName("images").item(0).firstChild.nodeValue;
        video = showManifest.getElementsByTagName("video").item(0).firstChild.nodeValue;
        other = showManifest.getElementsByTagName("other").item(0).firstChild.nodeValue;
        path = showManifest.getElementsByTagName("path").item(0).firstChild.nodeValue;
        showIndex = {
            path: path,
            text: texts,
            audio: audio,
            images: images,
            video: video,
            other: other
        };
        
        this.dataIndex[show] = showIndex;
    },
    showDiffs: function(){
    	
        this.newTab("diff","Compare","Archive",this.diffPanel.DOM, false, false);
    },
    getAudio: function(obj){
        
        
        if (obj.getTagByXMLID("linkGrp", "audiofiles")) {
        
            var files = obj.getTagByXMLID("linkGrp", "audiofiles").getElementsByTagName("link");
            var audioFiles = [];
            
            for (n = 0; n < files.length; n++) {
            
                var targs = files[n].getAttribute("targets").split(" ");
                audioFiles[targs[0]] = targs[1];
                //alert("*"+targs[0]+" "+targs[1]);
            }
            
            var timelinks = obj.getTagByXMLID("linkGrp", "audiolinks").getElementsByTagName("link");
            
            var audioLinks = [];
            
            for (var n = 0; n < timelinks.length; n++) {
                var targs = timelinks[n].getAttribute("targets").split(" ");
                audioLinks[targs[0]] = targs[1];
            }
            
            var timestamps = obj.obj.getElementsByTagName("when");
            
            var times = [];
            for (var n = 0; n < timestamps.length; n++) {
                var parID = timestamps[n].parentNode.getAttribute("xml:id");
                var file = audioFiles[parID];
                
                var id = timestamps[n].getAttribute("xml:id");
                times[id] = [];
                times[id]["file"] = file;
                times[id]["ns"] = timestamps[n].getAttribute("absolute");
                
            }
            
            
            
        }
        
        
        var data = {
            audioLinks: audioLinks,
            audioFiles: audioFiles,
            timestamps: times
        }
        
        return data;
        
    },
    openText: function(label){     
		
		var mainTitle = this.mainTitle;
			
                filename = this.lookupTable[label]["filename"];
               
                id = this.lookupTable[label]["id"];
                    var hasMusic = false;
                if (this.openDoc[id] == null) {
                
            
                
                    if (filename) {
                    
                        musicalXML = new XMLObj();
                        
                        musicalXML.obj = musicalXML.loadXMLFromFile(filename, musicalXML.obj);
                        
                        musicalHTML = musicalXML.transform(this.xsl);
                        
                        var storeHTML = "";
                        if (window.ActiveXObject) {
                            storeHTML = musicalHTML;
                        }
                        // code for Mozilla, Firefox, Opera, etc.
                        else {
                            storeHTML = musicalHTML.cloneNode(true);
                            
                        }
                        
                        this.openDoc[id] = {
                            html: storeHTML,
                            textID: id,
                            label: label,
                            audioLinks: [],
                            timestamps: []
                        };
                        
                        
                        
                        var data = this.getAudio(musicalXML);
                        
                        this.openDoc[id].audioLinks = data["audioLinks"];
                        this.openDoc[id]["audioFiles"] = data["audioFiles"];
                        this.openDoc[id]["timestamps"] = data["timestamps"];
                        if (this.openDoc[id]["audioFiles"]){
                  			
							hasMusic = true;
						}
                        
                        
                    }
                }
                else {
                    if (window.ActiveXObject) {
                        musicalHTML = this.openDoc[id].html;
                    }
                    // code for Mozilla, Firefox, Opera, etc.
                    else {
                        musicalHTML = this.openDoc[id].html.cloneNode(true);
                        
                    }
					     if (this.openDoc[id]["audioFiles"]){
                  			
							hasMusic = true;
						}
                    label = this.openDoc[id].label;
                    
                }
        
				this.curTab = workspace.lookupTable[label]["id"];
			
			
        		this.newTab(id,label,mainTitle,musicalHTML, true, hasMusic);
		},
	shiftTabsLeft:function(e,obj){
	
	
		if (obj.firstTab > 0) {
	
			obj.firstTab--;
			obj.tabs[obj.firstTab].show();
			leftTab = obj.firstTab+5;
			obj.tabs[leftTab].hide();
			YAHOO.util.Dom.setStyle(obj.moreRight, "display", "block");
				
			
		}
		if (obj.firstTab==0){
		
			
			YAHOO.util.Dom.setStyle(obj.moreLeft, "display", "none");
			for (var i = 0; i < 5; i++) {
				obj.tabs[i].show();
			}
		}
		

		
	},
	shiftTabsRight:function(e,obj){
		
	
		
		obj.tabs[obj.firstTab].hide();
		obj.tabs[obj.firstTab+5].show();
		obj.firstTab++;
		YAHOO.util.Dom.setStyle(obj.moreLeft, "display", "block");
		
		
		if ((obj.tabs.length-5)==(obj.firstTab)){
			
			YAHOO.util.Dom.setStyle(obj.moreRight, "display", "none");
		}
		
	},	
    newTab: function(id, label, mainTitle, contentHTML, isText, hasMusic){
    
  		

        wrapper = document.createElement("div");
        wrapper.className = "textWrapper";
        if (window.ActiveXObject) {
			if (contentHTML.innerHTML) {
				
				wrapper.innerHTML = contentHTML.outerHTML;
			}
			else {
				wrapper.innerHTML = contentHTML;
			}
        }
        // code for Mozilla, Firefox, Opera, etc.
        else 
            if (document.implementation &&
            document.implementation.createDocument) {
            	wrapper.innerHTML="";
                wrapper.appendChild(contentHTML);
               
            }
        
        //	alert(wrapper.innerHTML);
        theTab = new Tab(id, label, mainTitle, wrapper, isText, hasMusic);
       
        tabspace = document.getElementById("tabList");
        
        
		       	
        this.tabs.push(theTab);
         if (this.tabs.length==6){
		
		//	tabspace.insertBefore(this.moreLeft.DOM,this.tabs[this.firstTab].DOM); 
		YAHOO.util.Dom.setStyle(this.moreLeft,"display","block");
		}
		if (this.tabs.length >= 6) {
			//this.firstTab++;
			//this.tabs[this.firstTab].hide();
			while ((this.tabs.length-5)!=(this.firstTab)){
	this.shiftTabsRight(null,this);
		}
			
		
		}
			
		tabspace.insertBefore(theTab.DOM,this.moreRight);
		theTab.tabActive.subscribe(function(e, pass, wk){
        
            wk.changeActiveTab(pass[0]);
        }, this);
        
        theTab.tabPop.subscribe(function(e, pass, wk){
        
            wk.popOutTab(pass[0]);
        }, this);
        
        theTab.tabClose.subscribe(function(e, pass, wk){
	
            wk.closeTab(pass[0],wk);
        }, this);
        this.activeTab = theTab;
    },
    
    play: function(){
    
        $f("audioFlowPlayer").play();
        this.paused = false;
        
    },
    pause: function(){
  
		try {
		
			$f("audioFlowPlayer").pause();
		}
		catch(e){
		
			return;
		}

		this.paused = true;
		return;
        
    },
    playPause: function(){
        if (this.paused) {
            $f("audioFlowPlayer").play();
            this.paused = false;
        }
        else {
        
            $f("audioFlowPlayer").pause();
            this.paused = true;
        }
    },
    
    popOutTab: function(tab){
    	
        this.pause();
    
        // pcontent = this.openDoc[tab.textID]["html"].cloneNode(true);
        // using tab.content instead...don't know if this is slower or faster...emb
        // would pcontent persist > time
        pcontent = tab.content;
        
        args = {
            label: tab.textID,
            headLabel: tab.label,
            content: pcontent
        };
        
        var panel = new Popup(args);
        
        
        
        panel.pinEvent.subscribe(function(e, pass, wk){
        
            wk.pinInTab(pass[0]);
        }, this);
        
        webBody = document.getElementsByTagName("body").item(0);
        webBody.appendChild(panel.DOM);
        this.closeTab(tab,this);
		/*tab.DOM.parentNode.removeChild(tab.DOM);
        if (this.tabs[0]) {
            this.tabs[0].makeActive(this.tabs[0]);
        }
        else {
        
        }*/
        
    },
    diff: function(list){
        pcontent = document.createElement("div");
        
        //panel = new DiffPanel("diffy",pcontent,list);
    
        //document.getElementsByTagName("body")[0].appendChild(panel.HTML);	
        //	this.tabs[0].makeActive(this.tabs[0]);		
    },
    pinInTab: function(panel){
    
        this.openText(panel.label);
       
        panel.close(null, panel);
        
    },
    
    closeTab: function(tab,wk){
	
			if (tab.label == "AudioPlayer") {
			
				wk.audioPlayerOpen = false;
			}
			
			for (var i = 0; i < wk.tabs.length; i++) {
				if (wk.tabs[i].DOM.isSameNode(tab.DOM)) {
					//if ((wk.firstTab>=i) && (i>0)){
					/*if (wk.firstTab>0){
			 wk.firstTab--;
			 }*/
					var changeActive = false;
					if (wk.tabs[i].DOM.className == "active") {
						changeActive = true;
					}
					wk.tabs.splice(i, 1);
					
					if (changeActive) {
					
						if (wk.tabs[i - 1]) {
						
							wk.tabs[i - 1].makeActive(wk.tabs[i - 1]);
						}
						else {
						
							wk.tabs[0].makeActive(wk.tabs[0]);
						}
					}
				}
			}
			
			
			
			if (wk.tabs.length == 5) {
			
				YAHOO.util.Dom.setStyle(wk.moreLeft, "display", "none");
				YAHOO.util.Dom.setStyle(wk.moreRight, "display", "none");
			}
			
			wk.shiftTabsLeft(null, wk);
			
		
    },
    
    changeActiveTab: function(active){
		active.DOM.className = "active";
		this.activeTab = active;
		if (active.isText){
			var cb = document.getElementById("controlBlock");
				cb.style.display = "block";
			if (active.hasMusic) {
			
				document.getElementById("playButton").style.display="block";
			}
			else{
				
				document.getElementById("playButton").style.display="none";
			}
			
			
		}
		else {
			var cb = document.getElementById("controlBlock");
			cb.style.display="none";
		}
        for (var i = 0; i < this.tabs.length; i++) {
        
            if (this.tabs[i].DOM.id != active.DOM.id) {
            
                this.tabs[i].deactivate(this.tabs[i]);
                
            }
        }
        
        mc = document.getElementById("mainContent");
        
        if (document.getElementById("textBlock")) {
            tc = document.getElementById("textBlock");
            tc.parentNode.removeChild(tc);
        }
        
        newTitleText = document.createElement("h2");
        newTitleText.id = "titleText";
		var shortTitle = active.label;
		if (active.isText){
			newTitleText.className = "textTitle";
			if (shortTitle.length > 40) {
				shortTitle = shortTitle.substring(0, 40);
				shortTitle = shortTitle + "...";
			}
		}
		else{
			if (shortTitle.length > 60) {
				shortTitle = shortTitle.substring(0, 60);
				shortTitle = shortTitle + "...";
			}
			newTitleText.className = "otherTitle";
			
		}
		
				
        newTitleText.appendChild(document.createTextNode(active.mainTitle + ": " + shortTitle));
        
        if (document.getElementById("titleText")) {
        
            oldTitleText = document.getElementById("titleText");
            oldTitleText.parentNode.replaceChild(newTitleText, oldTitleText);
            
        }
        else {
            // the text/audio controls tag block is just after where the titleText should be
            // so insert this new titleText before that block, 
            // whose id='controlBlock' and class='controls'
            // Need to get the parent of mainContent to insert
            cb = document.getElementById("controlBlock");
            cb.parentNode.insertBefore(newTitleText, cb);
        }
        
        Cufon.replace('h2', {
            fontFamily: 'Museo 700'
        })('#nav a', {
            fontFamily: 'Museo 300'
        })('.search-area p', {
            hover: 'true'
        }, {
            fontFamily: 'Museo 300'
        });
        	
        wrapper = document.createElement("div");
        wrapper.id = "textBlock";
        wrapper.className = "textBlock";
   
	    wrapper.appendChild(active.content.cloneNode(true));

     
		 mc.appendChild(wrapper);
		 
	
		
		
		if (this.lookupTable[active.label]) {
			this.curTab = this.lookupTable[active.label]["id"];
		}

		try{
			
			
				var firstDiv = mc.getElementsByTagName("div").item(1);
				
			if (firstDiv.id.substring(0,3)=="vid"){
		
				video = firstDiv.id.substring(firstDiv.id.indexOf("_")+1);
				firstDiv.className = "textWrapper";
				video = video.substring(0,video.lastIndexOf("_"));
			
				avid = firstDiv.getElementsByTagName("a").item(0);
				
				flowplayer(avid.id,"./flowplayer/flowplayer-3.2.5.swf",video);
			}
		}
		catch(e){
			
		}	
		

        this.changedActiveTab.fire();
    },
    playAudioTrack: function(id){
    
        var doc = id.substring(0, id.indexOf("_"));
        tsid = id;
		if (this.openDoc[doc]) {
			var ts = this.openDoc[doc]["audioLinks"][tsid];
			
			
			//alert("tsid: "+tsid+" ts "+ts+" data: "+Object.size(this.openDoc[doc]["audioLinks"])+" "+Object.size(this.openDoc[doc]["timestamps"]));
			out = "";
			
			timest = this.openDoc[doc]["timestamps"];
			
			if (timest[ts]) {
			
				var cwd = document.location.toString();
				cwd = cwd.substring(0, cwd.lastIndexOf("/"));
				
				this.audioPath = cwd + '/data/GloryDays/audio';
				var file = this.audioPath + "/" + timest[ts]["file"];
				
				var ns = parseInt(this.openDoc[doc]["timestamps"][ts]["ns"]);	
			
					
				/*PInstance[0].addListener("start",function(){
					alert(ns);
					PInstance[0].playerObject.setSeek(ns);
						
				});*/
				
				/*
				var old = document.audioObject.GetURL();
				
				if (!(old == file)) {
				
				
					document.audioObject.SetURL(file);
					
					
				}
				*/
			/*
					for (var i=0;i<PInstance[0].getPlaylist().length;i++){
					
						if (PInstance[0].getItem(i)["id"]==file){
						
							PInstance[0].setActiveItem(i);
								
					
					
						
							break;
						}
						
					}
					
				 	
					
						
					PInstance[0].setPause();
					
					PInstance[0].setPlayhead(50);
					
					PInstance[0].setPlay();
					*/
					//$f("audioFlowPlayer").pause();
					
					 $f("audioFlowPlayer").play(file);
					  //$f("audioFlowPlayer").pause();
					// alert(ns);
				 $f("audioFlowPlayer").seek(ns);
				//  $f("audioFlowPlayer").play();
				//document.audioObject.Stop();	
				/*document.audioObject.SetStartTime(parseInt(ns));
				document.audioObject.Rewind();
				document.audioObject.Play();*/
			}
		}
    },
    newSidebarPanel: function(id, heading){
    
        this.sidePanels[id] = new SidebarPanel(id, heading);
        
        sidebar = document.getElementById("sidebar");
        
        sidebar.appendChild(this.sidePanels[id].DOM);
    }
    
    
}

