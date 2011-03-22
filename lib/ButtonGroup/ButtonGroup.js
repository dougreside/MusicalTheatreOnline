ButtonGroup = function(labelText,buttonArray,className){
	this.HTML = document.createElement("div");
	this.HTML.className = className;
	this.HTML.id = YAHOO.util.Dom.generateId(this,"ButtonGroup");
	this.textLabelSpan = document.createElement("span");
	this.textLabelSpan.className = "textLabelSpan";
	this.textLabelSpan.appendChild(document.createTextNode(labelText));
	this.HTML.appendChild(this.textLabelSpan);
	for (i in buttonArray){
		
		this.HTML.appendChild(buttonArray[i].HTML);
	}
	
}
