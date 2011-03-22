
Popup = function(args){

	
	// create the <div> to hold the popout box details
	this.DOM = document.createElement("div");
	this.DOM.className = "popupEnclose";

	// grab the popout box *.xml file, with the popout template
	// and attach to the popupEnclose
	this.DOM.innerHTML = loadContent("./lib/Popout/popout.xml");

	// The 2nd div for popout.xml is the div we want as the panel
	// (classname for this div is "popout", first <div> child of "popoutBox",
	//  which is first <div> of this.DOM.innerHTML, the popout.xml file) 
	this.DOM = this.DOM.getElementsByTagName("div").item(1);
	
	YAHOO.util.Dom.generateId(this.DOM, "panel");
	this.id = this.DOM.id;
	
	// pieces of the panel (child divs of "popout" class div)
	var pieces = this.DOM.childNodes;
		
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

	
	// Add the label for this version of text (e.g., "fringe", "bway") to the panel.tabName 
	this.tabName = args.label;
	var newtxt = document.createElement("h3");
	newtxt.appendChild(document.createTextNode(args.headLabel));
	this.label = args.headLabel;	
	var th = this.hd.getElementsByTagName("h3").item(0);
	th.parentNode.replaceChild(newtxt,th);

	// events
	this.pinEvent = new YAHOO.util.CustomEvent("pinEvent");

	// Default Events
	YAHOO.util.Event.addListener(this.DOM,"click",this.handleClick,this);		
	YAHOO.util.Event.onAvailable(this.DOM.id, function(obj){
		
		obj.setHeader(obj);
		obj.makePanelResize(obj);

	}, this);
	
	this.setContent(args.content);

	};

Popup.prototype={	
	setContent: function(content){
		
	// set the panel.textCon to the current content
	this.textCon = content;

	// now attach it to the panel html ("bdBox" div)
	this.textContainer = this.bdContents.getElementsByTagName("div").item(0);

	// remove the sample/existing text
	var currentContents = this.textContainer.getElementsByTagName("p");
	var emptyPara = document.createElement("p");
	for (i=0; i<currentContents.length; i++) {
		
		this.textContainer.replaceChild(emptyPara, currentContents.item(i));
	}
	
	// now append the real text content
	this.textContainer.appendChild(content);
		
	},

	setHeader: function(panel){

	buttons = panel.hd.getElementsByTagName("img");

	panel.closeButton = buttons.item(1);;
	panel.popBack = buttons.item(0);

	YAHOO.util.Event.addListener(panel.closeButton, 'click', panel.close, panel);
	YAHOO.util.Event.addListener(panel.popBack, 'click', panel.pinTab, panel);
},
	makePanelResize: function(panel){
	
		panel.draggable = new YAHOO.util.DDProxy(panel.id);
		panel.draggable.setYConstraint(0, (4000 - parseInt(YAHOO.util.Dom.getY(panel.DOM))));
			panel.draggable.setHandleElId(panel.hd.id);
		rconfig ={
			proxy: true,
			autoRatio: false
		};
		panel.Resize = new YAHOO.util.Resize(panel.id, rconfig);
		
		
		// Setup resize handler to update the size of the panel's body element
		// whenever the size of the resizablepanel DIV changes
		panel.Resize.on('resize', panel.adjustSize, panel, true);

	},
adjustSize:function(e, panel){
			
			hdr = YAHOO.util.Dom.getRegion(panel.hd);
			ftr = YAHOO.util.Dom.getRegion(panel.ft);
			hdh = hdr.bottom-hdr.top;
			fth = ftr.bottom-ftr.top; 
			htotal = parseInt(YAHOO.util.Dom.getStyle(panel.DOM.id,"height"));
			wtotal = parseInt(YAHOO.util.Dom.getStyle(panel.DOM.id,"width"));
			var other = hdh+fth;
		
			bodyHeight = htotal-other-8; 
		
			YAHOO.util.Dom.setStyle(panel.bd, 'height', bodyHeight + 'px');
			YAHOO.util.Dom.setStyle(panel.bdContents, 'height', (bodyHeight) + 'px');
			YAHOO.util.Dom.setStyle(panel.bdBox, 'height', (bodyHeight-20) + 'px');

	
		
},
pinTab: function(e,obj){

	obj.pinEvent.fire(obj);
	
},
close: function(e,obj){


	//obj.resetHeader.fire();
	obj.DOM.parentNode.removeChild(obj.DOM);
	
	
}

/* ******************************************
 *  popout.xml file against which the popout.js is expecting
 *  re: panel header block ("hd"); panel body/body content block ("bd", "bdContents")
 *  v.48, 7/17/2009
 *  
 * <div class="popoutBox">
    <div class="popout">
        <div class="hd">
        	<div class="hdContents">
                <div class="hdBox">
                	<h3>Flexible CSS Teaser Box</h3><span class="controls"><a href="#"><img src="images/pop-in-icon.png" alt="pop-in" /></a><a href="#"><img src="images/close-icon.png" alt="close" /></a></span>
                </div>
             </div>
    	</div>
        
        <div class="bd">
            <div class="bdContents">
                <div class="bdBox">
                <p>Sample text here</p>
                <p>Sample text here</p>
                </div>
            </div>
        </div>
        
        <div class="ft">
            <div class="ftContents">
            	<span class="corner"></span>
            </div>
        </div>
    </div>
</div>
 
********************************************* */
}
