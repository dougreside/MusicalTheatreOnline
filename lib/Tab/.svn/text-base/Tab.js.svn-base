Tab = function(id,label,mainTitle,content, isText, hasMusic){
	this.hasMusic = hasMusic;
	this.DOM = document.createElement("li");
	this.label = label;
	YAHOO.util.Dom.generateId(this.DOM,"tab");
	this.id = this.DOM.id;
	this.outerSpan = document.createElement("span");
	this.DOM.appendChild(this.outerSpan);
	this.textSpan = document.createElement("a");
	var shortLabel = label;
	if (shortLabel.length > 20) {
	shortLabel = shortLabel.substring(0,20);
	shortLabel = shortLabel+"...";
	}
	
	this.textSpan.appendChild(document.createTextNode(shortLabel));
	this.isText = isText;
	this.content = content.cloneNode(true);
	
	this.mainTitle = mainTitle;
	this.textID = id;
	if (isText) {
		this.popOutButton = document.createElement("img");
		this.popOutButton.className = "tab_btn tab_popout";
		this.popOutButton.src = "./lib/Tab/assets/images/pop-out-icon.png";
		this.popOutButton.alt = "Pop out tab";
		
		YAHOO.util.Event.addListener(this.popOutButton, "click", function(e, obj){
			YAHOO.util.Event.stopEvent(e);
			obj.popOut();
		}, this);
			this.textSpan.appendChild(this.popOutButton);
		
	}
	this.closeTab = document.createElement("img");
	this.closeTab.className = "tab_btn tab_close";
	this.closeTab.src = "./lib/Tab/assets/images/close-icon.png";
	this.closeTab.alt = "Close tab";
	YAHOO.util.Event.addListener(this.closeTab,"click",function(e,obj){
	
		YAHOO.util.Event.stopEvent(e);
		obj.close();
	
	
	},this);
	
	//this.innerTab.appendChild(this.textSpan);


		
	this.textSpan.appendChild(this.closeTab);
	
	this.outerSpan.appendChild(this.textSpan);

	YAHOO.util.Event.addListener(this.DOM,"click",function(e,obj){
		
		obj.makeActive(obj);		
	},this);

	this.tabActive = new YAHOO.util.CustomEvent("tabActivate");
	this.tabPop = new YAHOO.util.CustomEvent("tabPop");
	this.tabClose = new YAHOO.util.CustomEvent("tabClose");
	
	YAHOO.util.Event.onAvailable(this.DOM.id,function(tab){
		tab.makeActive(tab);
	},this);		
}

Tab.prototype = {
	makeActive: function(tab){
		
		tab.DOM.className = "active";
		
		tab.tabActive.fire(tab);
	},
	deactivate: function(tab){
	
		tab.DOM.className = "";
		
	},
	popOut: function(){

		YAHOO.util.Dom.setStyle(this.DOM,"display","none");
		this.tabPop.fire(this);
		
	},
	close: function(){
		
		this.tabClose.fire(this);
		this.DOM.parentNode.removeChild(this.DOM);
		
	},
	hide: function(){
		
		YAHOO.util.Dom.setStyle(this.DOM.id,"display","none");
	},
	show: function(){
		YAHOO.util.Dom.setStyle(this.DOM.id,"display","block");
	}
}
