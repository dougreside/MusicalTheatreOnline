
XMLDoc = function(src){
	this.src = src;

	newText = this.loadXMLString(src);
	this.XML = (new DOMParser()).parseFromString(newText, "text/xml");			
}
XMLDoc.prototype.loadXMLString = function(filename){
	var req = new GetXmlHttpObject();
    req.open('GET', './lib/XMLDoc/importXML.php?fn='+filename, false);
    req.send(null);
    newText =  req.responseText;

	return newText;	
	
}
XMLDoc.prototype.getTextNodes=function(node){
		var result = Array();
		var sub = "";
		var kids = node.childNodes;
	
		for (var i in kids){
			if (kids[i].nodeName == "#text"){
			
				result[result.length]=(kids[i]);
			}
			else{
				sub = this.getTextNodes(kids[i]);
				
				if (sub.length > 0) {
					result = result+sub;
				}
			}	
		}
		return result;
	
}
XMLDoc.prototype.XMLSubstring=function(offset,length){
	allTexts=this.getTextNodes(this.XML.documentElement);
	for (i in allTexts){
		
	}
	
}
XMLDoc.prototype.getElementAtOffset = function(offset){
	
}
XMLDoc.prototype.getOffsetOfElement = function(){
	
}
XMLDoc.prototype.XMLtoString=function(){
	// From : http://extjs.com/forum/showthread.php?t=34553
	
	var serialized;
	
	try {
		// XMLSerializer exists in current Mozilla browsers
		serializer = new XMLSerializer();
		serialized = serializer.serializeToString(this.XML);
	} 
	catch (e) {
		// Internet Explorer has a different approach to serializing XML
		serialized = this.XML.xml;
	}
	
	return serialized;
}
