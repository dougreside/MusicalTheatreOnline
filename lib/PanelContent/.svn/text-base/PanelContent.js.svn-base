PanelContent = function(id,listeners,events,content){
	this.listners = listeners;
	this.events = events;
	this.DOM = document.createElement("div");
	this.DOM.className = "panelBody";
	this.id = id; 
	this.panelContentReady=new YAHOO.util.CustomEvent("panelContentReady");
	this.setContent(content);
}
PanelContent.prototype = {
	
	setContent : function(obj){
		
		if (this.DOM.firstChild){
			
			this.DOM.removeChild(this.DOM.firstChild);
			firstChi = document.createElement("div");
			//this.DOM.appendChild(obj);
	
			this.DOM.appendChild(firstChi);
			firstChi.appendChild(obj);
		
		}
		else{
			
			this.DOM.appendChild(obj);
		}
	   
	}
}
