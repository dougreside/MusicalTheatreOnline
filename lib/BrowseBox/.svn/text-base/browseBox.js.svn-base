
Popup = function(args){

	this.DOM = document.createElement("div");
	this.DOM.className = "browsepEnclose";
	
	this.DOM.innerHTML = loadContent("./lib/BrowseBox/browseBox.xml");
	this.DOM = this.DOM.firstChild;
		YAHOO.util.Dom.generateId(this.DOM, "panel");
this.id = this.DOM.id;
		var pieces = this.DOM.childNodes;
			for (var p in pieces){
				switch(pieces[p].className){
					case "boxTop":
					this.bt = pieces[p];
					break;
					case "hd":
					this.hd = pieces[p];
						break;
							case "bd":
						this.bd = pieces[p];
				
						break;
					case "ft":
						this.ft = pieces[p];
						
						break;
					case "boxBottom":
				
						this.bb = pieces[p];
						break;
					
						
				}
			}

	


	this.panelClicked=new YAHOO.util.CustomEvent("panelClicked");
	this.panelReady=new YAHOO.util.CustomEvent("panelReady");
	this.resetHeader=new YAHOO.util.CustomEvent("resetHeader");
	
	this.textCon = this.bd.getElementsByTagName("div")[0];

	this.textCon.appendChild(args.content);
	//this.tabName = args[0].id;
	
	/*
	
	
	this.header = this.DOM.firstChild.getElementsByTagName("div")[0];
	var newtxt = document.createElement("p");
	newtxt.appendChild(document.createTextNode(args.label));
	var th = this.header.getElementsByTagName("p")[0];
	this.header.replaceChild(newtxt,th);
//	YAHOO.util.Dom.generateId(this.header, "panelHeader");
	this.content = this.DOM.firstChild.getElementsByTagName("div")[1];
	this.textCon = this.content.getElementsByTagName("div")[0];
	this.textCon.appendChild(args.content);

	this.pinEvent = new YAHOO.util.CustomEvent("pinEvent");
*/
	// Default Events
	YAHOO.util.Event.addListener(this.DOM,"click",this.handleClick,this);		
	YAHOO.util.Event.onAvailable(this.DOM.id, function(obj){
		//$("#"+obj.DOM.id).draggable();
		//$("#"+obj.DOM.id).resizable();
		
		obj.makePanelResize(obj);

	}, this);
	
	};
Popup.prototype={	
	setContent: function(content){

		this.content.setContent(content);
		
	},
	setHeader: function(panel){

	
	
	
	/*
	this.closeButton = new PanelButton("closeButton", "Close");
	this.header.appendChild(this.closeButton.HTML);
	this.popBack = new PanelButton("pin","Pin to tab");
	this.header.appendChild(this.popBack.HTML);
	YAHOO.util.Event.addListener(this.closeButton.HTML, 'click', this.close, panel);
	YAHOO.util.Event.addListener(this.popBack.HTML, 'click', this.pinTab, panel);*/
},
	makePanelResize: function(panel){

		//panel.setHeader(panel);
		//make sure window is placed below project bar
		//YAHOO.util.Dom.setStyle(panel.DOM, 'top', '55px');
		
		panel.draggable = new YAHOO.util.DDProxy(panel.id);
	//	panel.draggable.setHandleElId(panel.header.id); //can only drag by clicking on handle
		panel.draggable.setXConstraint(parseInt(YAHOO.util.Dom.getX(panel.DOM)), (4000 - parseInt(YAHOO.util.Dom.getX(panel.DOM))));
		panel.draggable.setYConstraint(0, (4000 - parseInt(YAHOO.util.Dom.getY(panel.DOM))));
		/*panel.draggable.on("b4MouseDownEvent",function(a){
		

			if (a["originalTarget"].className) {
				//alert("showing class name "+(a["originalTarget"].className));
				if ((a["originalTarget"].className == "popup") || (a["originalTarget"].className == "hd")) {
					return true;
				}
				else{
					return false;
				}
			}
			else{
				return false;
			}
			return true;
			
		});*/
		
		panel.Resize = new YAHOO.util.Resize(panel.id, {
	
			proxy: true,
			autoRatio: false,
		
		
		
		});
		
		
		// Setup resize handler to update the size of the panel's body element
		// whenever the size of the 'resizablepanel' DIV changes
		panel.Resize.on('resize', panel.adjustSize, panel, true);
		
	//	panel.adjustSize(null,panel);
		panel.panelReady.fire(panel);
	},
adjustSize:function(e, panel){
			
			
			/*pieces = panel.DOM.firstChild.getElementsByTagName("div");
		
			var panelHeight = parseInt(YAHOO.util.DOM.getStyle(panel.DOM,"height"));
			var panelWidth = parseInt(YAHOO.util.DOM.getStyle(panel.DOM,"width"));
			
			var headerHeight = pieces[0].offsetHeight; // Content + Padding + Border
			var headerWidth = pieces[0].offsetWidth;
			
			if (pieces[2]) {
				
				var footerHeight = pieces[2].offsetHeight+10; // Content + Padding + Border
			//	YAHOO.util.Dom.setStyle(pieces[1], 'height', (footerHeight+26) + 'px');
				var footerWidth = pieces[2].offsetWidth;
			}
			else {
				footerHeight = 0;
				footerWidth = 0;
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
			
			
			bodyHeight=bodyHeight-26;
			YAHOO.util.Dom.setStyle(pieces[1], 'height', bodyHeight + 'px');*/
			hdr = YAHOO.util.Dom.getRegion(panel.hd);
			ftr = YAHOO.util.Dom.getRegion(panel.ft);
			btr = YAHOO.util.Dom.getRegion(panel.bt);
			bbr = YAHOO.util.Dom.getRegion(panel.bb);
			
			hdh = hdr.bottom-hdr.top;
			bth = btr.bottom-btr.top;
			bbh = bbr.bottom-bbr.top;
			fth = ftr.bottom-ftr.top; 
			
	
			htotal = parseInt(YAHOO.util.Dom.getStyle(panel.DOM.id,"height"));
				
			wtotal = parseInt(YAHOO.util.Dom.getStyle(panel.DOM.id,"width"));
			var other = hdh+fth+bbh+bth;
			bodyHeight = htotal-other; 
		

		//	YAHOO.util.Dom.setStyle(panel.DOM.firstChild, 'height', (htotal) + 'px');
		//	YAHOO.util.Dom.setStyle(panel.DOM.firstChild, 'width', (wtotal) + 'px');
			YAHOO.util.Dom.setStyle(panel.bd, 'height', bodyHeight + 'px');
			YAHOO.util.Dom.setStyle(panel.textCon, 'height', (bodyHeight-20) + 'px');
	//		YAHOO.util.Dom.setStyle(pieces[2].firstChild, 'height', (bodyHeight-16) + 'px');	
				
		//	YAHOO.util.Dom.setStyle(panel.DOM, 'height', total + 'px');
			
			
		
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

},
handleClick:function(){

}
}
