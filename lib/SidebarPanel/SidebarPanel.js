SidebarPanel = function(id,heading){
	this.DOM = document.createElement("div");
	this.DOM.className="sidebar_panel";
	this.DOM.id = id;
	
	this.heading = document.createElement("h4");
	
	this.heading.appendChild(document.createTextNode(heading));
	this.DOM.appendChild(this.heading);
	
	
}
SidebarPanel.prototype={
	remove: function(){
		this.DOM.parentNode.removeChild(this.DOM);
	}
}
	