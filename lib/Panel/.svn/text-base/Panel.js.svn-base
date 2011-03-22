//--------------SQAthis--------------------------------------------
//  this.js 
//  Last modified by dreside @ 3/27/09
//
//	
//  A generic draggable this, composed of three parts:
//  header, content, and footer.
//	Extends this.js
//
//--------------------------------------------------------------
/*
 * Constructor Call for this
 * 
 * Note: calls extension of thisPrototype
 * 
 * Objects:
 * 	desktop
 * 	project (0|String Value)
 * 	curPage (1|Integer Value)
 * 	idarray (Array) Stores values taken from 
 * 		GETIDS
 * 	objects (Array)
 * 	boxes (Array)
 * 	areas (Array)
 * 	disabled (Boolean) True when this 
 * 		panel is selected by workspace
 * 	
 * 	CustomEvents:
 * 	desktopCall
 * 	ajaxFire
 * 	panelClicked
 * 
 * @param {Object} args
 *********************************/
Panel = function(id,content){
	


	// Custom Events
	this.panelClicked=new YAHOO.util.CustomEvent("panelClicked");
	this.panelReady=new YAHOO.util.CustomEvent("panelReady");
	this.resetHeader=new YAHOO.util.CustomEvent("resetHeader");
	
	this.tabName = id;
	this.id = YAHOO.util.Dom.generateId(this, "panel");
    this.HTML = document.createElement("div");
    this.HTML.className = "panel";
    this.HTML.id = this.id;
    this.header =document.createElement("div");
    this.header.className = "hd";
    this.header.id = YAHOO.util.Dom.generateId(this.header, "header");
 
	
	this.content = new PanelContent(this.id+"_content","","",content);
    //this.content.panelContentReady.subscribe(this.makeDropDown,this); 
	
	this.footer = document.createElement("div");
	this.footer.id = YAHOO.util.Dom.generateId(this.footer, "footer");
    this.footer.className = "ft";

	//insert quarto version in footer
	//this.footer.appendChild(document.createTextNode(args.footerInfo));
	
	
    this.HTML.appendChild(this.header);
    this.HTML.appendChild(this.content.DOM);
    this.HTML.appendChild(this.footer);
	this.pinEvent = new YAHOO.util.CustomEvent("pinEvent");
	// Default Events
	YAHOO.util.Event.addListener(this.HTML,"click",this.handleClick,this);		
	YAHOO.util.Event.onAvailable(this.HTML.id, function(obj){
		obj.makePanelResize(obj);

	}, this);
	
}
Panel.prototype = {
	setContent: function(content){

		this.content.setContent(content);
		
	},
		setHeader: function(panel){

	
	
	// Page Controls
	
		
// Opacity Controls
	
	this.darker = new PanelButton("darker", "More Opaque");
	this.lighter = new PanelButton("lighter", "More Transparent");
	this.opacityControls = new ButtonGroup("Opacity", [this.darker, this.lighter], "opacityControls");
	this.header.appendChild(this.opacityControls.HTML);
	YAHOO.util.Event.addListener(this.darker.HTML, 'click', this.changeTransparency, {
		panel: this,
		more: false
	});
	YAHOO.util.Event.addListener(this.lighter.HTML, 'click', this.changeTransparency, {
		panel: this,
		more: true
	});
	
	
	
	
	this.closeButton = new PanelButton("closeButton", "Close");
	this.header.appendChild(this.closeButton.HTML);
	this.popBack = new PanelButton("pin","Pin to tab");
	this.header.appendChild(this.popBack.HTML);
	YAHOO.util.Event.addListener(this.closeButton.HTML, 'click', this.close, panel);
	YAHOO.util.Event.addListener(this.popBack.HTML, 'click', this.pinTab, panel);
},
	makePanelResize: function(panel){
		panel.setHeader(panel);
		//make sure window is placed below project bar
		YAHOO.util.Dom.setStyle(panel.HTML, 'top', '55px');
		
		panel.draggable = new YAHOO.util.DD(panel.id);
		panel.draggable.setHandleElId(panel.header.id); //can only drag by clicking on handle
		panel.draggable.setXConstraint(parseInt(YAHOO.util.Dom.getX(panel.HTML)), (4000 - parseInt(YAHOO.util.Dom.getX(panel.HTML))));
		panel.draggable.setYConstraint((parseInt(YAHOO.util.Dom.getY(panel.HTML)) - 40), (4000 - parseInt(YAHOO.util.Dom.getY(panel.HTML))));
		
		panel.yResize = new YAHOO.util.Resize(panel.id, {
			
			proxy: false,
			autoRatio: false,
			minWidth: 100,
			minHeight: 150
		
		});
		
		// Setup resize handler to update the size of the panel's body element
		// whenever the size of the 'resizablepanel' DIV changes
		panel.yResize.on('resize', function(e, panel){
		
		
			var panelHeight = parseInt(panel.HTML.style.height);
			var panelWidth = parseInt(panel.HTML.style.width);
			
			var headerHeight = panel.HTML.firstChild.offsetHeight; // Content + Padding + Border
			var headerWidth = panel.HTML.firstChild.offsetWidth;
			
			if (panel.HTML.childNodes[2]) {
				var footerHeight = panel.HTML.childNodes[2].offsetHeight; // Content + Padding + Border
				var footerWidth = panel.HTML.childNodes[2].offsetWidth;
			}
			else {
				footerHeight = 0;
				foorterWidth = 0;
			}
			var bodyHeight = (panelHeight - headerHeight - footerHeight);
			var bodyWidth = (panelWidth - headerWidth - footerWidth);
			var bodyContentHeight = bodyHeight;
			if (bodyWidth < 0) {
				bodyWidth *= (-1);
			}
			if (bodyHeight < 0) {
				bodyHeight *= -1;
			}
			
			
			
			YAHOO.util.Dom.setStyle(panel.content.DOM, 'height', bodyHeight + 'px');
			
			
		}, panel, true);
		
		
		panel.panelReady.fire(panel);
	},

pinTab: function(e,obj){
	
	obj.pinEvent.fire(obj);
	
},
close: function(e,obj){
	
	
	//obj.resetHeader.fire();
	obj.HTML.parentNode.removeChild(obj.HTML);
	
	
},
changeTransparency: function(e, args){

	panel = args.panel;
	more = false;
	more = args.more;


	percent = YAHOO.util.Dom.getStyle(panel.HTML,"opacity");
	if (more) {
		if (percent > .1) {
			percent = percent - .1;
		}
	}
	else {
		if (percent < 1) {
			
			percent = parseFloat(percent) + .1;
		}
	}
	
	
	
	YAHOO.util.Dom.setStyle(panel.HTML,"filter","alpha(opacity="+percent*100+");");
	YAHOO.util.Dom.setStyle(panel.HTML,"opacity",percent);

}
}
