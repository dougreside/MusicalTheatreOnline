TOC = function(){
	this.DOM = document.createElement("div");	
}
TOC.prototype = {
	addEntry: function(text,id,level,action){
		TOCEntry = document.createElement("div");
		TOCEntry.className="TOCEntry";
		TOCEntry.appendChild(document.createTextNode(text));
		YAHOO.util.Event.addListener(TOCEntry,"click",action);			
	},
	addHeader: function(text){
	}
}
