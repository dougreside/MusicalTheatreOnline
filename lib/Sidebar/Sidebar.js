Sidebar = function(){
	this.DOM=document.createElement("div");
	this.DOM.id=YAHOO.util.Dom.generateId(this,"Sidebar");
	this.DOM.className="Sidebar";
	this.panels = [];
}
Sidebar.prototype={
	addPanel:function(sbPanel){
		this.DOM.appendChild(sbPanel.DOM);
		this.panels[sbPanel.DOM.id]=sbPanel;
	},
	removePanel:function(sbPanel){
		this.panels[sbPanel.DOM.id]=null;
		this.DOM.removeChild(sbPanel.DOM);

	},
	hidePanel:function(sbPanel){
		YAHOO.util.DOM.setStyle(sbPanel.DOM,"display","none");
	},
	showPanel:function(sbPanel){
		YAHOO.util.DOM.setStyle(sbPanel.DOM,"display","block");
	}
}
