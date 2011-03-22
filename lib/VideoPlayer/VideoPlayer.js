 VideoPlayer = function(video){
	
	this.video = video;
	YDOM = YAHOO.util.Dom;
		// create the <div> to hold the popout box details
	this.DOM = document.createElement("div");
	
	this.DOM.className = "popupEnclose";

	// grab the popout box *.xml file, with the popout template
	// and attach to the popupEnclose


	// The 2nd div for popout.xml is the div we want as the panel
	// (classname for this div is "popout", first <div> child of "popoutBox",
	//  which is first <div> of this.DOM.innerHTML, the popout.xml file) 
	//this.DOM = this.DOM.firstChild;
	YDOM.generateId(this.DOM,"vid_"+video+"_");
	
	this.fpSpace = document.createElement("a");


	this.fpSpace.className="videoplayer";
	YDOM.generateId(this.fpSpace,"flowplayer");
	this.DOM.appendChild(this.fpSpace);
	this.videoLoaded = new YAHOO.util.CustomEvent("videoLoaded");
	
}
VideoPlayer.prototype={
	init: function(){
	
	flowplayer(this.fpSpace.id,"./flowplayer/flowplayer-3.2.5.swf",this.video);
	
	this.videoLoaded.fire();
	
	return;
	}
	
}
