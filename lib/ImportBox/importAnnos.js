
loadAnnoBox = function(){

	
	// create the <div> to hold the popout box details
	this.DOM = document.createElement("div");
	this.DOM.className = "importEnclose";

	// grab the popout box *.xml file, with the popout template
	// and attach to the popupEnclose
	this.DOM.innerHTML = loadContent("./lib/ImportBox/importAnnos.xml");

	// The 2nd div for popout.xml is the div we want as the panel
	// (classname for this div is "popout", first <div> child of "popoutBox",
	//  which is first <div> of this.DOM.innerHTML, the popout.xml file) 
	
	this.DOM = this.DOM.getElementsByTagName("div").item(0);
	
	this.DOM.id="importBox";
	this.id = this.DOM.id;
	var pieces = this.DOM.getElementsByTagName("div").item(0).childNodes;
		
	for (var p in pieces){
		switch(pieces.item(p).className){
					
			case "hd":
				this.hd = pieces.item(p);
				// generate the id for this header
				YAHOO.util.Dom.generateId(this.hd,"pHead");
			break;
						
			case "bd":
				this.bd = pieces.item(p);
				// now get the "bdContents," which is inner div to the body/"bd"
				// the text content (args.content) will get appended
				// to the bdContents, not the "bd" wrapper div
				this.bdContents = this.bd.getElementsByTagName("div").item(0);
				this.bdBox = this.bdContents.getElementsByTagName("div").item(0);
			break;
					
			case "ft":
				this.ft = pieces.item(p);						
			break;
			
			default:
				// default case; do nothing
			break;					
		}
	}
	// pieces of the panel (child divs of "popout" class div)
	this.closeButton = document.getElementById("importBoxClose");
	YAHOO.util.Event.addListener("importBoxClose","click",this.close,this);



	// Default Events
	YAHOO.util.Event.addListener(this.DOM,"click",this.handleClick,this);		
	YAHOO.util.Event.onAvailable(this.DOM.id, function(obj){

		obj.makePanelResize(obj);

	}, this);
	
	

	};

loadAnnoBox.prototype={	
	
	makePanelResize: function(panel){
	
		panel.draggable = new YAHOO.util.DDProxy(panel.id);
		panel.draggable.setYConstraint(0, (4000 - parseInt(YAHOO.util.Dom.getY(panel.DOM))));
			panel.draggable.setHandleElId(panel.hd.id);
		rconfig ={
			proxy: true,
			autoRatio: false
		};

		
		

	},
close: function(e,obj){


	//obj.resetHeader.fire();
	obj.DOM.parentNode.removeChild(obj.DOM);
	
	
}


}
