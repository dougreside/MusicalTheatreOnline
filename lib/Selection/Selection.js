Selection = function(htmlObj){
	this.htmlObj=htmlObj;
	this.userSelection = null; //for Mozilla, opera
	this.userRange = null; //for IE
	
	this.selectionTouched=new YAHOO.util.CustomEvent("selectionTouched");
	this.valueCall=new YAHOO.util.CustomEvent("valueCall");
}
Selection.prototype.getRangeObject=function(selectionObject) {
	// From http://www.quirksmode.org/dom/range_intro.html
	if (selectionObject.getRangeAt)
		return selectionObject.getRangeAt(0);
	else { // Safari!
		var range = document.createRange();
		range.setStart(selectionObject.anchorNode,selectionObject.anchorOffset);
		range.setEnd(selectionObject.focusNode,selectionObject.focusOffset);
		return range;
	}
}

/***
 * Initializes the range/selection
 * depending on the browser
 * 
 * 
 * @param {Object} obj (Selection Object)
 * 
 */
Selection.prototype.init=function(obj){
	
	if (window.getSelection) {
		obj.userSelection = window.getSelection();
	}
	else 
		if (document.selection) { // should come last; Opera!
			obj.userSelection = document.selection.createRange();
		}
		
	//create range object
	obj.userRange=obj.getRangeObject(obj.userSelection);

}

/***
 * Returns an array with information
 * on range values and range nodes
 * 
 * Params:
 * Selection Object 'obj'
 */
Selection.prototype.getRangeValue=function(obj, mousex, mousey){
	var startNode, endNode, startValue, endValue;
	
	//if(!(obj.userSelection==null)){
		if (obj.userSelection.anchorNode) {

			startNode = obj.userSelection.anchorNode;
			endNode = obj.userSelection.focusNode;
			startValue = obj.userSelection.anchorOffset;
			endValue = obj.userSelection.focusOffset;
		} else {
		
			startNode = obj.userSelection.startContainer;
			endNode = obj.userSelection.endContainer;
			startValue = obj.userSelection.startOffset;
			endValue = obj.userSelection.endOffset;
		}
		
		
		var text=obj.userSelection;
		/*if(obj.userSelection.length > 40){
			var pOne=obj.userSelection.substring(0, 19);
			var pTwo=obj.userSelection.substring((obj.userSelection.length-19));
			text=pOne+"..."+pTwo;
			
		}*/
		//startNode=(!(startNode.nodeName=='#text')) ? startNode : startNode.parentNode;
		//endNode=(!(endNode.nodeName=='#text')) ? endNode:endNode.parentNode;
		
	//	if ((!(startValue == endValue)) && ((startNode.nodeName == "#text") && (endNode.nodeName == "#text"))) {
		
		
			return {
				mousex: mousex,
				mousey: mousey,
				startNode: startNode,
				endNode: endNode,
				startValue: startValue,
				endValue: endValue,
				
				text: text
			};
			
	//	}
	//	else {
	//		return null;
	//	}
	/*}
	else{
		return null;
	}*/
}


